import React from 'react';
import { Box, Typography } from '@mui/material';
import GameImage from '../ui/GameImage';

interface GameBannerProps {
  hasBanner: boolean;
  bannerSrc: string;
}

export const GameBanner: React.FC<GameBannerProps> = ({ hasBanner, bannerSrc }) => {
  if (!hasBanner) return null;

  return (
    <Box
      component="div"
      style={{
        position: 'relative',
        width: '100%',
        marginTop: '1rem',
        marginBottom: '2rem',
      }}
    >
      <GameImage
        width="100%"
        height={'15vh'}
        src={bannerSrc}
        alt="Sponsored Banner"
      />
      <Typography
        sx={{
          textAlign: 'center',
          opacity: 0.7,
          marginTop: '-1rem',
          position: 'absolute',
          background: 'black',
          borderTopRightRadius: '1rem',
          p: '0.2rem 0.5rem',
          bottom: 0,
          left: 0,
        }}
      >
        Presented by
      </Typography>
    </Box>
  );
}; 