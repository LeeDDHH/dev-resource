'use strict';

export const filterItems = <T>(items: T[] | null): NonNullable<T>[] | undefined => {
  if (!items) return undefined;
  return items.filter((item): item is NonNullable<typeof item> => item != null);
};
