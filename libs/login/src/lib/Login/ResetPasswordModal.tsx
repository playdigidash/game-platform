import { defaultModalStyle, useRealmApp } from '@lidvizion/commonlib';
import { Modal, Box, Button, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useLoginStore } from '../RootStore/RootStoreProvider';
import { EmailPasswordInput } from './EmailPasswordInput';
import { PasswordInput } from './PasswordInput';

export const ResetPasswordModal = observer(() => {
  const {
    showResetPwModal,
    email,
    password,
    handleFormValidation,
    setShowResetPwModal,
    setIsPasswordError,
    setPassword,
    setShowSuccessSnackbar,
    setMsg,
  } = useLoginStore().loginViewStore;

  const { resetPassword } = useRealmApp();

  const handlePwReset = async () => {
    if (email && password) {
      const isValidForm = handleFormValidation(email, password);

      if (!isValidForm.isValid) {
        return;
      }

      if (email && password) {
        const res = await resetPassword(email, password, []);
        if (!res) {
          setShowResetPwModal(false);
          setIsPasswordError(false);
          setPassword('');
          setShowSuccessSnackbar(true);
          setMsg('Password Reset');
        } else {
          setIsPasswordError(true);
        }
      }
    }
  };

  return (
    <Modal
      open={showResetPwModal}
      aria-labelledby="login-modal"
      aria-describedby="login-modal"
    >
      <Box
        component="div"
        className="reset-pw-container"
        sx={{
          ...defaultModalStyle,
          alignItems: 'center',
          padding: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography>Enter New Password below</Typography>
        <PasswordInput />
        <Button
          style={{
            flexGrow: 1,
            background: '#3B94FF',
          }}
          variant="contained"
          onClick={() => {
            handlePwReset();
          }}
        >
          Reset Password
        </Button>
      </Box>
    </Modal>
  );
});
