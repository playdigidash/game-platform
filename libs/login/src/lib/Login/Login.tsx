import { Box, IconButton, Modal, Tab, Tabs, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import LoadingOverlay from 'react-loading-overlay-ts';
import {
  AppRoute,
  defaultModalStyle,
  ICurrentUserModel,
  IUserProfileType,
} from '@lidvizion/commonlib';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { PhoneVerification } from './PhoneVerification';
import { useLoginStore } from '../RootStore/RootStoreProvider';
import { useEffect } from 'react';
import { ResetPasswordModal } from './ResetPasswordModal';
import { SuccessSnackBar } from '../Snackbar/SuccessSnackBar';

export enum currentViewConst {
  DECIDEPATH = 'decide path',
  DOPATH = 'do path',
  DONTPATH = 'dont path',
  FIXABLEPATH = 'fixable path',
}

interface ILoginProps {
  isInPersistentView?: boolean;
  handleAfterSignUp: any
  currUser: ICurrentUserModel | null;
  loginOnly: boolean;
  handleAfterLogin: () => void;
  redirectPath?: string;
}

export const Login: React.FC<ILoginProps> = observer(
  ({
    isInPersistentView,
    handleAfterSignUp,
    currUser,
    loginOnly,
    handleAfterLogin,
    redirectPath,
  }) => {
    const {
      showLoginModal,
      setShowLoginModal,
      showLoginTitle,
      changeLoginTab,
      loginTabValue,
      isLoggingIn,
      currentLoginTitle,
      setIsFeedbackPending,
      setLoginTabValue,
    } = useLoginStore().loginViewStore;

    const navigate = useNavigate();
    const handleCloseLoginModal = () => {
      setIsFeedbackPending(false);
      setShowLoginModal(false);
    };

    useEffect(() => {
      if (loginOnly) {
        setLoginTabValue(1);
      }
    }, [loginOnly, setLoginTabValue]);

    return (
      <>
        <Modal
          hideBackdrop
          open={isInPersistentView ? showLoginModal : true}
          aria-labelledby="login-modal"
          aria-describedby="login-modal"
        >
          <Box
            component="div"
            sx={{
              ...defaultModalStyle,
              alignItems: 'center',
            }}
          >
            <LoadingOverlay
              active={isLoggingIn}
              spinner
              text={'checking content...'}
            >
              <Box
                component="div"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  margin: 2,
                }}
              >
                {
                  <IconButton
                    onClick={() => {
                      handleCloseLoginModal();
                      navigate(`/${AppRoute.homepage}`);
                    }}
                    sx={{
                      alignSelf: 'flex-end',
                    }}
                  >
                    <HomeIcon />
                  </IconButton>
                }
                {showLoginTitle && (
                  <Typography
                    color={'red'}
                    textAlign={'center'}
                    marginTop={2}
                    variant={'subtitle1'}
                  >
                    {currentLoginTitle}
                  </Typography>
                )}
                {/* {showAccountHeader && (
              <Typography
                color={'red'}
                textAlign={'center'}
                marginTop={2}
                variant={'subtitle1'}
              >
                Login to View Account!
              </Typography>
            )}
            {showPointsHeader && (
              <Typography
                color={'red'}
                textAlign={'center'}
                marginTop={2}
                variant={'subtitle1'}
              >
                Login to Track Progress!
              </Typography>
            )} */}
                <Tabs
                  className="login-tabs"
                  sx={{
                    margin: 2,
                    display: 'flex',
                    alignSelf: 'center',
                  }}
                  value={loginTabValue}
                  onChange={changeLoginTab}
                  aria-label="basic tabs example"
                >
                  {!loginOnly && <Tab label="Register" />}
                  <Tab label="Login" />
                </Tabs>
                {loginTabValue === 1 && (
                  <SignIn
                    loginOnly={loginOnly}
                    currUser={currUser}
                    handleAfterLogin={handleAfterLogin}
                    redirectPath={redirectPath}
                  />
                )}
                {loginTabValue === 0 && !loginOnly && (
                  <SignUp
                    currUser={currUser}
                    loginOnly={loginOnly}
                    handleAfterSignUp={handleAfterSignUp}
                    redirectPath={redirectPath}
                  />
                )}
              </Box>
            </LoadingOverlay>
          </Box>
        </Modal>
        <PhoneVerification
          handleAfterSignUp={handleAfterSignUp}
          redirectPath={redirectPath}
          userType={IUserProfileType.game}
        />
        <ResetPasswordModal />
        <SuccessSnackBar />
      </>
    );
  }
);
