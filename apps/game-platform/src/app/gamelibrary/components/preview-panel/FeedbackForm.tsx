import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Modal
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Modal content with rem and vh units for better scalability
const ModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75vw;
  max-width: 56rem;
  box-shadow: 1.5rem 1.5rem 3rem rgba(0, 0, 0, 0.2);
  padding: 1rem;
  max-height: 90vh;
  overflow: auto;
  border-radius: 1rem;
  background-color: ${({ theme }) => alpha('#1E1E2D', 0.97)};
  color: white;
  z-index: 9999;
  outline: none;
  
  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: 85vw;
  }
  
  ${({ theme }) => theme.breakpoints.down('md')} {
    width: 90vw;
  }
  
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 95vw;
    padding: 1rem;
  }
`;

// Enhanced TextField styling with rem units
const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
  
  .MuiInputBase-input {
    color: white;
    padding: 1rem;
  }
  
  .MuiInputLabel-root {
    color: white;
    font-size: 1.1rem;
    transform: translate(1rem, 1rem) scale(1);
    
    &.Mui-focused, &.MuiFormLabel-filled {
      transform: translate(1rem, -0.5rem) scale(0.75);
    }
  }
  
  .MuiOutlinedInput-root {
    fieldset {
      border-color: white;
      border-width: 0.0625rem;
    }
    
    &:hover fieldset {
      border-color: white;
    }
    
    &.Mui-focused fieldset {
      border-color: white;
      border-width: 0.125rem;
    }
  }
`;

// Larger text area for description
const DescriptionTextField = styled(StyledTextField)`
  margin-bottom: 1rem;
  
  .MuiInputBase-input {
    min-height: 9rem;
  }
  
  .MuiFormHelperText-root {
    color: ${({ theme }) => theme.palette.grey[400]};
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }
`;

// Game ID display at bottom of form
const GameIdDisplay = styled(Typography)`
  color: ${({ theme }) => theme.palette.grey[500]};
  font-size: 0.8rem;
  text-align: left;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

// Button container
const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

export interface FeedbackFormProps {
  open: boolean;
  onClose: () => void;
  gameTitle?: string;
  gameId?: string;
  email: string;
  description: string;
  onEmailChange: (email: string) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
  setTopic: (topic: string) => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  open,
  onClose,
  gameTitle = 'Game',
  gameId,
  email,
  description,
  onEmailChange,
  onDescriptionChange,
  onSubmit,
  setTopic
}) => {
  const [formError, setFormError] = useState<string | null>(null);

  // Reset errors when form opens
  useEffect(() => {
    if (open) {
      setFormError(null);
      setTopic('Other');
    }
  }, [open, setTopic]);

  // Handle form submission with validation
  const handleSubmit = () => {
    if (!description || description.trim() === '') {
      setFormError('Please provide a description of the issue');
      return;
    }
    
    // Store the gameId for the feedback submission
    if (gameId) {
      // Store gameId in localStorage or pass directly to the submission handler
      localStorage.setItem('feedbackGameId', gameId);
    }
    
    onSubmit();
    setFormError(null);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setFormError(null);
      }}
      aria-labelledby="feedback-modal-title"
      aria-describedby="feedback-modal-description"
    >
      <ModalContent>
        <Typography id="feedback-modal-title" variant="h5" component="h2" sx={{ mb: '1rem', fontWeight: 'bold' }}>
          Report Game: {gameTitle}
        </Typography>
        <Typography variant="body1" color="gray" sx={{ mb: '2rem' }}>
          Your feedback helps everyone!
        </Typography>
        
        <StyledTextField
        //   label="Your Email (optional)"
          fullWidth
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="your@email.com"
          InputLabelProps={{ 
            shrink: true,
          }}
        />
        
        <DescriptionTextField
          label="Description of issue *"
          multiline
        //   rows={1}
          fullWidth
          required
          value={description}
          onChange={(e) => {
            onDescriptionChange(e.target.value);
            if (e.target.value.trim() !== '') {
              setFormError(null);
            }
          }}
        //   placeholder="Please describe the issue you're experiencing..."
          error={!!formError}
        //   helperText={formError || "Please include as much detail as possible"}
          InputLabelProps={{ 
            shrink: true,
          }}
        />
        
        {/* Game ID displayed at bottom */}
        {gameId && (
          <GameIdDisplay>
            Game ID: {gameId}
          </GameIdDisplay>
        )}
        
        <ButtonContainer>
          <Button 
            variant="outlined" 
            onClick={() => {
              onClose();
              setFormError(null);
            }}
            sx={{      
              color: 'white', 
              borderColor: 'white',
              padding: '0.5rem 1rem'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            disabled={!description || description.trim() === ''}
            onClick={handleSubmit}
            sx={{ padding: '0.5rem 1rem' }}
          >
            Submit
          </Button>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackForm; 