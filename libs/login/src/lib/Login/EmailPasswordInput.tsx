import { Email, Phone } from '@mui/icons-material';
import { Box, Button, TextField } from '@mui/material';
import MuiPhoneNumber from 'material-ui-phone-number';
import { observer } from 'mobx-react';
import { useLoginStore } from '../RootStore/RootStoreProvider';
import { PasswordInput } from './PasswordInput';

interface IEmailPasswordInput {
  loginOnly: boolean;
}

export const EmailPasswordInput: React.FC<IEmailPasswordInput> = observer(
  ({ loginOnly }) => {
    const {
      isEmailError,
      isPasswordError,
      emailHelperTxt,
      setIsEmail,
      password,
      setPassword,
      email,
      isEmail,
      setEmail,
    } = useLoginStore().loginViewStore;

    return (
      <Box
        component="div"
        sx={{
          margin: 2,
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'stretch',
          gap: 1,
        }}
      >
        {!loginOnly && (
          <Button
            size="small"
            sx={{
              display: 'flex',
              alignSelf: 'flex-start',
              marginTop: '10px',
            }}
            onClick={() => {
              setIsEmail(!isEmail);
            }}
            variant="contained"
            endIcon={isEmail ? <Phone /> : <Email />}
          >
            Use
          </Button>
        )}
        <Box
          component="div"
          sx={{
            display: 'flex',
            alignSelf: 'stretch',
            gap: 2,
          }}
        >
          <Box
            component="div"
            display={'flex'}
            flexDirection={'column'}
            width={'100%'}
          >
            {isEmail ? (
              <TextField
                id={`sign-up-email`}
                error={isEmailError}
                helperText={emailHelperTxt}
                variant="standard"
                label="Enter Email"
                placeholder="Email"
                required
                value={email}
                onChange={(evt) => {
                  setEmail(evt.target.value);
                }}
              />
            ) : (
              <MuiPhoneNumber
                defaultCountry={'us'}
                label="Enter Phone"
                placeholder="Phone"
                disableDropdown
                required
                value={email}
                onChange={(evt) => {
                  if (typeof evt === 'string') {
                    setEmail(evt);
                  }
                }}
              />
            )}
            <PasswordInput />
          </Box>
        </Box>
      </Box>
    );
  }
);
