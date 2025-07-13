import { Box, Fade, IconButton, Typography, useTheme, Modal, SxProps, Theme } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { HintScreen } from '../pause/HintScreen';
import { styled, keyframes } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const blink = keyframes`
  0% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.4; transform: scale(1); }
`;

const modalStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, 0)',
  width: 'min(90vw, 500px)',
  bgcolor: 'background.paper',
  borderRadius: '1rem',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  zIndex: 1400,
};

const BlinkingIconButton = styled(IconButton)(({ theme }) => ({
  animation: `${blink} 2s infinite ease-in-out`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  width: '40px',
  height: '40px',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    animation: 'none',
  },
  '&:active': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const HintBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  margin: theme.spacing(0.5),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  boxShadow: theme.shadows[2],
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.action.hover,
  },
}));

export const CollectedHintsDisplay = observer(() => {
  const { collectedHints, questionMode, isTutorial } = useGameStore().gamePlayViewStore;
  const { showAnswers } = useGameStore().questionViewStore;
  const [selectedHint, setSelectedHint] = useState<{
    title: string;
    xformedH: string;
  } | null>(null);
  const [showHintsModal, setShowHintsModal] = useState(false);
  const theme = useTheme();
  const { translatedGameData } = useGameStore().translateViewStore;
  const availableHintsLabel = translatedGameData?.availableHintsLabel || 'Available Hints';

  if (!questionMode || collectedHints.length === 0 || !showAnswers) {
    return null;
  }

  return (
    <>
      <Box
        component="div"
        sx={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1400,
        }}
      >
        <BlinkingIconButton
          onClick={() => setShowHintsModal(true)}
          sx={{
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: theme.palette.common.white
            }}
          >
            H
          </Typography>
          <Typography
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: theme.palette.secondary.main,
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'normal'
            }}
          >
            {collectedHints.length}
          </Typography>
        </BlinkingIconButton>
      </Box>

      <Modal
        open={showHintsModal}
        onClose={() => setShowHintsModal(false)}
        sx={{
          zIndex: 1500,
        }}
      >
        <Box component="div" sx={modalStyle}>
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              mb: 2,
              color: theme.palette.primary.main,
              fontWeight: 'bold'
            }}
          >
            {availableHintsLabel} ({collectedHints.length})
          </Typography>
          <Box 
            component="div"
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1 
            }}
          >
            {collectedHints.map((hint, index) => (
              <HintBox
                component="div"
                key={hint.id || index}
                onClick={() => {
                  setSelectedHint(translatedGameData?.questions[hint.qId].hints[hint.idx] || hint);
                  setShowHintsModal(false);
                }}
              >
                <HelpOutlineIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {translatedGameData?.questions[hint.qId].hints[hint.idx].title || `Hint ${index + 1}`}
                </Typography>
              </HintBox>
            ))}
          </Box>
        </Box>
      </Modal>

      <HintScreen
        open={!!selectedHint}
        onClose={() => setSelectedHint(null)}
        hint={selectedHint}
      />
    </>
  );
});
