import { Box, Dialog, IconButton, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Editor } from '@lidvizion/commonlib';
import { observer } from 'mobx-react';

interface HintModalProps {
  open: boolean;
  onClose: () => void;
  hint: { title: string; xformedH: string } | null;
}

export const HintScreen = observer(
  ({ open, onClose, hint }: HintModalProps) => {
    const theme = useTheme();

    if (!hint) return null;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
          },
        }}
        sx={{ zIndex: 2000 }}
      >
        <Box
          component="div"
          sx={{
            p: 3,
            position: 'relative',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 2,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            {hint.title}
          </Typography>

          <Box
            component="div"
            sx={{
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Editor
              detail={hint.xformedH}
              readOnly={true}
              showToolbar={false}
              classStyles={{
                width: '100%',
              }}
              namespace={'hints-modal'}
            />
          </Box>
        </Box>
      </Dialog>
    );
  }
);
