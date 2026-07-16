/**
 * Top-of-card weather advice region with city-scope Ask controls.
 *
 * Shows seeded forecast text until the user asks the AI. Does not fetch —
 * parent supplies text/status and handles onAskCity.
 */
import AdviceQuestionMenu from './AdviceQuestionMenu';

const CITY_PRESETS = [
  'What should I wear over the next few days?',
  'Any good days for outdoor plans?',
  'Do I need an umbrella soon?',
  'Will it feel hot or cold?',
  'Anything I should watch for?',
] as const;

type WeatherAdvisorProps = {
  adviceText: string;
  isLoading?: boolean;
  error?: string | null;
  scopeHint?: string | null;
  onAskCity: (question: string) => void;
  disabled?: boolean;
};

/**
 * Renders the weather advice field and city Ask menu for a location card.
 *
 * @param props - Component props.
 * @param props.adviceText - Seeded overview or latest AI answer.
 * @param props.isLoading - Whether an advice request is in progress.
 * @param props.error - Error message to show after a failed request.
 * @param props.scopeHint - Light hint for the current ask scope/day.
 * @param props.onAskCity - Called when the user asks a city-scope question.
 * @param props.disabled - Disables Ask controls while loading.
 * @returns The weather advice UI region.
 */
export default function WeatherAdvisor({
  adviceText,
  isLoading = false,
  error = null,
  scopeHint = null,
  onAskCity,
  disabled = false,
}: WeatherAdvisorProps) {
  return (
    <div className="weather-advisor">
      <h3>Weather advice</h3>
      {scopeHint ? <p className="weather-advisor__hint">{scopeHint}</p> : null}
      <p className="weather-advisor__text">{adviceText}</p>
      {isLoading ? <p className="weather-advisor__status">Thinking…</p> : null}
      {error ? <p className="weather-advisor__error">{error}</p> : null}

      <AdviceQuestionMenu
        label="Ask about this city"
        presets={CITY_PRESETS}
        onAsk={onAskCity}
        disabled={disabled || isLoading}
        placeholder="Ask about the next several days..."
      />
    </div>
  );
}
