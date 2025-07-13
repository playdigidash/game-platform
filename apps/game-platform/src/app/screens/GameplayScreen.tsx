import { observer } from 'mobx-react';
import { InfoDisplay } from '../infoDisplay/InfoDisplay';
import AchievementPopup from '../modals/AchievementPopup';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { CollectedHintsDisplay } from '../modals/CollectedHintsDisplay';
// import { LaneSelectModal } from '../modals/LaneSelectModal';
import { TutorialIntroModal } from '../tutorial/TutorialIntroModal';
import PauseButton from '../pause/PauseButton';
import { PauseScreenModal } from '../pause/PauseScreenModal';
import VolumeControl from '../volume/VolumeControl';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Fade } from '@mui/material';
import { SkipButton } from '../tutorial/skipButton';
import { FunFactModal } from '../modals/FunFactModal';
import { AvaSelectModal } from '../movement/avaselect/AvaSelectModal';
import { BackButton } from '../ui/BackButton';
import { LeaderboardDropdown } from '../ui/LeaderboardDropdown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { IconButton, ClickAwayListener } from '@mui/material';
import { useState } from 'react';

export const GameplayScreen: React.FC = observer(() => {
  const {
    selectedHero,
    gotAchievement,
    laneSelected,
    showScoreBoard,
    collectedHints,
    showTutorialIntro,
    showLaneSelect,
    questionMode,
    isTutorial,
  } = useGameStore().gamePlayViewStore;
  const { isMasterAudioEnabled, isMusicChecked, isSoundEffectsChecked } =
    useGameStore().settingsViewStore;
  const { showPauseModal, isPaused } = useGameStore().pauseMenuViewStore;
  const { gameSession, herosData } = useGameStore().gameViewStore;
  const navigate = useNavigate();
  const location = useLocation();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <>
      {collectedHints && <CollectedHintsDisplay />}
      {gotAchievement && <AchievementPopup data={gotAchievement} />}
      {isTutorial && selectedHero !== -1 && <SkipButton size="small" />}
      <FunFactModal />

      {selectedHero !== -1 ? (
        <>
          {showPauseModal && <PauseScreenModal />}

          {/* Game UI Container */}
          {!isPaused && !questionMode && (
            <Box
              component="div"
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                zIndex: 1000,
                pointerEvents: 'none', // Allow clicking through the container
              }}
            >
              {/* Score/Info Display */}
              <Fade in={!showScoreBoard}>
                <Box
                  component="div"
                  sx={{
                    pointerEvents: 'auto', // Re-enable pointer events for the info display
                    marginTop: '1rem',
                  }}
                >
                  <InfoDisplay />
                </Box>
              </Fade>

              {/* Controls */}
              <Fade in={true}>
                <Box
                  component="div"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    pointerEvents: 'auto', // Re-enable pointer events for the controls
                    background: 'rgba(0, 0, 50, 0.3)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    backdropFilter: 'blur(0.3125rem)',
                    boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
                    color: 'white',
                  }}
                >
                  <PauseButton />
                  <VolumeControl />
                </Box>
              </Fade>
            </Box>
          )}

          {showTutorialIntro && <TutorialIntroModal />}
          {/* {showLaneSelect && !laneSelected && <LaneSelectModal />} */}
        </>
      ) : (
        <>
          {herosData.length > 0 && <AvaSelectModal />}
          
          {/* Back Button - positioned same as leaderboard banner */}
          <Box
            component="div"
            sx={{
              position: 'fixed',
              top: '1rem',
              left: '1rem',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0, 0, 50, 0.3)',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              backdropFilter: 'blur(0.3125rem)',
              boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
              color: 'white',
            }}
          >
            <BackButton />
          </Box>

          {/* Controls for Avatar Selection page */}
          <ClickAwayListener onClickAway={() => setShowLeaderboard(false)}>
            <Box
              component="div"
              sx={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(0, 0, 50, 0.3)',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                backdropFilter: 'blur(0.3125rem)',
                boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
                color: 'white',
              }}
            >
              <IconButton
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                size="small"
                title="Toggle Leaderboard"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '2px',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <EmojiEventsIcon sx={{ fontSize: '2rem' }} />
              </IconButton>
              <VolumeControl />
              
              {/* Leaderboard Dropdown */}
              <LeaderboardDropdown 
                module={gameSession?.gameId + ''} 
                isOpen={showLeaderboard} 
              />
            </Box>
          </ClickAwayListener>
        </>
      )}
    </>
  );
});
