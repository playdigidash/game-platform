import React, { forwardRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Styled components
const DrawerContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderTopLeftRadius: '1rem',
  borderTopRightRadius: '1rem',
  background: 'linear-gradient(to bottom, #1a1a2e, #121212)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '100%',
  maxHeight: '90vh',
}));

const DrawerHandle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '0.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '4rem',
  height: '0.25rem',
  backgroundColor: alpha(theme.palette.common.white, 0.2),
  borderRadius: '0.125rem',
  cursor: 'pointer',
  zIndex: 10,
}));

const GameDescription = styled(Box)(({ theme }) => ({
  padding: '0 1.5rem 1.5rem',
  overflow: 'auto',
  flexGrow: 1,
  [theme.breakpoints.down('sm')]: {
    padding: '0 1rem 1rem',
  },
}));

interface DrawerContentProps {
  children: React.ReactNode;
  onClose: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  gameDescriptionRef: React.RefObject<HTMLDivElement>;
}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(({
  children,
  onClose,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  gameDescriptionRef
}, ref) => {
  return (
    <DrawerContentContainer
      ref={ref}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <DrawerHandle onClick={onClose} />
      <GameDescription ref={gameDescriptionRef}>
        {children}
      </GameDescription>
    </DrawerContentContainer>
  );
}); 