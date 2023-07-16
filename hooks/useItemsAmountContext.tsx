import { createContext, useContext, useMemo, ReactNode } from 'react';

import resource from '@/data/db.json';

type ContextValue = {
  itemsAmount: number;
};

type Props = {
  children: ReactNode;
};

const context = createContext<ContextValue>({
  itemsAmount: 0,
});

export const ItemAmountProvider = ({ children }: Props) => {
  const value: ContextValue = useMemo(
    () => ({
      itemsAmount: resource.resource.length,
    }),
    [],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useItemsAmount = () => useContext(context);
