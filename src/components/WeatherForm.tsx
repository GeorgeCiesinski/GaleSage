type WeatherFormProps = {
  onSearch: (city: string) => void;
  isLoading: boolean;
};

export default function WeatherForm({ onSearch, isLoading }: WeatherFormProps) {

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
