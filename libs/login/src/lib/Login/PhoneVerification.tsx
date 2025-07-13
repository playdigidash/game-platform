import {
  defaultModalStyle,
  IDashboardUserModel,
  IGameUserModel,
  IUserProfileType,
  sendCode,
  sendPasswordReset,
  useMongoDB,
  useRealmApp,
  verifyCode,
} from '@lidvizion/commonlib';
import { CustomDivider } from '@lidvizion/Search';
import { Box, Button, Modal, 
  TextField, 
  Typography, 
  useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useLoginStore } from '../RootStore/RootStoreProvider';
import LoadingOverlay from 'react-loading-overlay-ts';
import { usePlatformLoginStore } from '../RootStore/PlatformRootStoreProvider';
import { MongoDBRealmError, User } from 'realm-web';

export enum VerificationType {
  passwordReset = 'passwordReset',
  signup = 'signup',
}

interface IPhoneVerifcation {
  handleAfterSignUp: (
    user: Realm.User<
      Realm.DefaultFunctionsFactory,
      SimpleObject,
      Realm.DefaultUserProfileData
    >
  ) => void;
  redirectPath?: string;
  userType: IUserProfileType;
}

export const PhoneVerification: React.FC<IPhoneVerifcation> = observer(
  ({ userType, handleAfterSignUp }) => {
    const theme = useTheme();
    const {
      showPhoneVerifyModal,
      setCurrentVerifyNum,
      verifyNum1,
      verifyNum2,
      verifyNum3,
      verifyNum4,
      verifyNum5,
      verifyNum6,
      verifyNumRef2,
      verifyNumRef3,
      verifyNumRef4,
      verifyNumRef5,
      verifyNumRef6,
      setVerifyNumRef,
      truncatedNum,
      emailOrPhone,
      isOptInChecked,
      placeholder,
      isEmail,
      setShowPhoneVerifyModal,
      setIsLoggingIn,
      isVerificationCodeValid,
      setIsVerificationCodeValid,
      setIsResettingPw,
      verificationFor,
      setShowResetPwModal,
      resetCodeInput,
      isResettingPw,
    } = usePlatformLoginStore().platformLoginViewStore;
    
    const { db } = useMongoDB();
    const { emailSignUp, emailSignIn } = useRealmApp();
    const nav = useNavigate();
    const handleNumChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      idx: number
    ) => {
      setCurrentVerifyNum(e.target.value, idx);
    };

    const sendNewCode = () => {
      if (emailOrPhone) {
        resetCodeInput();
        sendCode(emailOrPhone, isEmail);
        setShowPhoneVerifyModal(true);
      }
    };
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLDivElement>,
      idx: number
    ) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        return;
      }

      if (idx === 0 && verifyNumRef2) {
        verifyNumRef2.focus();
      }
      if (idx === 1 && verifyNumRef3) {
        verifyNumRef3.focus();
      }
      if (idx === 2 && verifyNumRef4) {
        verifyNumRef4.focus();
      }
      if (idx === 3 && verifyNumRef5) {
        verifyNumRef5.focus();
      }
      if (idx === 4 && verifyNumRef6) {
        verifyNumRef6.focus();
      }
    };

    const handleVerification = async (typedCode?: string) => {
      if (emailOrPhone) {
        setIsLoggingIn(true);
        setIsResettingPw(true);
        // const checkIfUser = await emailSignIn(email, '')
        const code = typedCode ?? `${verifyNum1}${verifyNum2}${verifyNum3}${verifyNum4}${verifyNum5}${verifyNum6}`;
        const verified = await verifyCode(
          emailOrPhone,
          code
        );

        if (verified && verified.data && verified.data.body === 'approved') {
          if (verificationFor === VerificationType.signup) {
            let signedUp = await emailSignUp(
              emailOrPhone,
              placeholder,
              isOptInChecked,
              isEmail
            );

            if (
              signedUp &&
              signedUp instanceof MongoDBRealmError &&
              signedUp.statusCode === 409
            ) {
              signedUp = await emailSignIn(emailOrPhone, placeholder);
            }

            if (signedUp && signedUp instanceof User) {
              handleAfterSignUp(signedUp);
            }
          } else if (verificationFor === VerificationType.passwordReset) {
            setShowResetPwModal(true);
          }

          setShowPhoneVerifyModal(false);
        } else {
          setIsVerificationCodeValid(false);
        }
      }

      setIsLoggingIn(false);
      setIsResettingPw(false);
    };

    const getTitle = () => {
      let title = '';
      if (isEmail && verificationFor === VerificationType.passwordReset) {
        title = 'You will receive an email with a verification code shortly';
      }

      if (isEmail && verificationFor === VerificationType.signup) {
        title = `We've sent a verification code to the following email ${truncatedNum}`;
      }

      if (!isEmail && verificationFor === VerificationType.passwordReset) {
        title = 'You will receive a text with a verification code shortly';
      }

      if (!isEmail && verificationFor === VerificationType.signup) {
        title = `We've sent a verification code to the phone number ending in ${truncatedNum}`;
      }

      return title;
    };

    return (
      <Modal
        open={showPhoneVerifyModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="div"
          className="instruction-modal-wrapper"
          sx={{
            ...defaultModalStyle,
            width: 350,
            alignItems: 'center',
          }}
        >
          <LoadingOverlay active={isResettingPw} spinner text={'verifying...'}>
            <Box
              component="div"
              display={'flex'}
              flexDirection={'column'}
              alignContent={'center'}
              margin={2}
            >
              <Typography textAlign={'center'} variant="h5" padding={1}>
                {isEmail ? 'Verify Email' : 'Verify Number'}
              </Typography>
              <CustomDivider></CustomDivider>
              {
                <Typography textAlign={'center'} variant="h6" padding={1}>
                  {getTitle()}
                </Typography>
              }
              <Box component="div" gap={1} margin={2} display={'flex'} justifyContent="center">
                <TextField
                  label="Enter verification code"
                  placeholder="______"
                  inputProps={{ 
                    maxLength: 6,
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                  type="tel"
                  variant="outlined"
                  autoFocus
                  value={`${verifyNum1 || ''}${verifyNum2 || ''}${verifyNum3 || ''}${verifyNum4 || ''}${verifyNum5 || ''}${verifyNum6 || ''}`}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const digits = value.split('').slice(0, 6);
                    
                    for (let i = 0; i < 6; i++) {
                      setCurrentVerifyNum(digits[i] || '', i);
                    }
                    
                    // Auto-submit when all 6 digits are entered
                    if (digits.length === 6) {
                      handleVerification(digits.join(''));
                    }
                  }}
                  margin="normal"
                  fullWidth
                  InputLabelProps={{
                    style: {
                      color: 'white',
                      fontFamily: "'Segoe UI', 'Roboto', arial, sans-serif",
                    },
                    shrink: true,
                  }}
                  InputProps={{
                    style: {
                      color: 'white',
                      borderRadius: '1.25rem',
                      fontFamily: "'Segoe UI', 'Roboto', arial, sans-serif",
                      fontSize: '0.9375rem',
                      textAlign: 'center',
                      letterSpacing: '0.5rem',
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
                      textAlign: 'center',
                    },
                  }}
                  helperText={!isVerificationCodeValid ? "Invalid code. Please try again." : ""}
                  error={!isVerificationCodeValid}
                />
              </Box>
              
              <Button
                sx={{ 
                  marginTop: 2,
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
                  handleVerification();
                }}
                disabled={!verifyNum1 || !verifyNum2 || !verifyNum3 || !verifyNum4 || !verifyNum5 || !verifyNum6}
              >
                <Typography>SUBMIT</Typography>
              </Button>

              <Box
                component="div"
                marginTop={3}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <Button 
                  onClick={sendNewCode}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                    width: '13.5rem',
                    height: '2.6rem',
                    borderRadius: '1.25rem',
                    fontFamily: "'Segoe UI', 'Roboto', arial, sans-serif",
                  }}
                >
                  Send New Code
                </Button>
              </Box>
            </Box>
          </LoadingOverlay>
        </Box>
      </Modal>
    );
  }
);
