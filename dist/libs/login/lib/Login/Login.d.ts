/// <reference types="react" />
import { ICurrentUserModel } from '@lidvizion/commonlib';
export declare enum currentViewConst {
    DECIDEPATH = "decide path",
    DOPATH = "do path",
    DONTPATH = "dont path",
    FIXABLEPATH = "fixable path"
}
interface ILoginProps {
    isInPersistentView?: boolean;
    handleAfterSignUp: any;
    currUser: ICurrentUserModel | null;
    loginOnly: boolean;
    handleAfterLogin: () => void;
    redirectPath?: string;
}
export declare const Login: React.FC<ILoginProps>;
export {};
