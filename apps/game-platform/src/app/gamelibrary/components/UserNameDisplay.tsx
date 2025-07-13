import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export interface UserNameDisplayProps {
  displayName: string;
}

const UserNameContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  background: alpha(theme.palette.primary.main, 0.1),
  backdropFilter: 'blur(0.625rem)',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
  },
}));

export const UserNameDisplay: React.FC<UserNameDisplayProps> = ({ displayName }) => {
  return (
    <UserNameContainer>
      <Typography 
        variant="h5" 
        sx={{ 
          color: 'white',
          fontWeight: 'bold',
          fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
        }}
      >
        {displayName}
      </Typography>
    </UserNameContainer>
  );
}; 