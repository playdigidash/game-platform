import React, { Suspense, useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tab,
  Tabs,
  alpha,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { observer } from 'mobx-react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { styled } from '@mui/system'; // For custom styling
import { useTheme } from '@mui/material/styles';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoadingOverlay from 'react-loading-overlay-ts';

// Import Canvas, useFrame, useGLTF for 3D rendering
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Trophy } from './trophy/Trophy';
import { pulse } from '../../Common';
import { nameGenerator } from '@lidvizion/commonlib';
import {
  Toll,
  Quiz,
  LockOutlined,
  EmojiEventsOutlined,
  HelpOutline,
} from '@mui/icons-material';
import { LeaderboardProfileList } from './LeaderboardProfileList';

interface LeaderboardContentProps {
  onBack: () => void;
  onNextStep: () => void;
}

// // Styled components for the tabs (as a segmented control)
// const SegmentedControl = styled('div')({
//   display: 'flex',
//   borderRadius: '1rem',
//   backgroundColor: 'rgba(224, 224, 224, 0.75)',
//   position: 'relative',
//   width: 'clamp(10rem, 50vw, 15rem)', // Responsive width
//   height: '1rem',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: '1rem',
//   margin: '0 auto',
// });

// const Segment = styled('div')<{ selected: boolean }>(() => ({
//   flex: 1,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   fontSize: '1rem',
//   fontWeight: 600,
//   cursor: 'pointer',
//   color: 'white',
//   transition: 'color 0.3s',
//   fontColor: 'white',
//   zIndex: 1,
// }));

// const Slider = styled('div')<{ tabIndex: number; totalSegments: number }>(
//   ({ tabIndex, totalSegments }) => ({
//     position: 'absolute',
//     borderRadius: '1rem',
//     height: '100%',
//     width: `${100 / totalSegments}%`,
//     left: `${(tabIndex * 100) / totalSegments}%`,
//     transition: 'left 0.3s',
//     fontColor: 'white',
//     zIndex: 0,
//   })
// );

// const SegmentedControlContainer = styled(Box)(({ theme }) => ({
//   flex: 1,
//   display: 'flex',
//   justifyContent: 'center', // Center the segmented control
//   maxWidth: 'calc(100% - 48px)', // Account for the back button
// }));

// New styled component for part bubbles with reduced margins
const PartBubble = styled(Box)<{
  completed: boolean;
  selected: boolean;
  disabled: boolean;
}>(({ theme, completed, selected, disabled }) => ({
  width: '2.2rem',
  height: '2.2rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: completed
    ? theme.palette['primary'].main
    : 'rgba(224, 224, 224, 0.75)',
  color: 'white', // Always keep numbers white for visibility
  position: 'relative',
  margin: '0 0.3rem', // Reduced spacing between bubbles
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.6 : 1,
  transition: 'all 0.3s ease',
  border:
    selected && !completed
      ? `0.125rem solid ${theme.palette['primary'].main}`
      : 'none',
  boxShadow: selected
    ? `0 0 0.5rem ${theme.palette['primary'].main}`
    : completed && !selected
    ? 'none'
    : 'none',
  fontWeight: selected ? 'bold' : 'normal',
  '&::after': selected
    ? {
        content: '""',
        position: 'absolute',
        bottom: '-0.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height: '0.15rem',
        backgroundColor: theme.palette['primary'].main,
        borderRadius: '0.1rem',
      }
    : {},
}));

