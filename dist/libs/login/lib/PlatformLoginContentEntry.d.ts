/// <reference types="react" />
import { IUserProfileType, TokenVerifyMsg } from '@lidvizion/commonlib';
interface IPlatformLoginContentEntry {
    userType: IUserProfileType;
    handleAfterLogin?: any;
    showVerifyToken: boolean;
    tokenVerifyMsg: TokenVerifyMsg;
    handleAfterLoginFail: (msg: TokenVerifyMsg) => Promise<void>;
    emailAllowed: boolean;
    phoneAllowed: boolean;
}
export declare const PlatformLoginContentEntry: React.FC<IPlatformLoginContentEntry>;
export {};
