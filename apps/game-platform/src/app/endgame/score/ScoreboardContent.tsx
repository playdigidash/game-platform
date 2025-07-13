import {
  Box,
  Button,
  Typography,
  IconButton,
  Badge,
  styled,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import RedeemIcon from '@mui/icons-material/Redeem';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { keyframes } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { Canvas } from '@react-three/fiber';
import { HeroModel, AVA_ANIM } from '../../FiberComponents/HeroModel';
import moment from 'moment';
import { GenerateBtnGrp } from './GenerateBtnGrp';
import { ManualNameBtnGrp } from './ManualNameBtnGrp';
import { pulse } from '../../Common';
import { CurrentEndGameStep } from '../../Common';
import { StyledProgress } from '../../playerprofile/PlayerProfile';
import VerifiedIcon from '@mui/icons-material/Verified';
import ReplayIcon from '@mui/icons-material/Replay';
import ExplosionConfetti from '../../FiberComponents/Helper/ExplosionConfetti';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { ColorLabels, IActions } from '@lidvizion/commonlib';
import { ActionModal } from '../actions/ActionModal';
import { CircularProgress } from '@mui/material';

interface ScoreboardContentProps {
  onNextStep: () => void;
}

const certAppear = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(360deg);
    opacity: 0.7;
  }
  100% {
    transform: scale(1) rotate(720deg);
    opacity: 1;
  }
