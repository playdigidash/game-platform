import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  useTheme,
  CircularProgress,
  DialogActions,
  Alert,
  styled
} from '@mui/material';
import { IActions } from '@lidvizion/commonlib';
import { SxProps, Theme } from '@mui/material/styles';

// Create styled components for error state
const ErrorContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center'
}));

const ErrorAlertStyled = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

// Create a MainBox styled component instead of using sx
const MainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// Styled component for centered text Box
const CenteredTextBox = styled(Box)({ textAlign: 'center' });

// Loading container styled component
const LoadingContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: 300
});

// Styled Typography for loading text
const LoadingText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1)
}));

// Warning Alert styled component
const WarningAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(1)
}));

// Action Button styled component
const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2)
}));

interface RedirectConfig {
  url: string;
  actionTitle?: string; 
  actionDescription?: string; 
  // Add other redirect specific config fields if any
}

export interface UrlRedirectDisplayProps {
  action: IActions;
  onComplete: (pointsToAward: number, verified: boolean) => void;
  onCancel: () => void; // Added for consistency, can be used if user wants to close from initial/iframe stage
}

export const UrlRedirectDisplay: React.FC<UrlRedirectDisplayProps> = ({
  action,
  onComplete,
  onCancel,
}) => {
  const theme = useTheme();
  const [viewStage, setViewStage] = useState<'initial' | 'iframe' | 'verification' | 'error'>('initial');
  const [iframeLoading, setIframeLoading] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<string | null>(null);

  const config = action.config as RedirectConfig; // Type assertion
  const targetUrl = config?.url;
  const actionDescription = config?.actionDescription || 'Please review the content at the link provided.';

  useEffect(() => {
    // Reset stage if action changes (e.g. modal reopens with different action)
    setViewStage('initial');
    setIframeLoading(false);
    setIframeError(null);
    if (!targetUrl) {
        setViewStage('error');
        setIframeError('No URL configured for this action.')
    }
  }, [action, targetUrl]);

  const handleOpenLink = () => {
    if (!targetUrl) {
        setViewStage('error');
        setIframeError('No URL to open.');
        return;
    }
    setViewStage('iframe');
    setIframeLoading(true);
    setIframeError(null);
    // iframe onload and onerror will handle loading state further
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const handleIframeError = () => {
    setIframeLoading(false);
    setIframeError('Failed to load content. The website might not allow embedding. You can try opening it in a new tab if the option is available, or skip this action.');
    // Optionally, provide a button to open in new tab here, or just go to verification
    // For now, let's allow proceeding to verification even if iframe fails
  };

  const handleDoneViewing = () => {
    setViewStage('verification');
  };

  const handleVerification = (verified: boolean) => {
    onComplete(verified ? action.points : 0, verified);
  };

  // Sandbox attributes for the iframe
  const sandboxAttrs = [
    'allow-scripts',
    // 'allow-same-origin', // TODO: Future admin config - for authentication/cookies if specifically required
    // 'allow-popups',      // TODO: Future admin config - for opening external links in new tabs if necessary
    'allow-presentation',
    'allow-forms' // Allow forms within the iframe if needed
  ].join(' ');

  if (viewStage === 'error') {
    return (
      <ErrorContainer>
        <ErrorAlertStyled severity="error">
          {iframeError || 'An unexpected error occurred.'}
        </ErrorAlertStyled>
        <Button onClick={onCancel} variant="outlined">
          Close
        </Button>
      </ErrorContainer>
    );
  }

  return (
    <MainContainer>
      <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
        {config?.actionTitle || action.name}
      </Typography>

      {viewStage === 'initial' && (
        <CenteredTextBox>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {action.description ? (
              <span dangerouslySetInnerHTML={{ __html: action.description }} />
            ) : (
              actionDescription
            )}
          </Typography>
          <Button onClick={handleOpenLink} variant="contained">
            Open Link
          </Button>
          <Button onClick={onCancel} variant="text" sx={{ ml: 1 }}>
            Skip
          </Button>
        </CenteredTextBox>
      )}

      {viewStage === 'iframe' && (
        <CenteredTextBox>
          {iframeLoading && (
            <LoadingContainer>
              <CircularProgress />
              <LoadingText>Loading content...</LoadingText>
            </LoadingContainer>
          )}

          {iframeError && (
            <WarningAlert severity="warning">
              {iframeError}
            </WarningAlert>
          )}

          <iframe
            src={targetUrl}
            title={config?.actionTitle || action.name}
            width="100%"
            height="400"
            style={{
              border: iframeError ? '2px solid red' : '1px solid #ccc',
              display: iframeLoading ? 'none' : 'block',
            }}
            sandbox={sandboxAttrs}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allowFullScreen
          />

          <ActionButton
            onClick={handleDoneViewing}
            variant="contained"
          >
            I'm Done Viewing / Next Step
          </ActionButton>
        </CenteredTextBox>
      )}

      {viewStage === 'verification' && (
        <CenteredTextBox>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Did you complete the instructed action on the page: "{action.name}"?
          </Typography>
          <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
            <Button
              onClick={() => handleVerification(false)}
              variant="outlined"
              color="error"
            >
              No
            </Button>
            <Button
              onClick={() => handleVerification(true)}
              variant="contained"
            >
              Yes, I Did!
            </Button>
          </DialogActions>
        </CenteredTextBox>
      )}
    </MainContainer>
  );
};