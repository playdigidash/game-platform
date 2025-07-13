import React from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../RootStore/RootStoreProvider';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowMenuScreen } = useGameStore().gameViewStore;
  const { setSelectedHero } = useGameStore().gamePlayViewStore;

  const handleBackClick = () => {
    // Reset hero selection to show avatar selection screen
    setSelectedHero(-1);
    setShowMenuScreen(true);
    
    // Navigate back to the main screen (remove /dash from URL)
    const currentPath = location.pathname;
    const mainPath = currentPath.replace(/\/dash$/, '');
    navigate(mainPath);
  };

  return (
    <IconButton
      onClick={handleBackClick}
      size="small"
      title="Back to Main Screen"
      sx={{
        color: 'rgba(255, 255, 255, 0.7)',
        padding: '2px',
        '&:hover': {
          color: 'white',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <ArrowBackIcon sx={{ fontSize: '2rem' }} />
    </IconButton>
  );
}; 