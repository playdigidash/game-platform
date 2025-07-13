import { observer } from 'mobx-react';
import { Modal, useTheme } from '@mui/material';
import { IUserProfileType, TokenVerifyMsg } from '@lidvizion/commonlib';
import { PlatformLoginContent } from './PlatformLoginContent';

interface IPlatformLogin {
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

export const PlatformLoginPage: React.FC<IPlatformLogin> = observer(
  ({
    userType,
    handleAfterLogin,
    handleAfterLoginFail,
    emailAllowed,
    phoneAllowed,
    tokenVerifyMsg,
  }) => {
    return (
      <Modal open>
        <PlatformLoginContent
          userType={userType}
          handleAfterLogin={handleAfterLogin}
          handleAfterLoginFail={handleAfterLoginFail}
          emailAllowed={emailAllowed}
          phoneAllowed={phoneAllowed}
          tokenVerifyMsg={tokenVerifyMsg}
        />
      </Modal>
    );
  }
);
