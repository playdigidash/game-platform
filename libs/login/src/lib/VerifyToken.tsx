import {
  DefaultErrorHandleModal,
  defaultModalStyle,
  TokenVerifyMsg,
  useMongoDB,
} from '@lidvizion/commonlib';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useSearchParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { usePlatformLoginStore } from './RootStore/PlatformRootStoreProvider';
import DigiDashLogo from './assets/Logos/Digi-Dash.IOLogo.svg';

export interface IVerifyToken {
  handleAfterLogin: (
    currentUser: Realm.User<
      Realm.DefaultFunctionsFactory,
      SimpleObject,
      Realm.DefaultUserProfileData
    >
  ) => void;
  handleAfterLoginFail: (msg: TokenVerifyMsg, showModal?: boolean) => void;
  show: boolean;
  currMsg: string;
}

export const VerifyToken: React.FC<IVerifyToken> = observer(
  ({ handleAfterLogin, show, currMsg, handleAfterLoginFail }) => {
    const [searchParams] = useSearchParams();
    const { db } = useMongoDB();
    const {
      handleMagicLinkVerification,
      currentlyVerifying,
      handleTokenVerifyFail,
    } = usePlatformLoginStore().platformLoginViewStore;

    useEffect(() => {
      let mounted = true;

      const verifyToken = async () => {
        const email = searchParams.get('email');
        const token = searchParams.get('token');

        if (mounted && token && email && db && !currentlyVerifying) {
          await handleMagicLinkVerification({
            email,
            token,
            handleAfterLogin,
            handleAfterLoginFail,
          });
        } else if (mounted) {
          handleTokenVerifyFail(TokenVerifyMsg.generic, handleAfterLoginFail);
        }
      };

      verifyToken();

      return () => {
        mounted = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    return show ? (
      <DefaultErrorHandleModal
        content={
          <Box
            component={'div'}
            display={'flex'}
            flexDirection={'column'}
            gap={'1em'}
          >
            <Typography variant="h6">{currMsg}</Typography>
            <Box mt={3} component={'div'}>
              <img
                src={DigiDashLogo}
                alt="Digi-Dash.IO Logo"
                width="150px"
                height="auto"
              />
            </Box>
          </Box>
        }
      />
    ) : null;
  }
);
