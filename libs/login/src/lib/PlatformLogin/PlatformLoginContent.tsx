import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Link,
  styled,
  useTheme
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { observer } from 'mobx-react';
import { User } from 'realm-web';
import LoadingOverlay from 'react-loading-overlay-ts';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { usePlatformLoginStore } from '../RootStore/PlatformRootStoreProvider';
import {
  formatPhoneNumber,
  IUserProfileType,
  sendCode,
  TokenVerifyMsg,
  useMongoDB,
  useRealmApp,
  waitForSpecifiedTime,
} from '@lidvizion/commonlib';
import MsSignInButton from '../assets/ms-symbollockup_signin_light.svg';
import GoogleSignInButton from '../assets/GoogleSignInButton.svg';
import { PhoneVerification } from '../Login/PhoneVerification';
import { VerifyToken } from '../VerifyToken';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

interface IPlatformLoginContent {
  userType: IUserProfileType;
  handleAfterLogin: (
    currentUser: Realm.User<
      Realm.DefaultFunctionsFactory,
      SimpleObject,
      Realm.DefaultUserProfileData
    >
  ) => void;
  handleAfterLoginFail: (
    msg: TokenVerifyMsg,
    showModal: boolean
  ) => Promise<void>;
  emailAllowed: boolean;
  phoneAllowed: boolean;
  tokenVerifyMsg: TokenVerifyMsg;
}

const ButtonContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1em',
  alignItems: 'center',
  flex: 1,
});

