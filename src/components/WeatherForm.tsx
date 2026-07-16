/**
 * Form component for adding a city.
 */

type WeatherFormProps = {
  onSearch: (city: string) => void;
  isAtLimit: boolean;
  feedbackMessage?: string;
  isGeocoding?: boolean;
};

/**
 * Renders the city search form and delegates submissions to the parent.
 *
 * @param props - Component props.
 * @param props.onSearch - Callback invoked with the trimmed city name.
 * @param props.isAtLimit - Whether the maximum number of city cards is already displayed.
 * @returns The search form UI.
 */
export default function WeatherForm({
  onSearch,
  isAtLimit,
  feedbackMessage,
  isGeocoding = false,
}: WeatherFormProps) {
  /**
   * Handles form submission and forwards a trimmed city name to the parent.
   *
   * @param event - The form submit event.
   * @returns void
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const city = String(formData.get('city') ?? '').trim();
    if (!city) return;
    onSearch(city);
  }

  return (
    <>
      <form className="weather-form" onSubmit={handleSubmit}>
        <input
          name="city"
          type="text"
          placeholder="Enter city name"
          disabled={isAtLimit || isGeocoding}
        />
        <button type="submit" disabled={isAtLimit || isGeocoding}>
          {isGeocoding ? 'Searching...' : 'Search'}
        </button>
      </form>
      {feedbackMessage && <p className="limit-message">{feedbackMessage}</p>}
      {isAtLimit && (
        <p className="limit-message">Maximum of 3 cities. Remove one to add another.</p>
      )}
    </>
  );
}
