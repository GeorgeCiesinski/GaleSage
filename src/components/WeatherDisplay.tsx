/**
 * Location card with multi-day forecast carousel, day navigation, and refresh/remove controls.
 */
import { useState } from 'react';
import { formatDayLabel } from '../utils/forecastFormatter';
import { buildSlimAlerts } from '../utils/alertSummary';
import {
  buildCityForecastDays,
  buildDayForecastDays,
  buildSeededAdviceText,
} from '../utils/adviceForecast';
import { fetchAdvice } from '../api/adviceClient';
import { useUnitGroup } from '../hooks/useUnitGroup';
import WeatherAlertsPanel from './WeatherAlertsPanel';
import DayWeatherPanel from './DayWeatherPanel';
import WeatherAdvisor from './WeatherAdvisor';
import type { WeatherCard } from '../types/weather';
import type { AdviceMessage, AdviceScope } from '../types/advice';

type WeatherDisplayProps = {
  card: WeatherCard;
  onRefresh: (id: string) => void;
  onRemove: (id: string) => void;
};

/**
 * Renders a location weather card with a multi-day forecast carousel.
 *
 * Shows a seeded weather advice field (no AI on load), city/day Ask menus that
 * share one session history, and a 15-day forecast carousel with previous/next
 * controls.
 *
 * @param props - Component props.
 * @param props.card - Weather card state including location, forecast data, and loading/error flags.
 * @param props.onRefresh - Callback invoked when the user clicks Refresh (resets to today).
 * @param props.onRemove - Callback invoked with the card id when Remove is clicked.
 * @returns The weather card UI.
 */
export default function WeatherDisplay({ card, onRefresh, onRemove }: WeatherDisplayProps) {
  const { id, query, location, data, isLoading, error } = card;
  const locationLabel = location?.displayName ?? query;
  const days = data?.days ?? [];
  const { unitGroup } = useUnitGroup();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [history, setHistory] = useState<AdviceMessage[]>([]);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [scopeHint, setScopeHint] = useState<string | null>(null);

  const slimAlerts = buildSlimAlerts(data?.alerts ?? []);
  const seededText = buildSeededAdviceText(data?.description, slimAlerts.count);
  const adviceText = aiAnswer ?? seededText;

  function clearAdviceSession() {
    setAiAnswer(null);
    setHistory([]);
    setAdviceError(null);
    setScopeHint(null);
  }

  async function askAdvice(scope: AdviceScope, question: string, dayIndex?: number) {
    const trimmed = question.trim();
    if (!data || !trimmed || isAdviceLoading) return;

    const cityName = location?.displayName ?? query;
    if (!cityName.trim()) return;

    if (scope === 'day') {
      if (dayIndex === undefined || !data.days[dayIndex]) return;
    }

    setIsAdviceLoading(true);
    setAdviceError(null);
    setScopeHint(
      scope === 'city'
        ? 'Asking about this city'
        : `Asking about ${formatDayLabel(dayIndex!, data.days[dayIndex!].datetime)}`,
    );

    const forecastDays =
      scope === 'city'
        ? buildCityForecastDays(data.days, unitGroup)
        : buildDayForecastDays(data.days[dayIndex!], unitGroup);

    try {
      const answer = await fetchAdvice({
        scope,
        location: cityName,
        question: trimmed,
        history: history.slice(-6),
        days: forecastDays,
        alerts: slimAlerts,
      });
      setAiAnswer(answer);
      setHistory((prev) => [
        ...prev,
        { role: 'user', content: trimmed },
        { role: 'assistant', content: answer },
      ]);
    } catch (err) {
      setAdviceError(err instanceof Error ? err.message : 'Advice request failed');
    } finally {
      setIsAdviceLoading(false);
    }
  }

  return (
    <div className="weather-display">
      <div className="card-actions">
        <button
          type="button"
          className="refresh-btn"
          onClick={() => {
            setSelectedDayIndex(0);
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

      {data && (
        <>
          {data.alerts?.length ? <WeatherAlertsPanel alerts={data.alerts} /> : null}

          <WeatherAdvisor
            adviceText={adviceText}
            isLoading={isAdviceLoading}
            error={adviceError}
            scopeHint={scopeHint}
            onAskCity={(q) => void askAdvice('city', q)}
            disabled={isAdviceLoading}
          />

          {days.length === 0 ? (
            <p>No forecast data available.</p>
          ) : (
            <>
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
                      <div className="day-slide" key={day.datetime}>
                        <DayWeatherPanel
                          day={day}
                          dayIndex={index}
                          isActive={index === selectedDayIndex}
                          onAskDay={(q) => void askAdvice('day', q, index)}
                          disabled={isAdviceLoading}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
