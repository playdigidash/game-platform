import { ReactNode } from 'react';
import { PlatformRootStore } from './PlatformLoginRootStore';
export declare const PlatformRootStoreProvider: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
export declare const usePlatformLoginStore: () => PlatformRootStore;
