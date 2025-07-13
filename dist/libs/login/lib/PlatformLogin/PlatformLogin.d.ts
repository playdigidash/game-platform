/// <reference types="react" />
import { IUserProfileType, TokenVerifyMsg } from '@lidvizion/commonlib';
interface IPlatformLogin {
    userType: IUserProfileType;
    handleAfterLogin?: any;
    handleAfterLoginFail: (msg: TokenVerifyMsg, showModal: boolean) => Promise<void>;
    emailAllowed: boolean;
    phoneAllowed: boolean;
    tokenVerifyMsg: TokenVerifyMsg;
}
export declare const PlatformLoginPage: React.FC<IPlatformLogin>;
export {};
