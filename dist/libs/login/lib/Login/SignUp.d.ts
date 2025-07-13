/// <reference types="react" />
import { ICurrentUserModel } from '@lidvizion/commonlib';
interface ISignUp {
    currUser: ICurrentUserModel | null;
    loginOnly: boolean;
    handleAfterSignUp: (isOptInChecked: boolean, email: string) => void;
    redirectPath?: string;
}
declare const SignUp: React.FC<ISignUp>;
export default SignUp;
