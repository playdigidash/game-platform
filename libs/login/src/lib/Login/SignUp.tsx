import { observer } from 'mobx-react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Link,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ICurrentUserModel,
  LoginType,
  saveUserData,
  sendCode,
  useMongoDB,
  useRealmApp,
} from '@lidvizion/commonlib';
import { useNavigate } from 'react-router-dom';
import { PolicyModal } from './PolicyModal';
import { TermsModal } from './TermsModal';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import * as RealmWeb from 'realm-web';
import MuiPhoneNumber from 'material-ui-phone-number';
import { EmailIcon } from 'react-share';
import { Email, Phone } from '@mui/icons-material';
import { EmailPasswordInput } from './EmailPasswordInput';
import { useLoginStore } from '../RootStore/RootStoreProvider';

interface ISignUp {
  currUser: ICurrentUserModel | null;
  loginOnly: boolean;
  handleAfterSignUp: (isOptInChecked: boolean, email: string) => void;
  redirectPath?: string;
}

const SignUp: React.FC<ISignUp> = observer(
  ({ currUser, loginOnly, handleAfterSignUp }) => {
    const {
      handleFormValidation,
      isTermsError,
      setShowPhoneVerifyModal,
      setIsLoggingIn,
      setShowLoginModal,
      showTermsModal,
      showPolicyModal,
      setShowTermsModal,
      setShowPolicyModal,
      isOptInChecked,
      setIsOptInChecked,
      handleGoogleSignUp,
      setIsEmail,
      setTruncatedNum,
      password,
      email,
      isLoggingIn,
    } = useLoginStore().loginViewStore;

    const { db } = useMongoDB();
    const { googleSignUp } = useRealmApp();
    const theme = useTheme();

    const handlEmailSignUp = async () => {
      setIsLoggingIn(true);
      if (!email || !password) {
        return;
      }

      const isValidForm = handleFormValidation(email, password);

      if (!isValidForm.isValid) {
        setIsLoggingIn(false);
        return;
      }

      setIsEmail(isValidForm.isEmail);

      if (db) {
        sendCode(email, isValidForm.isEmail);
        if (isValidForm.isEmail) {
          if (email.length > 2) {
            setTruncatedNum(
              `${email[0]}${email[1]}****${email.substring(
                email.length - email.indexOf('@') - 2
              )}`
            );
          }
        } else {
          if (currUser) {
            currUser.phoneNumber = email;
          }

          if (email.length > 3) {
            setTruncatedNum(`*******${email.substring(email.length - 3)}`);
          }
        }

        setShowPhoneVerifyModal(true);
        setShowLoginModal(false);
      }

      setIsLoggingIn(false);
    };

    return (
      <Box
        component="div"
        className="sign-up-box-wrapper"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
        }}
      >
        <EmailPasswordInput loginOnly={loginOnly} />
        <Button
          style={{
            flexGrow: 1,
            background: '#3B94FF',
          }}
          type="submit"
          variant="contained"
          disabled={isLoggingIn}
          onClick={() => {
            handlEmailSignUp();
          }}
        >
          Email or Phone Sign Up
        </Button>
        <Divider
          sx={{
            margin: 2,
            color: theme.palette.text.primary,
            alignSelf: 'stretch',
          }}
        >
          or
        </Divider>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const res = await handleGoogleSignUp(
              credentialResponse,
              googleSignUp
            );
            handleAfterSignUp(isOptInChecked, res.email);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          useOneTap
        />
        {isTermsError && (
          <Typography sx={{ color: 'red' }}>
            {'You must agree to terms'}
          </Typography>
        )}

        <Typography
          variant="caption"
          sx={{
            textAlign: 'center',
            margin: 2,
          }}
        >
          By providing your phone number, you agree to receive service
          notifications. Standard call, message, or data rates may apply.
          Clicking "Sign Up" means that you have read and agree to the{' '}
          <Link onClick={() => setShowTermsModal(true)}>Terms of Service</Link>{' '}
          and{' '}
          <Link onClick={() => setShowPolicyModal(true)}>Privacy Policy</Link>
        </Typography>
        {showTermsModal && <TermsModal />}
        {showPolicyModal && <PolicyModal />}
        <Box
          component="div"
          display={'flex'}
          alignItems={'center'}
          alignSelf={'flex-start'}
        >
          <Checkbox
            size="small"
            onClick={() => {
              setIsOptInChecked(!isOptInChecked);
            }}
            checked={isOptInChecked}
            aria-label={'terms of service checkbox'}
          />
          <Typography variant="caption">I Agree</Typography>
        </Box>
      </Box>
    );
  }
);

export default SignUp;
