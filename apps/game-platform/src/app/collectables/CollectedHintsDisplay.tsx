import { Box, Fade, Typography, useTheme, Button } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { HintScreen } from '../pause/HintScreen';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';

const HintBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  boxShadow: theme.shadows[2],
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
}));

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
`;
const AnimatedHintButton = styled(Button)(({ theme }) => ({
  width: 'fit-content',
  minWidth: '200px',
  margin: '0 auto',
  borderRadius: '1.5rem',
  padding: '0.75rem 1.5rem',
  animation: `${pulse} 2s infinite`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateX(-50%) scale(1.02)',
  },
  zIndex: 1000,
}));

export const CollectedHintsDisplay = observer(() => {
  const { collectedHints, questionMode, questionCounter } = useGameStore().gamePlayViewStore;
  const { showAnswers } = useGameStore().questionViewStore;
  const [selectedHint, setSelectedHint] = useState<{
    title: string;
    xformedH: string;
  } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const theme = useTheme();

  // Reset hint display state when question changes
  useEffect(() => {
    setSelectedHint(null);
    setShowHints(false);
  }, [questionCounter]);

  const handleHintClick = useCallback((hint: typeof selectedHint) => {
    setSelectedHint(hint);
  }, []);

  const handleShowHints = useCallback(() => {
    requestAnimationFrame(() => {
      setShowHints(true);
    });
  }, []);

  const handleCloseHint = useCallback(() => {
    setSelectedHint(null);
  }, []);

  if (!questionMode || !showAnswers) {
    return null;
  }

  return (
    <>
      <Fade in={true} timeout={800}>
        <Box
          component="div"
          sx={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
            maxWidth: '80vw',
            zIndex: 1000,
          }}
        >
          {showHints ? (
            collectedHints.map((hint, index) => (
              <HintBox
                key={hint.id || index}
                onClick={() => handleHintClick(hint)}
              >
                <HelpOutlineIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body2" color="text.primary">
                  {hint.title || `Hint ${index + 1}`}
                </Typography>
              </HintBox>
            ))
          ) : (
            <AnimatedHintButton
              onClick={handleShowHints}
              startIcon={<HelpOutlineIcon />}
            >
              View Hints ({collectedHints.length})
            </AnimatedHintButton>
          )}
        </Box>
      </Fade>

      <HintScreen
        open={!!selectedHint}
        onClose={handleCloseHint}
        hint={selectedHint}
      />
    </>
  );
});
