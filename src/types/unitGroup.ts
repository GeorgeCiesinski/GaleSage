/**
 * Visual Crossing unitGroup values supported by this app.
 */
export const UNIT_GROUPS = ['metric', 'us', 'uk', 'base'] as const;
export type UnitGroup = (typeof UNIT_GROUPS)[number];
