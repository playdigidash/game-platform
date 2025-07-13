/// <reference types="react" />
import { IUserProfileType } from '@lidvizion/commonlib';
export declare enum VerificationType {
    passwordReset = "passwordReset",
    signup = "signup"
}
interface IPhoneVerifcation {
    handleAfterSignUp: (user: Realm.User<Realm.DefaultFunctionsFactory, SimpleObject, Realm.DefaultUserProfileData>) => void;
    redirectPath?: string;
    userType: IUserProfileType;
}
export declare const PhoneVerification: React.FC<IPhoneVerifcation>;
export {};
