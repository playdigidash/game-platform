import {
  Box,
  Modal,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Cleanup } from '../helper/Cleanup';
const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(90vw, 40rem)',
  maxHeight: '90vh',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  borderRadius: '1rem',
  padding: '2rem',
  outline: 'none',
  color: 'white',
  textAlign: 'center',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  overflow: 'auto',
}));

const ModelContainer = styled(Box)({
  width: '100%',
  height: '40vh',
  borderRadius: '0.5rem',
  overflow: 'hidden',
  background: 'rgba(0, 0, 0, 0.3)',
});

const ProgressWrapper = styled(Box)({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '2rem',
  width: '100%',
});

const ProgressContainer = styled(Box)({
  position: 'relative',
  width: '4rem',
  height: '4rem',
});

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
}));

const CheckButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 0,
  width: '3rem',
  height: '3rem',
  borderRadius: '50%',
  padding: 0,
  fontSize: '1.2rem',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.9,
  },
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  marginBottom: '1rem',
  color: theme.palette.primary.main,
  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
}));

const ContentTypography = styled(Typography)({
  marginBottom: '1.5rem',
  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
  lineHeight: 1.6,
});

export const FunFactModal = observer(() => {
  const {
    showFunFactModal,
    currentFunFact,
    setShowFunFactModal,
    canCloseFunFact,
    startProgress,
    resetProgress,
    progress,
  } = useGameStore().pauseMenuViewStore;
  const { currentHitObstacle } = useGameStore().obstacleViewStore;
  const theme = useTheme();
  const { translatedGameData } = useGameStore().translateViewStore;

  useEffect(() => {
    if (showFunFactModal) {
      startProgress();
    } else {
      resetProgress();
    }
  }, [showFunFactModal]);

  const handleClose = () => {
    if (canCloseFunFact) {
      setShowFunFactModal(false);
    }
  };

  if (!currentFunFact) return null;
  return (
    <Modal
      open={showFunFactModal}
      onClose={handleClose}
      aria-labelledby="fun-fact-modal-title"
      aria-describedby="fun-fact-modal-description"
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
        },
      }}
    >
      <ModalContent>
        {currentFunFact.modelData && (
          <ModelContainer>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <Cleanup />
              <ambientLight intensity={0.8} />
              <pointLight position={[10, 10, 10]} intensity={1.2} />
              {currentHitObstacle?.instance && (
                <primitive object={currentHitObstacle.instance} />
              )}
              <OrbitControls
                autoRotate
                autoRotateSpeed={4}
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </ModelContainer>
        )}
        <TitleTypography variant="h5" id="fun-fact-modal-title">
          {translatedGameData?.obstacles[currentFunFact.modelData.objId]
            .title || currentFunFact.title}
        </TitleTypography>
        <ContentTypography variant="body1" id="fun-fact-modal-description">
          {translatedGameData?.obstacles[currentFunFact.modelData.objId]
            .funFacts[currentFunFact.idx] || currentFunFact.text}
        </ContentTypography>
        <ProgressWrapper>
          <ProgressContainer>
            <StyledCircularProgress
              variant="determinate"
              value={progress}
              size="4rem"
              sx={{
                color: canCloseFunFact
                  ? theme.palette.success.main
                  : theme.palette.primary.main,
              }}
            />
            {canCloseFunFact && (
              <CheckButton
                onClick={handleClose}
                variant="contained"
                aria-label="Close fun fact"
              >
                ✓
              </CheckButton>
            )}
          </ProgressContainer>
        </ProgressWrapper>
      </ModalContent>
    </Modal>
  );
});
