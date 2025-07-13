import React from 'react';
import { styled, alpha, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material';

const SmokeBackgroundContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  width: '100vw',
  height: '100vh',
  backgroundSize: '180% 180%',
  animation: 'move-smoke 10s infinite',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',

  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    opacity: 0.6,
    animation: 'swirl 8s infinite linear',
  },
  '&::before': {
    background: `radial-gradient(circle, ${alpha(
      theme.palette.primary.main,
      0.5
    )}, transparent)`,
  },
  '&::after': {
    background: `radial-gradient(circle, ${alpha(
      theme.palette.secondary.main,
      0.5
    )}, transparent)`,
    animationDuration: '12s',
  },
  '@keyframes move-smoke': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
  '@keyframes swirl': {
    '0%': {
      transform: 'translate(-50%, -50%) rotate(0deg)',
    },
    '100%': {
      transform: 'translate(-50%, -50%) rotate(360deg)',
    },
  },
}));

interface SmokeBackgroundProps {
  children: React.ReactNode;
}

export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <SmokeBackgroundContainer theme={theme}>
      {children}
    </SmokeBackgroundContainer>
  );
}; 