/**
 * useUnitGroup hook.
 *
 * Provides typed access to the active unit group and set function from
 * UnitGroupContext, and guards against being called outside of a UnitGroupProvider.
 */
import { useContext } from 'react';
import { UnitGroupContext } from '../context/UnitGroupContext';

/**
 * Reads the current unit group and set function from UnitGroupContext.
 *
 * @throws If called outside of a UnitGroupProvider.
 * @returns The active unit group and a function to set it.
 */
export function useUnitGroup() {
  const context = useContext(UnitGroupContext);

  if (context === undefined) {
    throw new Error('useUnitGroup must be used within a UnitGroupProvider');
  }

  return context;
}