const QuestBubble = styled(Box)<{
  unlocked: boolean;
  selected: boolean;
}>(({ theme, unlocked, selected }) => ({
  width: '3rem',
  height: '3rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: unlocked
    ? theme.palette['primary'].main
    : 'rgba(128, 128, 128, 0.5)',
  color: 'white', // Always white for visibility
  position: 'relative',
  margin: '0 0.3rem', // Reduced spacing between bubbles
  cursor: unlocked ? 'pointer' : 'not-allowed',
  opacity: unlocked ? 1 : 0.6,
  transition: 'all 0.3s ease',
  border:
    selected && unlocked
      ? `0.125rem solid ${theme.palette['primary'].main}`
      : 'none',
  boxShadow: selected ? `0 0 0.5rem ${theme.palette['primary'].main}` : 'none',
  '&::after': selected
    ? {
        content: '""',
        position: 'absolute',
        bottom: '-0.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height: '0.15rem',
        backgroundColor: theme.palette['primary'].main,
        borderRadius: '0.1rem',
      }
    : {},
}));

function TrophyCanvas({
  modelPath,
  scale,
}: {
  modelPath: string;
  scale: number[];
}) {
  return (
    <Canvas
      style={{ width: '8rem', height: '8rem', padding: 0 }}
      camera={{ position: [0, 0, 5] }}
    >
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={1.5} // Higher intensity for spotlight
        angle={0.3}
        penumbra={1}
        position={[0, 5, 5]}
        castShadow
      />
      <directionalLight intensity={2} position={[-2, -2, 5]} />
      <Suspense fallback={null}>
        <Trophy modelPath={modelPath} scale={scale} />
      </Suspense>
    </Canvas>
  );
}

