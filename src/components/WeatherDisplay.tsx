/**
 * Location card with multi-day forecast carousel, day navigation, and refresh/remove controls.
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { formatDayLabel } from '../utils/forecastFormatter';
import { buildSlimAlerts } from '../utils/alertSummary';
import {
  buildLocationForecastDays,
  buildDayForecastDays,
  buildSeededAdviceText,
} from '../utils/adviceForecast';
import { fetchAdvice } from '../api/adviceClient';
import { useUnitGroup } from '../hooks/useUnitGroup';
import WeatherAlertsPanel from './WeatherAlertsPanel';
import DayWeatherPanel from './DayWeatherPanel';
import AdviceAdvisorOverlay from './AdviceAdvisorOverlay';
import type { WeatherCard } from '../types/weather';
import type { AdviceMessage, AdviceScope } from '../types/advice';

type WeatherDisplayProps = {
  card: WeatherCard;
  onRefresh: (id: string) => void;
  onRemove: (id: string) => void;
  /** When false on mobile/tablet, the card is hidden so only the active pager location shows. */
  isActive?: boolean;
};

/**
 * Renders a location weather card with a multi-day forecast carousel.
 *
 * Advisor chat lives in a per-card overlay opened via Ask Advisor. Session history
 * is kept for UI display only and is not sent to the AI.
 *
 * @param props - Component props.
 * @param props.card - Weather card state including location, forecast data, and loading/error flags.
 * @param props.onRefresh - Callback invoked when the user clicks Refresh (resets to today).
 * @param props.onRemove - Callback invoked with the card id when Remove is clicked.
 * @param props.isActive - When false on mobile/tablet, the card is hidden so only the active pager location shows.
 * @returns The weather card UI.
 */
