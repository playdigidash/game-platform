/// <reference types="react" />
import { ICurrentUserModel } from '@lidvizion/commonlib';
interface ISignIn {
    handleAfterLogin: () => void;
    currUser: ICurrentUserModel | null;
    loginOnly: boolean;
    redirectPath?: string;
}
declare const SignIn: React.FC<ISignIn>;
export default SignIn;
