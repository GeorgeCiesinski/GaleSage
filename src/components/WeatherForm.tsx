/**
 * Form component for adding a location.
 */
import type { Ref } from 'react';

type WeatherFormProps = {
  onSearch: (location: string) => void;
  isAtLimit: boolean;
  feedbackMessage?: string;
  isGeocoding?: boolean;
  inputRef?: Ref<HTMLInputElement>;
};

/**
 * Renders the location search form and delegates submissions to the parent.
 *
 * @param props - Component props.
 * @param props.onSearch - Callback invoked with the trimmed location name.
 * @param props.isAtLimit - Whether the maximum number of location cards is already displayed.
 * @param props.feedbackMessage - Optional status or error message shown under the form.
 * @param props.isGeocoding - Whether a location lookup is in progress (disables the form).
 * @param props.inputRef - Optional ref to the location text input (e.g. for autofocus).
 * @returns The search form UI.
 */
export default function WeatherForm({
  onSearch,
  isAtLimit,
  feedbackMessage,
  isGeocoding = false,
  inputRef,
}: WeatherFormProps) {
  /**
   * Handles form submission and forwards a trimmed location name to the parent.
   *
   * @param event - The form submit event.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const location = String(formData.get('location') ?? '').trim();
    if (!location) return;
    onSearch(location);
  }

  return (
    <>
      <form className="weather-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          name="location"
          type="text"
          placeholder="Add a location…"
          disabled={isAtLimit || isGeocoding}
          autoComplete="off"
        />
        <button type="submit" disabled={isAtLimit || isGeocoding}>
          {isGeocoding ? 'Searching...' : 'Search'}
        </button>
      </form>
      {feedbackMessage && <p className="limit-message">{feedbackMessage}</p>}
      {isAtLimit && (
        <p className="limit-message">Maximum of 3 locations. Remove one to add another.</p>
      )}
    </>
  );
}
