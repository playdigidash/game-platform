import React from 'react';
import GameImage from '../ui/GameImage';

interface GameLogoProps {
  logoSrc: string;
}

export const GameLogo: React.FC<GameLogoProps> = ({ logoSrc }) => {
  const gameImageSx = {
    borderRadius: '2rem',
    overflow: 'hidden',
    boxShadow: '0 0.5rem 2rem rgba(0,0,0,0.3)',
    maxWidth: '80vw',
    maxHeight: '35vh',
    objectFit: 'cover',
  };
  
  return (
    <GameImage
      width={'22rem'}
      height={'22rem'}
      src={logoSrc}
      alt="Digi Dash Loading Logo"
      useImgTag={true}
      sx={gameImageSx}
    />
  );
}; 