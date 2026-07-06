/**
 * Form component for selecting a location when multiple exist.
 */
import type { LocationResult } from '../types/location';

type LocationPickerProps = {
  query: string;
  locations: LocationResult[];
  onSelect: (location: LocationResult) => void;
  onCancel: () => void;
};

/**
 * Renders a list of geocoded location candidates when a search is ambiguous.
 *
 * @param props - Component props.
 * @param props.query - User's search term.
 * @param props.locations - List of locations matching search term (up to 5).
 * @param props.onSelect - Callback invoked when the user selects a result.
 * @param props.onCancel - Callback invoked when the user cancels the search.
 */
export default function LocationPicker({
  query,
  locations,
  onSelect,
  onCancel,
}: LocationPickerProps) {
  return (
    <div className="location-picker">
      <p>Multiple locations found for "{query}". Select one:</p>

      <ul className="location-picker__list">
        {locations.map((location) => (
          <li key={location.placeId}>
            <button
              type="button"
              className="location-picker__option"
              onClick={() => onSelect(location)}
            >
              {location.displayName}
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="location-picker__cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
