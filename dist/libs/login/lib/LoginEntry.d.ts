/// <reference types="react" />
import { ICurrentUserModel } from "@lidvizion/commonlib";
interface ILoginEntry {
    handleAfterSignUp: (isOptInChecked: boolean, email: string) => void;
    handleAfterLogin: (realmUser?: Realm.User | null) => void;
    currUser: ICurrentUserModel | null;
    loginOnly: boolean;
    redirectPath?: string;
}
export declare const LoginEntry: React.FC<ILoginEntry>;
export {};
