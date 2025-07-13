import { Box, Modal, Typography, styled, alpha, useTheme, IconButton } from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import React, { useEffect } from 'react';
import { keyframes } from '@emotion/react';
import { TUTORIAL_QUESTION_DATA } from '../tutorial/tutorialConstants';
import { action, makeAutoObservable } from 'mobx';
import { LanguageSwitcher } from '../google-translate/LanguageSwitcher';
import { ReadOnlyQuestionContent } from './ReadOnlyQuestionContent';
import { QuestionModalTutorialContainer } from './QuestionModalTutorialContainer';
import { QuestionModalAnswerContainer } from './QuestionModalAnswerContainer';
import Quiz from '@mui/icons-material/Quiz';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ArrowBack from '@mui/icons-material/ArrowBack';

const ModalContent = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(90vw, 75rem)',
  maxWidth: '75rem',
  height: 'min(95vh, 100%)',
  maxHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '1.5rem',
  paddingTop: '2rem',
  paddingBottom: '2rem',
  borderRadius: 'clamp(0rem, 3vw, 1.5rem)',
  backdropFilter: 'blur(0.75rem)',
  boxShadow: '0 0.5rem 2rem 0 rgba(31, 38, 135, 0.37)',
  border: '0.0625rem solid rgba(255, 255, 255, 0.18)',
  outline: 'none',
  overflowY: 'hidden',
}));

export const QuestionModal: React.FC = observer(() => {
  const theme = useTheme();

  const {
    showAnswers,
    isReading,
    setIsReading,
    setShowTooltip,
    setShowFirstTimeHint,
    setShowSpeedBonus,
    showBonusPoints,
    setShowBonusPoints,
    shouldShowQModal,
    startBonusPointsCountdown,
    resetBonusPointsProgress,
    hasNavigatedBackFromAnswers,
    navigateBackToQuestion,
    navigateBackToAnswers,
  } = useGameStore().questionViewStore;
  const { isTutorial } = useGameStore().gamePlayViewStore;

  // Move helperData inside the component so it has access to answerColors

  // Get tutorial question data if in tutorial mode

  // Store first-time hint states in localStorage
  useEffect(() => {
    const hasSeenQuestionHint = localStorage.getItem('hasSeenQuestionHint');
    const hasSeenExpandHint = localStorage.getItem('hasSeenExpandHint');

    if (hasSeenQuestionHint) {
      setShowFirstTimeHint(false);
    }
    if (hasSeenExpandHint) {
      setShowTooltip(false);
    }
  }, [setShowFirstTimeHint, setShowTooltip]);

  // Update bonus points effect to use store methods
  useEffect(() => {
    if (showBonusPoints) {
      startBonusPointsCountdown();
    } else {
      resetBonusPointsProgress();
    }
  }, [showBonusPoints, startBonusPointsCountdown, resetBonusPointsProgress]);

  // Handle speed bonus timer
  useEffect(() => {
    let bonusTimeout: NodeJS.Timeout;
    let speedTimeout: NodeJS.Timeout;

    if (showAnswers) {
      setShowSpeedBonus(true);
      setShowBonusPoints(true);

      // Hide bonus points message after animation
      bonusTimeout = setTimeout(() => {
        setShowBonusPoints(false);
      }, 5000);

      // Hide speed bonus after time limit
      speedTimeout = setTimeout(() => {
        setShowSpeedBonus(false);
      }, 10000);
    }

    // Cleanup function that runs on unmount or when dependencies change
    return () => {
      if (bonusTimeout) clearTimeout(bonusTimeout);
      if (speedTimeout) clearTimeout(speedTimeout);
    };
  }, [showAnswers, setShowSpeedBonus, setShowBonusPoints]);

  return (
    <>
      {/* Left side navigation icons */}
      {shouldShowQModal && (
        <Box
          component="div"
          sx={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 1500,
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          {/* Single navigation button - shows appropriate arrow based on current view */}
          {(showAnswers || hasNavigatedBackFromAnswers) && (
            <IconButton
              onClick={showAnswers ? navigateBackToQuestion : navigateBackToAnswers}
              size="large"
              title={showAnswers ? "View Question" : "Back to Answers"}
              sx={{
                color: 'grey',
                backdropFilter: 'blur(5px)',
                padding: '12px',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.5),
                },
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {showAnswers ? (
                  <>
                    <ArrowBack sx={{ fontSize: '1.2rem' }} />
                    <Quiz sx={{ fontSize: '1.5rem' }} />
                  </>
                ) : (
                  <>
                    <Quiz sx={{ fontSize: '1.5rem' }} />
                    <ArrowForward sx={{ fontSize: '1.2rem' }} />
                  </>
                )}
              </div>
            </IconButton>
          )}
        </Box>
      )}
      
      {/* Right side translate icon */}
      {shouldShowQModal && (
        <Box
          component="div"
          sx={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 1500,
          }}
        >
          <LanguageSwitcher />
        </Box>
      )}
      
      <Modal
        className="question-modal"
        open={shouldShowQModal}
        onClose={() =>
          isReading && !showAnswers ? void 0 : setIsReading(false)
        }
        disableEscapeKeyDown
        disableAutoFocus
        disableEnforceFocus
        sx={{
          backdropFilter: 'blur(0.5rem)',
          backgroundColor: alpha(theme.palette.background.default, 0.5),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        {
          <ModalContent>
            {isReading && <ReadOnlyQuestionContent />}
            {isTutorial && <QuestionModalTutorialContainer />}
            {!isReading && !isTutorial && <QuestionModalAnswerContainer />}
          </ModalContent>
        }
      </Modal>
    </>
  );
});
