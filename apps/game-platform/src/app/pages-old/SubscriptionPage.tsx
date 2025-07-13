import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import PlansGrid from '../settings/components/Subscription/PlansGrid';

// Dark theme suitable for the subscription page
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    primary: {
      main: '#ad00ff',
    },
  },
});

const StyledContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#121212', // Dark background
  padding: theme.spacing(2),
  paddingTop: theme.spacing(4),
}));

export const SubscriptionPage: React.FC = observer(() => {
  const { subscriptionViewStore } = useGameStore();

  useEffect(() => {
    // Fetch plans data when the component mounts
    subscriptionViewStore.fetchPlansAndFeatures();
  }, [subscriptionViewStore]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <StyledContainer>
        <PlansGrid title="Upgrade your plan" />
      </StyledContainer>
    </ThemeProvider>
  );
});

export default SubscriptionPage; 