import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../../../RootStore/RootStoreProvider';
import PlansGrid from './PlansGrid';
import { SubscriptionProps } from './SubscriptionProps';
import { styled } from '@mui/material/styles';

// Use styled components instead of sx prop to avoid complex unions
const StyledOuterBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  color: '#fff'
}));

const StyledInnerBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2)
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4)
}));

const SubscriptionComponent: React.FC<SubscriptionProps> = observer(({ title }) => {
  const { subscriptionViewStore } = useGameStore();

  // Fetch plans and features when the component mounts
  useEffect(() => {
    subscriptionViewStore.fetchPlansAndFeatures();
  }, [subscriptionViewStore]);

  return (
    <StyledOuterBox>
      <StyledInnerBox>
        {title && (
          <Typography variant="h5" align="center" gutterBottom>
            {title}
          </Typography>
        )}
        <StyledDescription variant="body1" align="center">
          Upgrade your plan to unlock more features and increase your limits
        </StyledDescription>
        
        <PlansGrid title="Choose a Plan" />
      </StyledInnerBox>
    </StyledOuterBox>
  );
});

export default SubscriptionComponent; 