/// <reference types="react" />
import { IUserProfileType, TokenVerifyMsg } from '@lidvizion/commonlib';
interface IPlatformLoginPgEntry {
    userType: IUserProfileType;
    handleAfterLogin?: any;
    handleAfterLoginFail: (msg: TokenVerifyMsg, showModal: boolean) => Promise<void>;
    emailAllowed: boolean;
    phoneAllowed: boolean;
    tokenVerifyMsg: TokenVerifyMsg;
}
export declare const PlatformLoginPgEntry: React.FC<IPlatformLoginPgEntry>;
export {};
