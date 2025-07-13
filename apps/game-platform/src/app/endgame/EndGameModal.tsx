import React, { useEffect } from 'react';
import { Modal, Box } from '@mui/material';
import { observer } from 'mobx-react'; // Import observer from mobx-react
import ScoreboardContent from './score/ScoreboardContent';
import { LeaderboardContent } from './leaderboard/LeaderboardContent';
import ReviewQ from './review/ReviewQ';
// import SignUpContent from './SignUpContent';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { defaultModalStyle } from '@lidvizion/commonlib';
import { CurrentEndGameStep } from '../Common';
import { LanguageSwitcher } from '../google-translate/LanguageSwitcher';

const EndGameModal: React.FC = observer(() => {
  const { currentStep, setCurrentStep, setWantsToTrackProgress } =
    useGameStore().endGameViewStore;
  useEffect(() => {
    return () => {
      setWantsToTrackProgress(false);
    };
  }, []);

  return (
    <Modal
      className="end-game-modal"
      open={true}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="div"
        sx={{
          ...defaultModalStyle,
          position: 'relative',
          width: '100%',
          height: '100%',
          maxHeight: '100vh',
          maxWidth: '100vw',
          margin: 0,
          padding: '1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '0.5em',
          backdropFilter: 'blur(10px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
          },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <>
          {/* Language Switcher for translation - Added to top right */}
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

          {currentStep === CurrentEndGameStep.scoreboard && (
            <ScoreboardContent
              onNextStep={() => {
                setCurrentStep(CurrentEndGameStep.leaderboard);
              }}
            />
          )}
          {currentStep === CurrentEndGameStep.leaderboard && (
            <LeaderboardContent
              onBack={() => {
                setCurrentStep(CurrentEndGameStep.scoreboard);
              }}
              onNextStep={() => {
                setCurrentStep(CurrentEndGameStep.review);
              }}
            />
          )}
          {currentStep === CurrentEndGameStep.review && (
            <ReviewQ
              onBack={() => {
                setCurrentStep(CurrentEndGameStep.leaderboard);
              }}
            />
          )}
        </>
      </Box>
    </Modal>
  );
});

export default EndGameModal;
