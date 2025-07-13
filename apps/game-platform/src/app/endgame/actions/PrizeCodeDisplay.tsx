import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  useTheme,
  Alert,
  styled
} from '@mui/material';
import { IActions, CodeConfig } from '@lidvizion/commonlib'; 

// Create styled components instead of using sx props 
const RootBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center'
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1)
}));

const DescriptionTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

const CaptionTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: 'block'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: 16 // equivalent to gap: 2 in the theme spacing
});

export interface PrizeCodeDisplayProps {
  action: IActions;
  onComplete: (pointsEarned: number) => void;
  onCancel: () => void;
}

export const PrizeCodeDisplay: React.FC<PrizeCodeDisplayProps> = ({
  action,
  onComplete,
  onCancel,
}) => {
  const theme = useTheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get the code from the config object
  const actionConfig = action.config as CodeConfig;
  const correctCode = actionConfig?.code;

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allowing alphanumeric based on typical prize codes, adjust if only numeric like original
    const value = e.target.value;
    setCode(value);
    setError('');
    setSuccess(false);
  };

  const handleRedeem = () => {
    if (!correctCode) {
      setError('No code configured for this action. Please contact support.');
      return;
    }
    // Add case sensitivity from action.config.caseSensitive if needed
    const isMatch = actionConfig?.caseSensitive ? code === correctCode : code.toLowerCase() === correctCode.toLowerCase();

    if (isMatch) {
      setSuccess(true);
      setError('');
      // Potentially show success message for a bit before calling onComplete
      setTimeout(() => {
        onComplete(action.points);
      }, 1000); // Delay to show success message
    } else {
      setError('Incorrect, try again.');
      setSuccess(false);
    }
  };

  return (
    <RootBox>
      <HeaderTypography variant="h6">
        {action.name}
      </HeaderTypography>
      <DescriptionTypography variant="body1">
        Enter the code to earn {action.points} points!
      </DescriptionTypography>
      {action.description && (
        <CaptionTypography 
          variant="caption" 
          color={theme.palette.text.secondary}
          dangerouslySetInnerHTML={{ __html: action.description }} 
        />
      )}
      
      <StyledTextField
        fullWidth
        variant="outlined"
        value={code}
        onChange={handleCodeChange}
        error={false} // Never show red error state
        helperText={error ? (
          <Alert severity="warning" sx={{ mt: 1 }}>
            {error}
          </Alert>
        ) : null}
        disabled={success} // Disable input after success
        inputProps={{
          // maxLength: 6, // If there's a standard length, from config ideally
          style: {
            textAlign: 'center',
            fontSize: '1.5rem',
            letterSpacing: '0.2em',
            fontWeight: 'bold',
          },
        }}
      />
      
      {success && (
        <StyledAlert severity="success">
          Correct! You've earned {action.points} points.
        </StyledAlert>
      )}
      
      <ButtonContainer>
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={success}
        >
          Cancel
        </Button>
        <Button
          onClick={handleRedeem}
          variant="contained"
          disabled={code.length < 1 || success}
        >
          Redeem
        </Button>
      </ButtonContainer>
    </RootBox>
  );
}; 