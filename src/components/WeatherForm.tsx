/**
 * Form component for submitting a city weather search.
 */

type WeatherFormProps = {
  onSearch: (city: string) => void;
  isLoading: boolean;
};

/**
 * Renders the city search form and delegates submissions to the parent.
 *
 * @param props - Component props.
 * @param props.onSearch - Callback invoked with the trimmed city name.
 * @param props.isLoading - Whether a search request is currently in progress.
 * @returns The search form UI.
 */
export default function WeatherForm({ onSearch, isLoading }: WeatherFormProps) {

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
    <form onSubmit={handleSubmit}>
      <input
        name="city"
        type="text"
        placeholder="Enter city name"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
