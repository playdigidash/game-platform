import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Container } from '@mui/material';
import Carousel from './Carousel';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { SystemStyleObject, Theme } from '@mui/system';
import DigiDashLogo from '.apps/game-platform/src/assets/images/dd-logo-white500x500.svg';

const containerStyles: SystemStyleObject<Theme> = { 
  position: 'relative',
  width: '100%',
  minHeight: '10rem', // Fixed height for banner
  backgroundColor: '#000', // Dark background for the banner
  overflow: 'hidden'
};

const logoStyles: SystemStyleObject<Theme> = {
  position: 'absolute',
  left: '2rem',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  width: '180px', // Increased size for better visibility
  height: 'auto',
  filter: 'brightness(1.2)', // Make the logo pop against dark background
};

/**
 * CarouselPage component that displays the game carousel as a banner
 */
export const CarouselPage: React.FC = observer(() => {
  const store = useGameStore();
  const { setMuted } = store.carouselViewStore;

  // Set audio muted by default
  useEffect(() => {
    setMuted(true);
  }, [setMuted]);

  return (
    <Box component="div" sx={containerStyles}>
      {/* <img 
        src={DigiDashLogo}
        alt="Digi Dash Logo" 
        // style={logoStyles}
      /> */}
      <Carousel />
    </Box>
  );
});

export default CarouselPage; 