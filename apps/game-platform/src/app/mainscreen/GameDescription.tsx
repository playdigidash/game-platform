import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface GameDescriptionProps {
  description: string | undefined;
  onDescriptionClick: (event: React.MouseEvent<HTMLDivElement>, description: string | undefined) => void;
}

export const GameDescription: React.FC<GameDescriptionProps> = ({ 
  description, 
  onDescriptionClick 
}) => {
  if (!description) return null;

  return (
    <Box
      component="div"
      sx={{
        width: '100%',
        padding: '1.5rem',
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )}, ${alpha(theme.palette.secondary.main, 0.1)})`,
        borderRadius: '0.75rem',
        backdropFilter: 'blur(0.3125rem)',
        boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
        marginBottom: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        justifyContent: 'center',
        '&:hover': {
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.15
            )}, ${alpha(theme.palette.secondary.main, 0.15)})`,
          transform: 'translateY(-0.125rem)',
          boxShadow: '0 0.35rem 0.7rem rgba(0,0,0,0.2)',
        },
      }}
      onClick={(event: React.MouseEvent<HTMLDivElement>) =>
        onDescriptionClick(event, description)
      }
    >
      <Typography
        variant="gameText"
        sx={{
          textAlign: 'center',
          opacity: 0.9,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: (theme) => theme.palette.common.white,
          letterSpacing: '0.05em',
          fontWeight: 500,
          maxWidth: '95%',
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}; 