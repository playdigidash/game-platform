import { observer } from 'mobx-react';
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { isMobile } from 'react-device-detect';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import {
  getProviderType,
  ICurrentUserModel,
  LoginType,
  useMongoDB,
  useRealmApp,
} from '@lidvizion/commonlib';
import { GoogleLogin } from '@react-oauth/google';
import { EmailPasswordInput } from './EmailPasswordInput';
import { useLoginStore } from '../RootStore/RootStoreProvider';
import { VerificationType } from './PhoneVerification';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface ISignIn {
  handleAfterLogin: () => void;
  currUser: ICurrentUserModel | null;
  loginOnly: boolean;
  redirectPath?: string;
}

const SignIn: React.FC<ISignIn> = observer(
  ({ handleAfterLogin, currUser, loginOnly, redirectPath }) => {
    const { emailSignIn, googleSignUp } = useRealmApp();

    const {
      isEmailError,
      setIsEmailError,
      handleFormValidation,
      setIsLoggingIn,
      setShowLoginModal,
      setEmailHelperTxt,
      email,
      password,
      handleGoogleSignUp,
      isEmail,
      setVerificationFor,
      setShowForgotPasswordModal,
    } = useLoginStore().loginViewStore;

    const { setMsg, setShowSnackbar } = useLoginStore().snackbarViewStore;

    const { db } = useMongoDB();

    const handleSignIn = async () => {
      setIsLoggingIn(true);
      let isValidForm = {
        isValid: false,
      };

      if (email && password) {
        isValidForm = handleFormValidation(email, password);
      }

      if (!isValidForm) {
        setIsLoggingIn(false);
        return;
      }

      let realmUser = null;
      if (email && password) {
        realmUser = await emailSignIn(email, password);
      }

      // if (realmUser?.error) {
      //   setEmailHelperTxt(realmUser.error);
      //   setIsEmailError(true);
      //   setIsLoggingIn(false);
      //   return false;
      // }

      // if (
      //   realmUser?.isLoggedIn &&
      //   realmUser?.providerType !== LoginType.anonymous
      // ) {
      //   setMsg('Login Successful');
      //   setShowSnackbar(true);
      //   setShowLoginModal(false);
      //   handleAfterLogin();
      //   // if (afterLoginNav) {
      //   //   nav(afterLoginNav);
      //   // }
      //   return true;
      // }

      // setIsLoggingIn(false);
      return false;
    };
    return (
      <Box component="div">
        <Box
          component="div"
          className="sign-in-box-wrapper"
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <EmailPasswordInput loginOnly={loginOnly} />
          <Box component="div" margin={3} display={'flex'}>
            {/* <ReCAPTCHA sitekey="6LfyG8AiAAAAAH5gMY-lQiFpPd61lki9mPBwRpHb" /> */}
            <Button
              style={{
                flexGrow: 1,
                background: '#3B94FF',
              }}
              variant="contained"
              onClick={async () => {
                const isSignedIn = await handleSignIn();
              }}
            >
              {isEmail ? 'Sign in with Email' : 'Sign in with Phone'}
            </Button>
          </Box>
        </Box>
        {!loginOnly && (
          <>
            <Divider>or</Divider>
            <Box
              component="div"
              sx={{
                display: 'flex',
                padding: 2,
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (db) {
                    const googleInfo = await handleGoogleSignUp(
                      credentialResponse,
                      googleSignUp
                    );
                    handleAfterLogin();
                  }
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
              />
            </Box>
          </>
        )}
        <Box component="div" display={'flex'} justifyContent={'center'}>
          <Button
            onClick={() => {
              setVerificationFor(VerificationType.signup);
              setShowForgotPasswordModal(true);
            }}
          >
            Forgot Password?
          </Button>
        </Box>
        <ForgotPasswordModal />
      </Box>
    );
  }
);

export default SignIn;
