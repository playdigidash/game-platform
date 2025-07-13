import { Box, Modal, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import ScreenRotationAltIcon from '@mui/icons-material/ScreenRotationAlt';
import { useGameStore } from '../RootStore/RootStoreProvider';

export const LandscapeModal: React.FC = observer(() => {
  const { showLandscapeModal } = useGameStore().mainSceneViewStore;

  return (
    <Modal
      open={showLandscapeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      <Box
        component="div"
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={'1em'}
        height={'100%'}
        textAlign={'center'}
      >
        <Typography sx={{ color: 'white', fontSize: '1.5rem' }}>
          Please Use Landscape View for Best Experience
        </Typography>
        <ScreenRotationAltIcon sx={{ color: 'white', fontSize: '4rem' }} />
      </Box>
    </Modal>
  );
});
