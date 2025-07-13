import { IUserProfileType, TokenVerifyMsg } from '@lidvizion/commonlib';
import { observer } from 'mobx-react';
import { PlatformLoginPage } from './PlatformLogin/PlatformLogin';
import { PlatformRootStoreProvider } from './RootStore/PlatformRootStoreProvider';
interface IPlatformLoginPgEntry {
  userType: IUserProfileType;
  handleAfterLogin?: any;
  handleAfterLoginFail: (
    msg: TokenVerifyMsg,
    showModal: boolean
  ) => Promise<void>;
  emailAllowed: boolean;
  phoneAllowed: boolean;
  tokenVerifyMsg: TokenVerifyMsg;
}

export const PlatformLoginPgEntry: React.FC<IPlatformLoginPgEntry> = observer(
  ({
    userType,
    handleAfterLogin,
    handleAfterLoginFail,
    emailAllowed,
    phoneAllowed,
    tokenVerifyMsg,
  }) => {
    return (
      <PlatformRootStoreProvider>
        <PlatformLoginPage
          userType={userType}
          tokenVerifyMsg={tokenVerifyMsg}
          handleAfterLogin={handleAfterLogin}
          handleAfterLoginFail={handleAfterLoginFail}
          emailAllowed={emailAllowed}
          phoneAllowed={phoneAllowed}
        />
      </PlatformRootStoreProvider>
    );
  }
);
