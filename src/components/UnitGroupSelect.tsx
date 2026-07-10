/**
 * Header control for selecting the active unit group.
 */
import { useUnitGroup } from '../hooks/useUnitGroup';
import type { UnitGroup } from '../types/unitGroup';

/**
 * Renders a dropdown that sets the active unit group.
 *
 * Reads the current unit group from UnitGroupContext and updates it on
 * change. The preference is persisted to localStorage by UnitGroupProvider.
 *
 * @returns The unit group select element.
 */
export default function UnitGroupSelect() {
  const { unitGroup, setUnitGroup } = useUnitGroup();

  return (
    <select
      className="unit-group-select"
      value={unitGroup}
      onChange={(e) => setUnitGroup(e.target.value as UnitGroup)}
      aria-label="Unit system"
    >
      <option value="metric">Metric</option>
      <option value="us">US</option>
      <option value="uk">UK</option>
      <option value="base">Base</option>
    </select>
  );
}
