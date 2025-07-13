import React from 'react';
import { Box } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { scrollableContainerStyles } from '../GameLibraryProps';

export interface ContentContainerProps {
  children: React.ReactNode;
}

const StyledContentContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  background: 'linear-gradient(135deg, #121212, #202020)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

export const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
  return (
    <Box 
      component="div" 
      sx={{
        ...scrollableContainerStyles,
        paddingTop: { xs: '4rem', sm: '4.5rem' },
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <StyledContentContainer>
        {children}
      </StyledContentContainer>
    </Box>
  );
}; 