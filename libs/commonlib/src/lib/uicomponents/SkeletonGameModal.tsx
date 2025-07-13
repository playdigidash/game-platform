import React from 'react';
import { observer } from 'mobx-react';
import { Box, IconButton, Modal } from '@mui/material';
import { defaultModalStyle } from '../commonmodels/Constants';
import CloseIcon from '@mui/icons-material/Close';

interface ISkeletonGameModal {
  body: React.ReactElement;
  onClose: () => any;
  headerContent?: React.ReactElement;
  fullScreen?: boolean;
}

export const SkeletonGameModal: React.FC<ISkeletonGameModal> = observer(
  ({ body, headerContent = null, onClose, fullScreen = false }) => {
    return (
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, .5)',
              backdropFilter: 'blur(2px) contrast(.9)', // Add blur and contrast effects
              position: 'relative',
            },
          },
        }}
      >
        <Box
          component="div"
          sx={{
            ...defaultModalStyle,
            padding: 0,
            width: fullScreen ? '100vw' : '90vw',
            minHeight: fullScreen ? '100vh' : '40vh',
            margin: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fully transparent background
            borderRadius: '0.5em', // Rounded corners
            backdropFilter: 'blur(10px)', // Add blur effect to the background
            position: 'absolute',
            top: fullScreen ? '50%' : '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'hidden',
            maxHeight: fullScreen ? '100vh' : '90vh',
          }}
        >
          <Box
            component="div"
            className={'skeleton-game-modal-header'}
            display={'flex'}
            justifyContent={'space-between'}
          >
            {headerContent}
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              alignItems={'flex-start'}
              flex={1}
              component={'div'}
            >
              <IconButton title="Close" aria-label={'close'} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          {body}
        </Box>
      </Modal>
    );
  }
);
