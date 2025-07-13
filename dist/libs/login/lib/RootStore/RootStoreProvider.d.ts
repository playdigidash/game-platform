import { ReactNode } from 'react';
import { RootStore } from './LoginRootStore';
export declare const RootStoreProvider: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
export declare const useLoginStore: () => RootStore;
