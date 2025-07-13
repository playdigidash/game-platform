import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { IActions } from '@lidvizion/commonlib';

// Extend IActions to include redirectUrl
interface RedirectAction extends IActions {
  redirectUrl: string;
}

const FullScreenIframe = styled('iframe')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  border: 'none',
  zIndex: 9999,
});

const StyledOverlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'white',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
});

const OverlayHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const InstructionContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: `${theme.spacing(3)} 0`,
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const InstructionText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  maxWidth: '80%',
}));

interface RedirectActionOverlayProps {
  action: RedirectAction;
  onComplete: (pointsEarned: number, completed: boolean) => void;
  onCancel: () => void;
  onStartAction: () => void;
}

const InstructionScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <InstructionContainer>
    <InstructionText variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
      Click the button below to get started!
    </InstructionText>
    <InstructionText variant="body1" color="text.secondary">
      After completing the action, click the X in the top-right to return and claim your prize!
    </InstructionText>
    <Button
      variant="contained"
      color="primary"
      onClick={onStart}
      size="large"
      startIcon={<CardGiftcardIcon />}
      sx={{
        minWidth: '200px',
        py: 1.5,
        mt: 3,
      }}
    >
      Start Action
    </Button>
  </InstructionContainer>
);

const CompletionDialog: React.FC<{
  open: boolean;
  onResponse: (completed: boolean) => void;
}> = ({ open, onResponse }) => (
  <Dialog open={open} onClose={() => onResponse(false)}>
    <DialogTitle>Did you complete the action?</DialogTitle>
    <DialogContent>
      <Typography>
        Please confirm if you've completed the required action to claim your reward.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
      <Button
        onClick={() => onResponse(false)}
        variant="outlined"
        color="error"
      >
        No, go back
      </Button>
      <Button
        onClick={() => onResponse(true)}
        variant="contained"
        color="primary"
        autoFocus
      >
        Yes, claim reward
      </Button>
    </DialogActions>
  </Dialog>
);

export const RedirectActionOverlay: React.FC<RedirectActionOverlayProps> = ({
  action,
  onComplete,
  onCancel,
  onStartAction,
}) => {
  const [showIframe, setShowIframe] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const handleStartAction = () => {
    setShowIframe(true);
    onStartAction();
  };

  const handleCloseIframe = () => {
    setShowIframe(false);
    setShowCompletionDialog(true);
  };

  const handleCompletionResponse = (completed: boolean) => {
    setShowCompletionDialog(false);
    onComplete(action.points || 0, completed);
  };

  // Add URL validation and protocol if missing
  const getValidUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  if (!showIframe && !showCompletionDialog) {
    return <InstructionScreen onStart={handleStartAction} />;
  }

  if (showIframe) {
    const validUrl = getValidUrl(action.redirectUrl);
    return (
      <StyledOverlay>
        <OverlayHeader>
          <Typography variant="h6">{action.name}</Typography>
          <IconButton onClick={handleCloseIframe} size="large">
            <CloseIcon />
          </IconButton>
        </OverlayHeader>
        <FullScreenIframe 
          src={validUrl} 
          title={action.name}
        />
      </StyledOverlay>
    );
  }

  return (
    <CompletionDialog 
      open={showCompletionDialog} 
      onResponse={handleCompletionResponse} 
    />
  );
}; 