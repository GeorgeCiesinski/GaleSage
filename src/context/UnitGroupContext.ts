/**
 * UnitGroup context definition.
 *
 * Declares types and objects used to provide UnitGroup context, shared by the
 * UnitGroupProvider (which supplies the value) and the useUnitGroup hook (which
 * consumes it). Kept in its own module so both can import it without creating
 * a circular dependency.
 */
import { createContext } from 'react';

/** Visual Crossing unitGroup values supported by this app. */
export const UNIT_GROUPS = ['metric', 'us', 'uk', 'base'] as const;
export type UnitGroup = (typeof UNIT_GROUPS)[number];

export type UnitGroupContextValue = {
  unitGroup: UnitGroup;
  setUnitGroup: (unitGroup: UnitGroup) => void;
};

/**
 * Channel that carries the unit group value to descendants.
 *
 * Defaults to undefined so useUnitGroup can detect usage outside a UnitGroupProvider.
 */
export const UnitGroupContext = createContext<UnitGroupContextValue | undefined>(undefined);
