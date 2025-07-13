import { RootStore } from "../RootStore/SearchRootStore";
export declare class TopBarViewStore {
    root: RootStore;
    searchTabValue: number;
    constructor(root: RootStore);
    setSearchTabValue: (val: number) => void;
    changeTabValue: (event: React.SyntheticEvent, newValue: number) => void;
}