export const PlatformLoginContent: React.FC<IPlatformLoginContent> = observer(
  ({
    userType,
    handleAfterLogin,
    handleAfterLoginFail,
    emailAllowed,
    phoneAllowed,
    tokenVerifyMsg,
  }) => {
    const {
      isLoading,
      handleGoogleSignUp,
      emailOrPhone,
      setEmailOrPhone,
      handleMicrosoft,
      isValidEmail,
      isValidPhone,
      handlePhoneCode,
      waitingForLinkTimeout,
      isSendBtnDisabled,
      handleMagicClick,
      phoneOrEmailDivTxt,
      loginHeaderTxt,
      setUserType,
      setEmailAllowed,
      setPhoneAllowed,
      sendBtnTxt,
    } = usePlatformLoginStore().platformLoginViewStore;
    const { db } = useMongoDB();
    const { googleSignUp, microsoftSignIn } = useRealmApp();
    const urlPath = window.location.pathname;
    const parts = urlPath.split('/');
    const [resendTimer, setResendTimer] = useState(0);
    const theme = useTheme();

    useEffect(() => {
      setEmailAllowed(emailAllowed);
      setPhoneAllowed(phoneAllowed);
    }, [setEmailAllowed, setPhoneAllowed, emailAllowed, phoneAllowed]);

    useEffect(() => {
      setUserType(userType);
    }, [setUserType, userType]);

    useEffect(() => {
      const startTimer = async () => {
        if (tokenVerifyMsg === TokenVerifyMsg.sent) {
          await waitForSpecifiedTime(30, setResendTimer);
        }
      };
      startTimer();
    }, [tokenVerifyMsg]);

    return (
      <Box
        className="platform-login-content-container"
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          flex: 1,
        }}
      >
        <LoadingOverlay
          className="page-overlay"
          active={isLoading}
          spinner={<PropagateLoader color="white" />}
          text={'loading...'}
        >
          <Box
            component="div"
            sx={{
              display: 'flex',
              height: '100vh',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              bgcolor: 'rgba(0, 0, 0, 0)',
              maxWidth: '100%',
            }}
          >
            <Typography
              sx={{ flex: 1, alignContent: 'center' }}
              variant="h4"
              gutterBottom
            >
              {loginHeaderTxt}
              <span role="img" aria-label="waving hand">
                {' '}
                👋
              </span>
            </Typography>
            <ButtonContainer>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (db && credentialResponse?.credential) {
                    const googleInfo = await handleGoogleSignUp(
                      credentialResponse.credential,
                      googleSignUp
                    );

                    if (
                      googleInfo.email &&
                      googleInfo.realmUser instanceof User
                    ) {
                      handleAfterLogin(googleInfo.realmUser);
                    }
                  }
                }}
                useOneTap
                locale="en"
                shape="pill"
                // size="large"
              />
              <Button
                onClick={() =>
                  handleMicrosoft({
                    microsoftSignIn,
                    handleAfterLogin,
                    userType,
                  })
                }
                sx={{}}
              >
                <img
                  src={MsSignInButton}
                  alt="Sign in"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Button>
            </ButtonContainer>

            <Divider sx={{ width: '100%', color: 'gray', my: 2 }}>
              {`use ${phoneOrEmailDivTxt}`}
            </Divider>
            <Box
              flex={1}
              component={'div'}
              display={'flex'}
              flexDirection={'column'}
              gap={'1em'}
            >
              <TextField
                type={`${!emailAllowed ? 'tel' : 'email'}`}
                label={phoneOrEmailDivTxt}
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  style: {
                    color: 'white',
                    fontFamily: "'Segoe UI', 'Roboto', arial, sans-serif",
                  },
                }}
                InputProps={{
                  style: {
                    color: 'white',
                    borderRadius: '1.25rem',
                    fontFamily: "'Segoe UI', 'Roboto', arial, sans-serif",
                    fontSize: '0.9375rem',
                  },
                }}
                sx={{
                  width: '13.5rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '1.25rem',
                    height: '3.2rem',
                    border: '0.0625rem solid #8c8c8c',
                    '& fieldset': {
                      borderColor: '#8c8c8c',
                      borderWidth: '0.0625rem',
                    },
                    '&:hover': {
                      border: '0.0625rem solid #8c8c8c',
                      '& fieldset': {
                        borderColor: '#8c8c8c',
                        borderWidth: '0.0625rem',
                      },
                    },
                    '&.Mui-focused': {
                      border: '0.0625rem solid #8c8c8c',
                      '& fieldset': {
                        borderColor: '#8c8c8c',
                        borderWidth: '0.0625rem',
                      },
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />

              <Button
                variant="contained"
                sx={{
                  width: '13.5rem',
                  height: '2.6rem',
                  borderRadius: '1.25rem',
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                  },
                  '&:active': {
                    bgcolor: theme.palette.primary.main,
                  },
                  '&.Mui-focused': {
                    bgcolor: theme.palette.primary.main,
                  },
                  '&.Mui-disabled': {
                    bgcolor: alpha(theme.palette.primary.main, 0.5),
                    color: theme.palette.primary.contrastText,
                  }
                }}
                onClick={() => {
                  if (isValidEmail && resendTimer === 0) {
                    handleMagicClick({
                      callbackUrl: parts[1],
                      handleAfterLoginFail,
                    });
                  } else if (isValidPhone && resendTimer === 0) {
                    handlePhoneCode();
                  }
                }}
                disabled={isSendBtnDisabled}
              >
                <Typography>
                  {sendBtnTxt}
                  {resendTimer > 0 && ` (${resendTimer}s)`}
                </Typography>
              </Button>
            </Box>
            <Typography
              variant="body2"
              sx={{
                marginTop: '1rem',
                textAlign: 'center',
                color: 'white',
                fontSize: '0.75rem',
                flex: 1,
              }}
            >
              By continuing, you agree to our{' '}
              <Link
                href="https://www.playdigidash.io/legal/terms"
                target="_blank"
                sx={{
                  color: 'white',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link
                href="https://www.playdigidash.io/legal/privacy-policy"
                target="_blank"
                sx={{
                  color: 'white',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Privacy Policy
              </Link>
              . Standard SMS charges may apply.
            </Typography>
          </Box>
        </LoadingOverlay>
        <PhoneVerification
          handleAfterSignUp={handleAfterLogin}
          userType={userType}
        />
      </Box>
    );
  }
);
