/**
 * Top-of-card weather advice region.
 *
 * Shows seeded forecast text until the user asks the AI. Loading, error, and
 * scope hint are optional and used once ask wiring is added.
 */
type WeatherAdvisorProps = {
  adviceText: string;
  isLoading?: boolean;
  error?: string | null;
  scopeHint?: string | null;
};

/**
 * Renders the weather advice field for a location card.
 *
 * Displays the current advice text and optional loading, error, and scope-hint
 * status. Does not fetch advice itself — the parent supplies all content.
 *
 * @param props - Component props.
 * @param props.adviceText - Seeded overview or latest AI answer.
 * @param props.isLoading - Whether an advice request is in progress.
 * @param props.error - Error message to show after a failed request.
 * @param props.scopeHint - Light hint for the current ask scope/day.
 * @returns The weather advice UI region.
 */
export default function WeatherAdvisor({
  adviceText,
  isLoading = false,
  error = null,
  scopeHint = null,
}: WeatherAdvisorProps) {
  return (
    <div className="weather-advisor">
      <h3>Weather advice</h3>
      {scopeHint ? <p className="weather-advisor__hint">{scopeHint}</p> : null}
      <p className="weather-advisor__text">{adviceText}</p>
      {isLoading ? <p className="weather-advisor__status">Thinking…</p> : null}
      {error ? <p className="weather-advisor__error">{error}</p> : null}
    </div>
  );
}
