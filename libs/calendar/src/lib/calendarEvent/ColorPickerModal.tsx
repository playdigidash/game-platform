import { CalendarEventModel } from '@lidvizion/commonlib';
import { Box, Modal } from '@mui/material';
import { observer } from 'mobx-react';
import { CirclePicker } from 'react-color';

interface IColorPickerModal {
  showColorPickerModal: boolean;
  currentEvent: CalendarEventModel;
  setShowColorPickerModal: (bool: boolean) => void;
}

export const ColorPickerModal: React.FC<IColorPickerModal> = observer(
  ({ showColorPickerModal, currentEvent, setShowColorPickerModal }) => {
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 350,
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    return (
      <Modal
        open={showColorPickerModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="div" className="instruction-modal-wrapper" sx={style}>
          <CirclePicker
            onChange={(color) => {
              currentEvent.color = color.hex;
              setShowColorPickerModal(false);
            }}
          />
        </Box>
      </Modal>
    );
  }
);
