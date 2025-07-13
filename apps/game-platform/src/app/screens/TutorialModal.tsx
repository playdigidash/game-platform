import { defaultModalStyle } from '@lidvizion/commonlib';
import { Modal, Typography, TextField, Button, Box } from '@mui/material';
import { observer } from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay-ts';
import Carousel from 'react-spring-3d-carousel';
import { useGameStore } from '../RootStore/RootStoreProvider';

export const TutorialModal: React.FC = observer(() => {
    const {
        currentSlideIndex,
        tutorialSlides
    } = useGameStore().gamePlayViewStore

  return (
    <Modal
      open={true}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <LoadingOverlay
        active={true}
        spinner={false}
        text={
          <Box
            component={'div'}
            display={'flex'}
            flexDirection={'column'}
            gap={'1em'}
          >
            <Carousel
              offsetRadius={2}
              goToSlide={currentSlideIndex}
              slides={tutorialSlides}
              showNavigation={false}
            />
          </Box>
        }
      >
        <Box
          component="div"
          className="instruction-modal-wrapper"
          sx={{
            ...defaultModalStyle,
            width: '100vw',
            alignItems: 'center',
            height: '100vh',
          }}
        ></Box>
      </LoadingOverlay>
    </Modal>
  );
});
