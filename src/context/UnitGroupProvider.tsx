/**
 * Unit group context: shares the preferred unit group across the component tree.
 *
 * Exposes a UnitGroupProvider that owns the unit group state.
 */
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { UNIT_GROUPS, UnitGroupContext } from './UnitGroupContext';
import type { UnitGroup } from './UnitGroupContext';

/**
 * Retrieves saved unit group preference from local storage if it exists, otherwise
 * returns the default unit group.
 *
 * @returns The initial unit group.
 */
function getInitialUnitGroup(): UnitGroup {
  const saved = localStorage.getItem('unitGroup');
  if (saved && UNIT_GROUPS.includes(saved as UnitGroup)) {
    return saved as UnitGroup;
  }
  return 'metric';
}

/**
 * Provides unit group state to all descendants and persists changes.
 *
 * Owns the single source of unit group state, and mirrors it to local
 * storage on every change.
 *
 * @param props - Component props.
 * @param props.children - The subtree that can access the unit group.
 * @returns The provider wrapping the given children.
 */
export function UnitGroupProvider({ children }: { children: ReactNode }) {
  const [unitGroup, setUnitGroup] = useState<UnitGroup>(getInitialUnitGroup);

  useEffect(() => {
    localStorage.setItem('unitGroup', unitGroup);
  }, [unitGroup]);

  return (
    <UnitGroupContext.Provider value={{ unitGroup, setUnitGroup }}>
      {children}
    </UnitGroupContext.Provider>
  );
}
