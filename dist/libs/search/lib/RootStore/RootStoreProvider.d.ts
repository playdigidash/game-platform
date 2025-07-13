import { ReactNode } from 'react';
import { RootStore } from './SearchRootStore';
export declare const RootStoreProvider: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
export declare const useSearchStore: () => RootStore;