`;

// Define styles more explicitly with type assertions
const errorBoxSx = {
  p: 2,
  textAlign: 'center' as const,
};

// Extract styles to constants
const rootBoxSx = { p: 2, textAlign: 'center' as const };

// Extract input props to a constant
const codeInputProps = {
  style: {
    textAlign: 'center' as const,
    fontSize: '1.5rem',
    letterSpacing: '0.2em',
    fontWeight: 'bold',
  },
};

// Extract button container style
const buttonContainerStyle = {
  display: 'flex' as const,
  justifyContent: 'center' as const,
  gap: 2,
};

// With this:
const CenteredBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 200,
});

const CenteredContentBox: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <CenteredBox>{children}</CenteredBox>;

export const ScoreboardContent: React.FC<ScoreboardContentProps> = observer(
  () => {
    const {
      score,
      sessionTime,
      showManualBtnGrp,
      showGenerateBtnGrp,
      showLeaderboardBtn,
      scoreTimeDisplay,
      setScoreTimeDisplay,
    } = useGameStore().scoreViewStore;
    const {
      setCurrentStep,
      totalQuestPart,
      animatedProgress,
      handleNextGameClick,
      endTime,
    } = useGameStore().endGameViewStore;
    const { selectedHero } = useGameStore().gamePlayViewStore;
    const { herosData, loadHeroModel, settings, gameSession } =
      useGameStore().gameViewStore;
    const { coinCnt } = useGameStore().collectableViewStore;
    const theme = useTheme();
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [currentActionId, setCurrentActionId] = useState<string | null>(null);
    const [heroGLTF, setHeroGLTF] = useState<any>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const { targetProgress, setAnimatedProgress } =
      useGameStore().endGameViewStore;
    const leaderboardViewStore = useGameStore().leaderboardViewStore;
    const { translatedGameData } = useGameStore().translateViewStore;
    const { currentModule } = useGameStore().moduleViewStore;
    const [isActionLoading, setIsActionLoading] = useState(false);
    const { actionViewStore } = useGameStore();
    const [heroModelLoaded, setHeroModelLoaded] = useState(false);

    const dashCompleteLabel =
      translatedGameData?.dashCompleteLabel || 'Dash Complete!';
    const partLabel = translatedGameData?.partLabel || 'Part';
    const completedLabel = translatedGameData?.completedLabel || 'Complete';
    const questLabel = translatedGameData?.questLabel || 'Quest';
    const scoreLabel = translatedGameData?.scoreLabel || 'Score';
    const collectedLabel = translatedGameData?.collectedLabel || 'Collected';
    const minutesLabel = translatedGameData?.minutesLabel || 'Minutes';
    const rankLabel = translatedGameData?.rankLabel || 'Rank';
    const addPrizeCodeLabel =
      translatedGameData?.addPrizeCodeLabel || 'Get Prize';

    // Load hero model once
    useEffect(() => {
      if (herosData && herosData.length > 0 && selectedHero >= 0) {
        const heroData = herosData[selectedHero];
        if (heroData && !heroModelLoaded) {
          (async () => {
            try {
              const model = await loadHeroModel(heroData, selectedHero);
              if (model) {
                setHeroGLTF(model);
                setHeroModelLoaded(true);
              }
            } catch (error) {
              // Hero model loading failed
            }
          })();
        }
      }
    }, [herosData, selectedHero, heroModelLoaded, loadHeroModel]);

    useEffect(() => {
      const diff = endTime - sessionTime;

      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setScoreTimeDisplay(
        `${minutes.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}:${seconds.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}`
      );
    }, [endTime, sessionTime, setScoreTimeDisplay]);

    // Initializing the progress animation once with useEffect
    useEffect(() => {
      if (typeof targetProgress !== 'number') {
        return;
      }

      // Start from a small initial progress to show immediate feedback
      const initialProgress = Math.min(5, targetProgress);
      setAnimatedProgress(initialProgress);

      // Configure animation
      const duration = 1000; // Shorter duration for better UX
      const interval = 16; // 60fps
      const steps = duration / interval;
      const increment = (targetProgress - initialProgress) / steps;
      let currentProgress = initialProgress;
      let animationFrame: number;

      const animate = () => {
        if (currentProgress < targetProgress) {
          currentProgress = Math.min(
            currentProgress + increment,
            targetProgress
          );

          setAnimatedProgress(currentProgress);
          animationFrame = requestAnimationFrame(animate);
        }
      };

      // Start animation immediately
      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, [targetProgress, setAnimatedProgress]);

    // Confetti effect on completion - runs for 5 seconds
    useEffect(() => {
      if (gameSession.questPart === totalQuestPart.parts) {
        const startTimer = setTimeout(() => {
          setShowConfetti(true);
        }, 500);

        const stopTimer = setTimeout(() => {
          setShowConfetti(false);
        }, 5500); // 5 seconds after start (including initial 500ms delay)

        return () => {
          clearTimeout(startTimer);
          clearTimeout(stopTimer);
        };
      }
      return undefined;
    }, [gameSession.questPart, totalQuestPart.parts]);

    // Memoized scoreData
    const scoreData = useMemo(() => {
      return [
        {
          icon: <EmojiEventsRoundedIcon sx={{ color: 'lightseagreen' }} />,
          value: score.toFixed(0),
          label: scoreLabel,
          color: 'lightseagreen',
        },
        {
          icon: <SavingsRoundedIcon sx={{ color: 'orange' }} />,
          value: coinCnt,
          color: 'orange',
          label: collectedLabel,
        },
        {
          icon: <TimerIcon sx={{ color: 'mediumorchid' }} />,
          value: scoreTimeDisplay,
          color: 'mediumorchid',
          label: minutesLabel,
        },
      ];
    }, [score, coinCnt, scoreTimeDisplay]);

    // Progress bar change handler
    const handleProgressChange = useCallback(
      (e: React.ChangeEvent<HTMLProgressElement>) => {
        // Progress bar updated silently
      },
      [animatedProgress, targetProgress]
    );

    // Memoize the Canvas component to prevent unnecessary re-renders
    const heroCanvasElement = useMemo(() => {
      if (!heroGLTF?.animations || !heroGLTF?.scene) {
        return null;
      }

      return (
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          frameloop="always"
          style={{
            willChange: 'transform',
            opacity: heroGLTF ? 1 : 0,
            transition: 'opacity 0.3s ease-in',
          }}
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
          }}
          key={`hero-canvas-${selectedHero}`}
        >
          <ambientLight intensity={1.5} />
          <group position={[0, -1.5, 0]} rotation={[0, 0, 0]}>
            <HeroModel
              key={`hero-model-${selectedHero}`}
              maxSize={2.2}
              selectedIndex={true}
              faceCamera={true}
              playAnim={{ name: AVA_ANIM.SELECTED, counter: 0 }}
              animations={heroGLTF.animations}
              heroScene={heroGLTF.scene}
            />
          </group>
        </Canvas>
      );
    }, [heroGLTF, selectedHero]);

    // Get the actionId from the module (ensure it's a string)
    const moduleActionId =
      typeof currentModule?.actionId === 'string'
        ? currentModule.actionId
        : null;

    // Check if action is completed
    const isActionCompleted = useMemo(() => {
      return gameSession?.actions?.some(
        (action: { actionId: string; completed: boolean }) =>
          action.actionId === moduleActionId && action.completed
      );
    }, [gameSession, moduleActionId]);

    const handleOpenPrizeCodeAction = async () => {
      if (
        typeof moduleActionId === 'string' &&
        !isActionCompleted &&
        !isActionLoading
      ) {
        try {
          setIsActionLoading(true);
          actionViewStore.setActionId(moduleActionId);
          await actionViewStore.fetchAction();

          if (actionViewStore.currentAction) {
            setCurrentActionId(moduleActionId);
            setIsActionModalOpen(true);
          }
        } catch (error) {
          console.error('Error loading action:', error);
        } finally {
          setIsActionLoading(false);
        }
      }
    };

    return (
      <Box
        component="div"
        sx={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '2rem',
          position: 'relative',
        }}
      >
        {showConfetti && (
          <Canvas
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <ExplosionConfetti radius={20} />
          </Canvas>
        )}
        <Typography
          variant="h5"
          px="1rem"
          sx={{
            color: theme.palette.text.primary,
            textAlign: 'center',
          }}
        >
          {dashCompleteLabel}
        </Typography>
        <Box
          component={'div'}
          display={'flex'}
          flexDirection={'column'}
          gap={'1.5em'}
          marginTop={'2em'}
        >
          <StyledProgress
            value={animatedProgress}
            max={100}
            style={{
              color: theme.palette.primary.main,
              width: '100%',
            }}
            onChange={handleProgressChange}
          />
          <Box
            component={'div'}
            alignItems={'center'}
            display={'flex'}
            gap={'1.5em'}
          >
            <Badge
              badgeContent={
                gameSession.questPart === totalQuestPart.parts && (
                  <VerifiedIcon
                    sx={{
                      color: 'green',
                      fontSize: 40,
                      animation: `${certAppear} 1s ease-out forwards`,
                    }}
                  />
                )
              }
            >
              <Typography
                variant="h5"
                px="1rem"
                sx={{
                  color: theme.palette.text.primary,
                  textAlign: 'center',
                }}
              >
                {partLabel} {gameSession.questPart}/{totalQuestPart.parts}{' '}
                {completedLabel}
              </Typography>
            </Badge>
          </Box>
        </Box>
        <Box
          component="div"
          sx={{
            width: '100%',
            height: '45vh',
            position: 'relative',
          }}
        >
          {heroCanvasElement}
        </Box>

        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            width: '100%',
          }}
        >
          {scoreData.map((item, index) => (
            <Box
              key={index}
              component="div"
              sx={{
                textAlign: 'center',
                flex: '1',
                width: '100%',
                maxWidth: '150px',
                p: '0.15rem',
                pt: '0.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 0.2rem 0.4rem rgba(0,0,0,0.1)',
                backgroundColor: item.color,
              }}
            >
              <Typography
                fontSize="0.675rem"
                sx={{
                  color: theme.palette.text.primary,
                  pb: '0.5rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Typography>
              <Box
                key={index}
                component="div"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  p: '0.5rem',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {item.icon}
                <Typography
                  variant="h6"
                  fontSize="1.25rem"
                  fontWeight="bold"
                  sx={{ color: theme.palette.text.primary }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            paddingBottom: '1rem',
            width: '100%',
          }}
        >
          {showLeaderboardBtn && (
            <Box
              component={'div'}
              display={'flex'}
              width={'100%'}
              justifyContent={'center'}
              gap={'1.5em'}
            >
              {gameSession.questPart < totalQuestPart.parts ? (
                <Button
                  variant="outlined"
                  startIcon={
                    <KeyboardDoubleArrowRightIcon
                      sx={{ color: ColorLabels.gold }}
                    />
                  }
                  onClick={handleNextGameClick}
                >{`PT ${gameSession.questPart + 1}`}</Button>
              ) : (
                <Button
                  startIcon={<ReplayIcon sx={{ color: ColorLabels.gold }} />}
                  onClick={handleNextGameClick}
                >
                  {questLabel}
                </Button>
              )}
              <Button
                startIcon={<LeaderboardIcon />}
                variant="contained"
                color="primary"
                onClick={() => {
                  setCurrentStep(CurrentEndGameStep.leaderboard);
                  leaderboardViewStore.handlePartChange(gameSession.questPart);
                }}
                sx={{
                  animation: `${pulse(theme)} 1s infinite`,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    opacity: 0.9,
                  },
                }}
              >
                {rankLabel}
              </Button>
            </Box>
          )}
          {showGenerateBtnGrp && <GenerateBtnGrp />}
          {showManualBtnGrp && <ManualNameBtnGrp />}
        </Box>
        {moduleActionId && (
          <Box
            component="div"
            onClick={
              isActionCompleted || isActionLoading
                ? undefined
                : handleOpenPrizeCodeAction
            }
            sx={{
              textAlign: 'center',
              width: '100%',
              maxWidth: '300px',
              margin: '1rem auto 0',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              backgroundColor: isActionCompleted
                ? theme.palette.success.main
                : theme.palette.primary.main,
              cursor:
                isActionCompleted || isActionLoading ? 'default' : 'pointer',
              justifyContent: 'center',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              opacity: isActionCompleted ? 0.9 : 1,
              '&:hover':
                !isActionCompleted && !isActionLoading
                  ? {
                      transform: 'scale(1.02)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }
                  : {},
            }}
          >
            {isActionCompleted ? (
              <CheckCircleIcon
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: '1.75rem',
                  marginBottom: '0.25rem',
                }}
              />
            ) : isActionLoading ? (
              <CircularProgress
                size={24}
                sx={{ color: theme.palette.text.primary }}
              />
            ) : (
              <RedeemIcon
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: '1.75rem',
                  marginBottom: '0.25rem',
                }}
              />
            )}
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {isActionCompleted
                ? 'Reward Claimed'
                : isActionLoading
                ? 'Loading...'
                : addPrizeCodeLabel}
            </Typography>
          </Box>
        )}

        {currentActionId && (
          <ActionModal
            open={isActionModalOpen}
            onClose={() => setIsActionModalOpen(false)}
            actionId={currentActionId}
          />
        )}
      </Box>
    );
  }
);

export default ScoreboardContent;
