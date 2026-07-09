/**
 * Select component for selecting a unit group.
 */
import { useUnitGroup } from '../hooks/useUnitGroup';
import type { UnitGroup } from '../context/UnitGroupContext';

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
