import { ReactNode } from 'react';
import { RootStore } from './RootStore';
export declare const RootStoreProvider: ({ children }: {
    children: ReactNode;
}) => JSX.Element;
export declare const useCalendarStore: () => RootStore;
