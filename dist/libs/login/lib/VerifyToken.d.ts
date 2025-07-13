import { TokenVerifyMsg } from '@lidvizion/commonlib';
import React from 'react';
export interface IVerifyToken {
    handleAfterLogin: (currentUser: Realm.User<Realm.DefaultFunctionsFactory, SimpleObject, Realm.DefaultUserProfileData>) => void;
    handleAfterLoginFail: (msg: TokenVerifyMsg, showModal?: boolean) => void;
    show: boolean;
    currMsg: string;
}
export declare const VerifyToken: React.FC<IVerifyToken>;
