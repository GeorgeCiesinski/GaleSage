/**
 * Select component for selecting a unit group.
 */

export default function UnitGroupSelect() {
  const { unitGroup, setUnitGRoup } = useUnitGroup();

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
