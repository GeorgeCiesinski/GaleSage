import {createContext} from 'react';

export const UNIT_GROUPS = ['metric', 'us','uk','base'] as const;
export type UnitGroup = (typeof UNIT_GROUPS)[number];

export type UnitGroupContextValue = {
  unitGroup: UnitGroup;
  setUnitGroup: (uitGroup: UnitGroup) => void;
}

export const UnitGroupContext = createContext<UnitGroupContextValue | undefined>(undefined);
