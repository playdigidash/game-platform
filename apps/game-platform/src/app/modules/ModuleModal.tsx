import { Box, Modal, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { defaultModalStyle } from '../Common';

export const ModuleModal: React.FC = observer(() => {
  return (
    <Modal
      open={false}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        component="div"
        sx={{
          ...defaultModalStyle,
          padding: 0,
        }}
      >
        <Typography>Paused</Typography>
      </Box>
    </Modal>
  );
});
