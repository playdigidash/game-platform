import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface GameTitleProps {
  title: string | undefined;
}

export const GameTitle: React.FC<GameTitleProps> = ({ title }) => {
  if (!title) return null;

  return (
    <Box
      component="div"
      sx={{
        width: '100%',
        padding: '0.75rem',
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.2
          )}, ${alpha(theme.palette.secondary.main, 0.2)})`,
        borderRadius: '1rem',
        backdropFilter: 'blur(0.625rem)',
        boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.2)',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="gameHeading"
        sx={{
          textAlign: 'center',
          background: (theme) =>
            `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[300]} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: (theme) =>
            `drop-shadow(0 0 0.5rem ${theme.palette.common.white}30)`,
          fontSize: {
            xs: 'clamp(1rem, 5vw, 2.5rem)',
            md: 'clamp(1.5rem, 4vw, 3rem)',
          },
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '95%',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}; 