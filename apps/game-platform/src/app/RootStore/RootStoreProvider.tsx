import React, { createContext, ReactNode, useContext } from 'react';
import { RootStore } from './RootStore';
import { useMongoDB, useRealmApp } from '@lidvizion/commonlib';

// holds a reference to the store (singleton)
let store: RootStore | null = null;
// create the context
const StoreContext = createContext<RootStore | undefined>(undefined);

// create the provider component
export const RootStoreProvider = ({ children }: { children: ReactNode }) => {
  //only create the store once ( store is a singleton)
  const realmContext = useRealmApp();
  const { db } = useMongoDB();
  store = store ?? new RootStore({ realmContext, db });

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

// create the hook
export const useGameStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useRootStore must be used within RootStoreProvider");
  }

  return context;
};