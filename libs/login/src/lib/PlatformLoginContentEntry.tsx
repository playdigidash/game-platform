import { IUserProfileType, TokenVerifyMsg } from '@lidvizion/commonlib';
import { observer } from 'mobx-react';
import { PlatformRootStoreProvider } from './RootStore/PlatformRootStoreProvider';
import { PlatformLoginContent } from './PlatformLogin/PlatformLoginContent';
import { VerifyToken } from './VerifyToken';
interface IPlatformLoginContentEntry {
  userType: IUserProfileType;
  handleAfterLogin?: any;
  showVerifyToken: boolean;
  tokenVerifyMsg: TokenVerifyMsg;
  handleAfterLoginFail: (msg: TokenVerifyMsg) => Promise<void>;
  emailAllowed: boolean;
  phoneAllowed: boolean;
}

export const PlatformLoginContentEntry: React.FC<IPlatformLoginContentEntry> =
  observer(
    ({
      handleAfterLoginFail,
      userType,
      handleAfterLogin,
      showVerifyToken,
      tokenVerifyMsg,
      emailAllowed,
      phoneAllowed,
    }) => {
      return (
        <PlatformRootStoreProvider>
          <PlatformLoginContent
            userType={userType}
            handleAfterLogin={handleAfterLogin}
            handleAfterLoginFail={handleAfterLoginFail}
            emailAllowed={emailAllowed}
            phoneAllowed={phoneAllowed}
            tokenVerifyMsg={tokenVerifyMsg}
          />
          <VerifyToken
            show={showVerifyToken}
            handleAfterLogin={handleAfterLogin}
            handleAfterLoginFail={handleAfterLoginFail}
            currMsg={tokenVerifyMsg}
          />
        </PlatformRootStoreProvider>
      );
    }
  );
