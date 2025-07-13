import { Box, Button, IconButton, alpha, Modal } from '@mui/material';
import { observer } from 'mobx-react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useEffect, useState } from 'react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { SelectAvaDescription } from './SelectAvaDescription';
import { SelectAvaGroup } from './SelectAvaGroup';

export const AvaSelectModal = observer(() => {
  const { avaSelectHelper, showCarousel } = useGameStore().gameViewStore;
  const [hideNow, setHidden] = useState(false);

  useEffect(() => {
    if (avaSelectHelper.event === 'enter') {
      setHidden(true);
    }
  }, [avaSelectHelper]);

  return (
    <Modal
      open={showCarousel}
      aria-labelledby="avatar-selection-modal"
      aria-describedby="avatar-selection-modal-description"
      hideBackdrop
      disableEnforceFocus
      disableAutoFocus
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pointerEvents: 'none', // Allow clicking through the modal container
      }}
    >
      <Box
        component="div"
        sx={{
          width: '85vw',
          padding: '1.5em',
          textAlign: 'center',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '0.5rem',
          boxShadow: '0 0.2vh 0.5vh rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
          backdropFilter: 'blur(0.3125rem)',
          marginBottom: '1.5em', // Position at bottom third
          overflow: 'hidden',
          pointerEvents: 'auto', // Re-enable pointer events for the content
        }}
      >
        <SelectAvaDescription />
        <SelectAvaGroup />
      </Box>
    </Modal>
  );
});
