import {
  defaultModalStyle,
  getUserProfileByUsername,
  sendCode,
  useMongoDB,
  useRealmApp,
} from '@lidvizion/commonlib';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { observer } from 'mobx-react';
import MuiPhoneNumber from 'material-ui-phone-number';
import CloseIcon from '@mui/icons-material/Close';
import { PhoneVerification, VerificationType } from './PhoneVerification';
import { useEffect } from 'react';
import { Email, Phone } from '@mui/icons-material';
import LoadingOverlay from 'react-loading-overlay-ts';
import { useLoginStore } from '../RootStore/RootStoreProvider';

export const ForgotPasswordModal = observer(() => {
  const {
    setShowForgotPasswordModal,
    showForgotPasswordModal,
    setIsEmail,
    setEmail,
    email,
    setShowPhoneVerifyModal,
    setVerificationFor,
    isEmail,
    doesUserExist,
    setDoesUserExist,
  } = useLoginStore().loginViewStore;
  const { db } = useMongoDB();
  const { emailSignIn, app } = useRealmApp();

  const handleSend = async () => {
    const isEmail = email?.includes('@') ? true : false;
    if (db && email) {
      const usrExists = await getUserProfileByUsername(db, email);
      if (usrExists) {
        sendCode(email, isEmail);
        setShowPhoneVerifyModal(true);
        setShowForgotPasswordModal(false);
      } else {
        setDoesUserExist(false);
      }

      setIsEmail(isEmail);
    }
  };

  useEffect(() => {
    if (showForgotPasswordModal) {
      setVerificationFor(VerificationType.passwordReset);
    }
  }, [showForgotPasswordModal]);

  const handleClose = () => {
    setEmail('');
    setShowForgotPasswordModal(false);
  };

  return (
    <Modal
      open={showForgotPasswordModal}
      aria-labelledby="login-modal"
      aria-describedby="login-modal"
    >
      <Box
        component="div"
        sx={{
          ...defaultModalStyle,
          alignItems: 'center',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: 350,
        }}
      >
        <IconButton
          onClick={() => {
            handleClose();
          }}
          sx={{
            alignSelf: 'flex-end',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">Password Reset</Typography>
        {
          <Button
            size="small"
            sx={{
              display: 'flex',
              alignSelf: 'flex-start',
            }}
            onClick={() => {
              setIsEmail(!isEmail);
            }}
            variant="contained"
            endIcon={isEmail ? <Phone /> : <Email />}
          >
            Use
          </Button>
        }
        {isEmail && (
          <>
            <Typography>Email associated with your account</Typography>
            <TextField
              id={`sign-up-email`}
              variant="standard"
              label="Enter Email"
              placeholder="Email"
              fullWidth
              required
              value={email}
              onChange={(evt) => {
                setEmail(evt.target.value);
              }}
            />
          </>
        )}
        {!isEmail && (
          <>
            <Typography>Phone number associated with your account</Typography>
            <MuiPhoneNumber
              defaultCountry={'us'}
              label="Enter Phone"
              placeholder="Phone"
              disableDropdown
              fullWidth
              required
              value={email}
              onChange={(evt) => {
                if (typeof evt === 'string') {
                  setEmail(evt);
                }
              }}
            />
          </>
        )}
        {!doesUserExist && (
          <Typography color={'red'}>
            An associated account was not found
          </Typography>
        )}
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Modal>
  );
});
