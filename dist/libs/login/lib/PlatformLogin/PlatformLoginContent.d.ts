/// <reference types="react" />
import { IUserProfileType, TokenVerifyMsg } from '@lidvizion/commonlib';
interface IPlatformLoginContent {
    userType: IUserProfileType;
    handleAfterLogin: (currentUser: Realm.User<Realm.DefaultFunctionsFactory, SimpleObject, Realm.DefaultUserProfileData>) => void;
    handleAfterLoginFail: (msg: TokenVerifyMsg, showModal: boolean) => Promise<void>;
    emailAllowed: boolean;
    phoneAllowed: boolean;
    tokenVerifyMsg: TokenVerifyMsg;
}
export declare const PlatformLoginContent: React.FC<IPlatformLoginContent>;
export {};
