import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import { observer } from 'mobx-react';
import { useGameStore } from '../RootStore/RootStoreProvider';

const PauseButton = observer(() => {
  const { setShowPauseModal } = useGameStore().pauseMenuViewStore;

  const handlePauseClick = () => {
    setShowPauseModal(true);
  };

  return (
    <IconButton
      onClick={handlePauseClick}
      size="small"
      title="Pause Game"
      sx={{
        color: 'rgba(255, 255, 255, 0.7)',
        padding: '2px',
        '&:hover': {
          color: 'white',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <PauseIcon sx={{ fontSize: '2rem' }} />
    </IconButton>
  );
});

export default PauseButton;