export const LeaderboardContent: React.FC<LeaderboardContentProps> = observer(
  ({ onBack, onNextStep }) => {
    const { gameSession } = useGameStore().gameViewStore;
    const { currUser } = useGameStore().gameLoginViewStore;
    const { totalQuestPart, selectedLeaderboardPart } =
      useGameStore().endGameViewStore;
    const { handlePartChg, currentUserRank } = useGameStore().scoreViewStore;
    const {
      // fetchTop3Profiles,
      allTimeProfiles,
      topProfiles,
      completedParts,
      allPartsCompleted,
      shouldShowTrophies,
      selectedPart,
      // profiles,
      isProfilesLoading,

      handlePartChange,
    } = useGameStore().leaderboardViewStore;
    const theme = useTheme();
    const { translatedGameData } = useGameStore().translateViewStore;

    const leaderboardLabel =
      translatedGameData?.leaderboardLabel || 'Leaderboard';
    const leaderboardDescriptionLabel =
      translatedGameData?.leaderboardDescriptionLabel ||
      'The leaderboard lists your highest score!';
    const triviaCheckLabel =
      translatedGameData?.triviaCheckLabel || 'Trivia Check';
    const playFriendsLabel =
      translatedGameData?.playFriendsLabel || 'Play Friends!';

    // Helper function to check if a part is completed
    const isPartCompleted = (partIndex: number): boolean => {
      return completedParts[partIndex];
    };

    // Initialize leaderboard when component mounts
    useEffect(() => {
      // Set part to current part when component mounts
      // Defer to make sure we have the latest store state
      setTimeout(() => {
        // Prioritize currentQuestPart, fallback to part 1 if not available
        const initialPart = gameSession.questPart || 1;
        handlePartChg(initialPart); // Use handlePartChg directly from scoreViewStore

        // Fetch top 3 profiles directly when component mounts
        // fetchTop3Profiles();
      }, 100);
    }, []);

    // Get tooltips for parts and quest
    const getPartTooltip = (idx: number) => {
      if (!isPartCompleted(idx)) {
        return 'Complete this part to view its leaderboard';
      }
      return '';
    };

    const getQuestTooltip = () => {
      if (!allPartsCompleted) {
        return 'Complete all parts to unlock the quest leaderboard';
      }
      return '';
    };

    // Check if current user exists in profiles
    const currentUserExists =
      currUser?.uid && allTimeProfiles.some((p) => p.uid === currUser.uid);

    return (
      <Box
        component="div"
        sx={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          padding: '1rem',
        }}
      >
        {/* Header row with back button and part label */}
        <Box
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            marginBottom: '0.75rem',
          }}
        >
          <IconButton
            onClick={onBack}
            sx={{
              marginRight: '0.5rem',
              padding: '0.5rem',
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '0.5rem',
            }}
          >
            <Typography sx={{ marginRight: '0.5rem' }}>
              {leaderboardLabel}
            </Typography>
            <Tooltip title={leaderboardDescriptionLabel} arrow placement="top">
              <HelpOutline
                sx={{
                  fontSize: '1rem',
                  color: theme.palette['text'].secondary,
                }}
              />
            </Tooltip>
          </Box>
        </Box>

        {/* Part bubbles row */}
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.25rem',
            marginBottom: '1rem',
          }}
        >
          {Array.from({ length: totalQuestPart.parts }, (_, idx) => {
            const isSelected = selectedLeaderboardPart === idx + 1;
            const isCompleted = isPartCompleted(idx);

            return (
              <Tooltip
                key={`part-${idx}`}
                title={getPartTooltip(idx)}
                arrow
                placement="top"
                disableHoverListener={isCompleted}
              >
                <span>
                  <PartBubble
                    completed={isCompleted}
                    selected={isSelected}
                    disabled={!isCompleted}
                    onClick={() => {
                      if (isCompleted) {
                        handlePartChange(idx + 1);
                      }
                    }}
                  >
                    {idx + 1}
                    {isCompleted ? (
                      <CheckCircleIcon
                        sx={{
                          position: 'absolute',
                          fontSize: '0.8rem',
                          bottom: '0.125rem',
                          right: '0.125rem',
                          color: 'white',
                        }}
                      />
                    ) : (
                      <LockOutlined
                        sx={{
                          position: 'absolute',
                          fontSize: '0.8rem',
                          bottom: '0.125rem',
                          right: '0.125rem',
                          color: 'white',
                        }}
                      />
                    )}
                  </PartBubble>
                </span>
              </Tooltip>
            );
          })}

          {/* Quest bubble */}
          <Tooltip
            title={getQuestTooltip()}
            arrow
            placement="top"
            disableHoverListener={allPartsCompleted}
          >
            <span>
              <QuestBubble
                unlocked={allPartsCompleted}
                selected={selectedLeaderboardPart === -1}
                onClick={() => {
                  if (allPartsCompleted) {
                    handlePartChange(-1);
                  }
                }}
              >
                <EmojiEventsOutlined sx={{ fontSize: '1.2rem' }} />
                {!allPartsCompleted && (
                  <LockOutlined
                    sx={{
                      position: 'absolute',
                      fontSize: '0.8rem',
                      bottom: '0.125rem',
                      right: '0.125rem',
                      color: 'white',
                    }}
                  />
                )}
              </QuestBubble>
            </span>
          </Tooltip>
        </Box>

        {/* Trophies section - only show for quest leaderboard */}
        {shouldShowTrophies && (
          <Box
            component="div"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(3.125rem, 1fr))',
              justifyItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              maxWidth: '100%',
              padding: '0.75rem',
            }}
          >
            {[
              {
                modelPath: '/assets/models/First_place_gold.glb',
                scale: [2.6, 2.6, 2.6],
                trophyName: 'Gold Trophy',
              },
              {
                modelPath: '/assets/models/Second_place_silver.glb',
                scale: [2, 2, 2],
                trophyName: 'Silver Trophy',
              },
              {
                modelPath: '/assets/models/third_place_bronze.glb',
                scale: [1.6, 1.6, 1.6],
                trophyName: 'Bronze Trophy',
              },
            ].map((trophy, index) => (
              <Box
                key={trophy.trophyName}
                component="div"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <TrophyCanvas
                  modelPath={trophy.modelPath}
                  scale={trophy.scale}
                />

                {topProfiles[index] && (
                  <Box component="div" sx={{ marginTop: '1rem' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '1rem',
                        color: theme.palette['text'].primary,
                        maxWidth: '30vw',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      {topProfiles[index].displayName ||
                        `${String(topProfiles[index].uid).substring(0, 6)}`}
                      {topProfiles[index].uid === currUser?.uid}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: theme.palette['text'].primary,
                      }}
                    >
                      {Math.round(
                        selectedLeaderboardPart > -1
                          ? topProfiles[index].parts?.find(
                              (pt) => pt.part === selectedLeaderboardPart
                            )?.score || 0
                          : topProfiles[index].score || 0
                      )}{' '}
                      pts
                    </Typography>
                  </Box>
                )}
                {!topProfiles[index] && (
                  <Box component="div" sx={{ marginTop: '1rem' }}>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: theme.palette['text'].secondary,
                        fontStyle: 'italic',
                      }}
                    >
                      No player yet
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Leaderboard Section */}
        <Box
          component="div"
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: '15vh',
            maxHeight: 'calc(100vh - 20rem)',
            marginBottom: '0.5rem',
          }}
        >
          {/* Current rank or status message
          {leaderboardUserRank !== null && leaderboardUserRank > 0 ? (
            <Typography
              sx={{
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: theme.palette['text'].primary,
              }}
            >
              {`Current Rank: ${leaderboardUserRank}`}
            </Typography>
          ) : currUser?.uid ? (
            <Typography
              sx={{
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontStyle: 'italic',
                color: theme.palette['text'].secondary,
              }}
            >
              Complete this part to get a rank!
            </Typography>
          ) : null} */}

          {/* Instructions if no profile */}
          {!allTimeProfiles.some((p) => p.uid === currUser?.uid) &&
            !isProfilesLoading && (
              <Typography
                sx={{
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  color: theme.palette['text'].secondary,
                }}
              >
                Complete this part to appear on the leaderboard!
              </Typography>
            )}

          {/* Profile list with loading state */}
          <LoadingOverlay
            active={isProfilesLoading}
            spinner
            className="learn-panel-overlay"
          >
            <LeaderboardProfileList
              selectedLeaderboardPart={selectedLeaderboardPart}
            />
          </LoadingOverlay>
        </Box>

        {/* Button Container */}
        <Box
          component="div"
          sx={{
            display: 'flex',
            gap: '1rem',
            width: '100%',
            justifyContent: 'center',
            marginTop: 'auto',
            padding: {
              xs: '0 0.5rem',
              sm: '0 1rem',
            },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={onNextStep}
            startIcon={
              <Quiz sx={{ fontSize: { xs: '1.4rem', sm: '1.75rem' } }} />
            }
            sx={{
              flex: 1,
              padding: { xs: '0.75rem', sm: '1rem' },
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              minHeight: '3.5rem',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                opacity: 0.9,
              },
            }}
          >
            {triviaCheckLabel}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              if (navigator.share) {
                // Find the current user's profile and score
                const userProfile = currUser?.uid
                  ? allTimeProfiles.find((p) => p.uid === currUser.uid)
                  : null;
                const userScore = userProfile?.score || 0;

                navigator
                  .share({
                    title: `${
                      currentUserRank
                        ? `I just ranked #${currentUserRank}`
                        : 'I just played'
                    } with ${userScore} points! Can you beat my score?`,
                    url: gameSession?.gameUrl,
                  })
                  .then(() => {
                    // Thanks for sharing!
                  })
                  .catch((error) => {
                    // Error handling without console.log
                  });
              }
            }}
            startIcon={
              <ShareIcon
                sx={{
                  fontSize: { xs: '1.4rem', sm: '1.75rem' },
                  color: theme.palette['text'].primary,
                }}
              />
            }
            sx={{
              flex: 1,
              padding: { xs: '0.75rem', sm: '1rem' },
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              color: theme.palette['text'].primary,
              minHeight: '3.5rem',
            }}
          >
            {playFriendsLabel}
          </Button>
        </Box>
      </Box>
    );
  }
);
