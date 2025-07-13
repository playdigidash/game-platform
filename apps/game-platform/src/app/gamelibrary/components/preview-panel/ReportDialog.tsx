import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha, useTheme } from '@mui/material/styles';

// Styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: alpha('#fff', 0.2),
    },
    '&:hover fieldset': {
      borderColor: alpha('#fff', 0.3),
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  reportReason: string;
  onReportReasonChange: (reason: string) => void;
  onSubmit: () => void;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onClose,
  reportReason,
  onReportReasonChange,
  onSubmit
}) => {
  const theme = useTheme();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: '#1E1E2D',
          color: 'white',
          borderRadius: '0.75rem',
          maxWidth: '30rem',
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Report Game
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color={alpha('#fff', 0.7)} sx={{ mb: 2 }}>
          Please describe why you're reporting this game:
        </Typography>
        <StyledTextField
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          placeholder="Describe the issue..."
          value={reportReason}
          onChange={(e) => onReportReasonChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose}
          sx={{ color: alpha('#fff', 0.7) }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained"
          onClick={onSubmit}
          sx={{
            background: theme.palette.error.main,
            '&:hover': {
              background: theme.palette.error.dark,
            }
          }}
        >
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 