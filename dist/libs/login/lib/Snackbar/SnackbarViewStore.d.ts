import { RootStore } from "../RootStore/LoginRootStore";
export declare class SnackbarViewStore {
    root: RootStore;
    msg: string;
    showSnackbar: boolean;
    constructor(root: RootStore);
    setMsg: (str: string) => void;
    setShowSnackbar: (bool: boolean) => void;
}
