import React from 'react';
import { Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '@lidvizion/commonlib';
import { TopRightMainScreen } from './TopRightMainScreen';

export const TopNavigationBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="div"
      sx={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        background: 'rgba(0, 0, 50, 0.3)',
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        backdropFilter: 'blur(0.3125rem)',
        boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
        color: 'white',
      }}
    >
      {/* Left side - Home button */}
      <IconButton
        onClick={() => navigate('/' + AppRoute.games)}
        size="small"
        title="Home"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '2px',
          '&:hover': {
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <HomeIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>

      {/* Right side - Use existing TopRightMainScreen component */}
      <TopRightMainScreen />
    </Box>
  );
}; 