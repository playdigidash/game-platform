import React, { createContext, ReactNode, useContext } from 'react';
import { PlatformRootStore } from './PlatformLoginRootStore';
import { useMongoDB, useRealmApp } from '@lidvizion/commonlib';

// holds a reference to the store (singleton)
let store: PlatformRootStore

// create the context
const StoreContext = createContext<PlatformRootStore | undefined>(undefined)

// create the provider component
export const PlatformRootStoreProvider = ({ children }: { children: ReactNode })=> {
    const realmContext = useRealmApp()
    const { db } = useMongoDB()
    //only create the store once ( store is a singleton)
    const root = store ?? new PlatformRootStore({
        realmContext,
        db
    })

    return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>
}

// create the hook
export const usePlatformLoginStore = ()=> {
    const context = useContext(StoreContext)
    if (context === undefined) {
        throw new Error("useRootStore must be used within RootStoreProvider")
    }

    return context
}