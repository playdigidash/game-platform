import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Button, Typography, styled } from '@mui/material';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { ensureProtocol } from '../../utils/urlUtils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RedeemIcon from '@mui/icons-material/Redeem';
import { alpha } from '@mui/material/styles';
import { Editor } from '@lidvizion/commonlib';

// TODO: upgrade to postMessage / return-URL handshake when partner supports it // CHANGED

interface RedirectActionProps {
  actionId: string;
  name: string;
  redirectUrl: string;
  points: number;
  description?: string;
  onComplete?: () => void;
} // CHANGED

const ActionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.25rem',
  width: '100%',
  maxWidth: '90vw',
})); // CHANGED

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',
  justifyContent: 'space-between',
}));

const DoneButton = styled(Button)(({ theme }) => ({
  flex: '3', // Takes up 75% of space
  height: '3.25rem',
  borderRadius: '0.75rem',
  color: '#FFFFFF',
  '& .MuiButton-startIcon': {
    color: '#FFFFFF',
  },
}));

const CancelButton = styled(Box)(({ theme }) => ({
  flex: '1', // Takes up 25% of space
  textAlign: 'center',
  color: theme.palette.grey[400],
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: '1rem',
  '&:hover': {
    color: theme.palette.grey[300],
  },
}));

const EarnedBadge = styled(Box)(({ theme }) => ({
  padding: '0.5rem 1rem',
  borderRadius: '0.75rem',
  backgroundColor: theme.palette.success.main,
  color: '#FFFFFF',
  fontSize: '1rem',
  '& .MuiTypography-root': {
    color: '#FFFFFF'
  }
})); // CHANGED

const StyledButton = styled(Button)(({ theme }) => ({
  width: '90%',
  minWidth: '15rem',
  height: '3.25rem',
  borderRadius: '0.75rem',
  paddingInline: '2rem',
  fontSize: '1rem',
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main || theme.palette.primary.light})`,
  '&:hover': {
    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.secondary.main || theme.palette.primary.light, 0.9)})`,
  },
  '&:active': {
    transform: 'scale(0.97)',
  },
  transition: 'transform 0.2s ease',
  '& .MuiButton-startIcon': {
    color: '#FFFFFF',
  },
  '& .MuiButton-label': {
    color: '#FFFFFF',
  },
}));

const CancelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[400],
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: '1rem',
  '&:hover': {
    color: theme.palette.grey[300],
  },
}));

const PointsTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  fontSize: '1rem',
  fontWeight: 'normal',
  color: theme.palette.text.primary,
  marginBottom: '1rem',
  lineHeight: '1.25rem',
  alignSelf: 'flex-start',
  width: '100%',
}));

export const RedirectAction: React.FC<RedirectActionProps> = observer(({
  actionId,
  name,
  redirectUrl,
  points,
  description,
  onComplete
}) => {
  const { actionViewStore } = useGameStore();

  const handleStart = () => {
    const url = ensureProtocol(redirectUrl);
    window.open(url, '_blank', 'noopener,noreferrer');
    actionViewStore.startAction(actionId);
    actionViewStore.addPendingRedirect(actionId, points);
  };

  const handleComplete = async () => {
    try {
      await actionViewStore.complete(actionId);
      onComplete?.();
    } catch (error) {
      console.error('Error completing action:', error);
    }
  };

  const handleAbort = () => {
    actionViewStore.abort(actionId);
  };

  if (actionViewStore.isCompleted) {
    return (
      <ActionContainer>
        <EarnedBadge className="earned-badge">
          <Typography>+{points} pts earned!</Typography>
        </EarnedBadge>
      </ActionContainer>
    );
  }

  if (actionViewStore.isStarted) {
    return (
      <ActionContainer>
        <Typography variant="body1">Complete the action to earn your points!</Typography>
        <ButtonContainer>
          <DoneButton
            variant="contained"
            color="success"
            onClick={handleComplete}
            startIcon={<CheckCircleIcon sx={{ color: '#FFFFFF' }} />}
          >
            Done!
          </DoneButton>
          <CancelButton onClick={handleAbort}>
            Cancel
          </CancelButton>
        </ButtonContainer>
      </ActionContainer>
    );
  }

  return (
    <ActionContainer>
      <PointsTitle>
        {description ? (
          <Editor
            detail={description}
            readOnly={true}
            showToolbar={false}
            classStyles={{
              maxWidth: '90vw',
            }}
            namespace={'action-description'}
          />
        ) : (
          <Typography variant="body1">
            Get {points} Bonus Points!
          </Typography>
        )}
      </PointsTitle>
      <StyledButton
        variant="contained"
        onClick={handleStart}
        startIcon={<RedeemIcon />}
      >
        Get Points!
      </StyledButton>
    </ActionContainer>
  );
}); // CHANGED 