export default function WeatherDisplay({
  card,
  onRefresh,
  onRemove,
  isActive = true,
}: WeatherDisplayProps) {
  const { id, query, location, data, isLoading, error } = card;
  const locationLabel = location?.displayName ?? query;
  const days = data?.days ?? [];
  const { unitGroup } = useUnitGroup();

  const advisorOverlayId = useId();
  const askAdvisorButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [history, setHistory] = useState<AdviceMessage[]>([]);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const wasAdvisorOpenRef = useRef(false);

  const slimAlerts = buildSlimAlerts(data?.alerts ?? []);
  const seededText = buildSeededAdviceText(data?.description, slimAlerts.count);
  const selectedDayLabel =
    days.length > 0
      ? formatDayLabel(selectedDayIndex, days[selectedDayIndex].datetime)
      : 'Selected day';

  // Restore focus to Ask Advisor after the overlay closes.
  useEffect(() => {
    if (wasAdvisorOpenRef.current && !isAdvisorOpen) {
      const frameId = requestAnimationFrame(() => {
        askAdvisorButtonRef.current?.focus({ preventScroll: true });
      });
      wasAdvisorOpenRef.current = false;
      return () => cancelAnimationFrame(frameId);
    }
    wasAdvisorOpenRef.current = isAdvisorOpen;
  }, [isAdvisorOpen]);

  // Close advisor when this card is no longer the active pager card (mobile).
  useEffect(() => {
    if (!isActive) setIsAdvisorOpen(false);
  }, [isActive]);

  /**
   * Resets chat history and advice error to the seeded empty state.
   */
  function clearAdviceSession(): void {
    setHistory([]);
    setAdviceError(null);
  }

  /**
   * Closes the advisor overlay without clearing session history.
   */
  const closeAdvisor = useCallback((): void => {
    setIsAdvisorOpen(false);
  }, []);

  /**
   * Asks the weather advisor for the given scope and question.
   *
   * Appends the user message to UI history immediately, then fetches advice and
   * appends the assistant reply on success. Does not send prior conversation turns
   * to the API. Early-returns when forecast data is missing, the question is blank,
   * a request is already in flight, or day scope lacks a valid day.
   *
   * @param scope - Whether the question targets the multi-day location window or a single day.
   * @param question - User or preset question text.
   */
  async function askAdvice(scope: AdviceScope, question: string): Promise<void> {
    const trimmed = question.trim();
    if (!data || !trimmed || isAdviceLoading) return;

    const locationName = location?.displayName ?? query;
    if (!locationName.trim()) return;

    if (scope === 'day' && !data.days[selectedDayIndex]) return;

    setHistory((prev) => [...prev, { role: 'user', content: trimmed }]);
    setIsAdviceLoading(true);
    setAdviceError(null);

    const forecastDays =
      scope === 'location'
        ? buildLocationForecastDays(data.days, unitGroup)
        : buildDayForecastDays(data.days[selectedDayIndex], unitGroup);

    try {
      const answer = await fetchAdvice({
        scope,
        location: locationName,
        question: trimmed,
        history: [],
        days: forecastDays,
        alerts: slimAlerts,
      });
      setHistory((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setAdviceError(err instanceof Error ? err.message : 'Advice request failed');
    } finally {
      setIsAdviceLoading(false);
    }
  }

  return (
    <div className={`weather-display${isActive ? ' weather-display--active' : ''}`}>
      <div className="card-actions">
        <button
          type="button"
          className="refresh-btn"
          onClick={() => {
            setSelectedDayIndex(0);
            setIsAdvisorOpen(false);
            clearAdviceSession();
            onRefresh(id);
          }}
          disabled={isLoading}
        >
          {isLoading && data ? 'Refreshing...' : 'Refresh'}
        </button>
        <button
          type="button"
          className="remove-btn"
          onClick={() => onRemove(id)}
          aria-label={`Remove ${locationLabel}`}
        >
          x
        </button>
      </div>

      {location && <h2 className="location">{location.displayName}</h2>}

      {error && <p className="error">{error}</p>}
      {isLoading && !data && <p>Loading weather for {locationLabel}...</p>}

      <div className="weather-display__body">
        {data && (
          <>
            {data.alerts?.length ? <WeatherAlertsPanel alerts={data.alerts} /> : null}

            <div className="ask-advisor">
              <p className="ask-advisor__overview">{seededText}</p>
              <button
                ref={askAdvisorButtonRef}
                type="button"
                className="ask-advisor-btn"
                id={`${advisorOverlayId}-trigger`}
                aria-expanded={isAdvisorOpen}
                aria-controls={advisorOverlayId}
                onClick={() => setIsAdvisorOpen(true)}
              >
                Ask Advisor
              </button>
              <p className="ask-advisor__hint">
                Choose a day first to ask advice for that day.
              </p>
            </div>

            <AdviceAdvisorOverlay
              id={advisorOverlayId}
              isOpen={isAdvisorOpen}
              locationName={locationLabel}
              dayLabel={selectedDayLabel}
              history={history}
              isLoading={isAdviceLoading}
              error={adviceError}
              onClose={closeAdvisor}
              onAsk={(scope, question) => void askAdvice(scope, question)}
              disabled={isAdviceLoading}
            />

            {days.length === 0 ? (
              <p>No forecast data available.</p>
            ) : (
              <div className="day-carousel">
                <div className="day-nav">
                  <button
                    type="button"
                    className="day-nav-btn"
                    onClick={() => setSelectedDayIndex((i) => i - 1)}
                    disabled={selectedDayIndex === 0}
                    aria-label="Previous day"
                  >
                    {'<'}
                  </button>

                  <span className="day-label">
                    {formatDayLabel(selectedDayIndex, days[selectedDayIndex].datetime)}
                  </span>

                  <button
                    type="button"
                    className="day-nav-btn"
                    onClick={() => setSelectedDayIndex((i) => i + 1)}
                    disabled={selectedDayIndex === days.length - 1}
                    aria-label="Next day"
                  >
                    {'>'}
                  </button>
                </div>

                <div className="day-viewport">
                  <div
                    className="day-track"
                    style={{ '--day-index': selectedDayIndex } as React.CSSProperties}
                  >
                    {days.map((day, index) => (
                      <div
                        className="day-slide"
                        key={day.datetime}
                        inert={index === selectedDayIndex ? undefined : true} // Sets non-selected days as inert so they're not interactable
                      >
                        <DayWeatherPanel
                          day={day}
                          isActive={index === selectedDayIndex}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
