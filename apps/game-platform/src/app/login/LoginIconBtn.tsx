import { observer } from 'mobx-react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { Divider, IconButton } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export const LoginIconBtn = observer(() => {
  const { isAnonLogin, setShowLoginModal } = useGameStore().gameLoginViewStore;
  return isAnonLogin ? (
    <>
      <Divider orientation="vertical" flexItem />
      <IconButton onClick={() => setShowLoginModal(true)}>
        <LoginIcon />
      </IconButton>
    </>
  ) : null;
});
