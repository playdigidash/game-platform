import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Snackbar,
  Box,
  keyframes,
  IconButton,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

interface QrCodeModalProps {
  url: string;
  open: boolean;
  onClose?: () => void;
}

// Define keyframes for pulsing animation
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 ${'rgba(0, 123, 255, 0.5)'}; }
  70% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
`;

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  url,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setSnackbarOpen(true);
  };

  const handleClose = () => {
    // Store the user's preference in localStorage so we don't show it again
    localStorage.setItem('qrCodeModalDismissed', 'true');

    // Call the parent component's onClose if provided
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth={true}
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: '100vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <PhoneIphoneIcon sx={{ fontSize: '1.5rem' }} />
        <Typography variant="h4" component="span">
          Scan to Play
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          textAlign: 'center',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          overflow: 'visible',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Please use your mobile device to continue.
        </Typography>

        <div
          style={{
            display: 'inline-block',
            padding: theme.spacing(2),
            border: `4px solid ${theme.palette.primary.main}`,
            borderRadius: theme.shape.borderRadius * 2,
            backgroundColor: theme.palette.background.paper,
            animation: `${pulse} 2s infinite`,
            boxShadow: `0 0 0 0 ${'rgba(0, 123, 255, 0.5)'}`,
          }}
        >
          <QRCodeSVG
            value={url}
            size={220}
            level="H"
            includeMargin={true}
            fgColor={theme.palette.text.primary}
            bgColor={theme.palette.background.paper}
          />
        </div>

        <Typography
          variant="caption"
          display="block"
          sx={{
            mt: 2,
            fontSize: '1rem',
            opacity: 0.8,
            color: 'text.secondary',
          }}
        >
          Point your phone camera at the QR code to scan.
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopyLink}
          sx={{
            mt: 2,
            textTransform: 'none',
            color: 'common.white',
            borderColor: 'common.white',
            '&:hover': {
              borderColor: 'common.white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Or copy link
        </Button>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{
            color: theme.palette.grey[400],
            '&:hover': {
              color: theme.palette.common.white,
            },
          }}
        >
          I'm already on a mobile device
        </Button>
      </DialogActions>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Dialog>
  );
};
