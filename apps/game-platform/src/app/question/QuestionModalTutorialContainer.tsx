import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { pulseAnimation, tapAnimation } from '../animations/AnimationViewStore';
import { alpha, Box } from '@mui/material';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { ReadingProgressBar } from './ReadOnlyQuestionContent';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import TouchAppIcon from '@mui/icons-material/TouchApp';

interface StyledProps {
  $isTutorial?: boolean;
  $showExpandIcon?: boolean;
}

const ExpandIcon = styled(OpenInFullIcon)<StyledProps>(
  ({ theme, $isTutorial, $showExpandIcon }) => ({
    position: 'absolute',
    right: '0.75rem',
    top: '0.75rem',
    transform: 'none',
    width: '1.25rem',
    height: '1.25rem',
    color: alpha(theme['palette'].primary.main, 0.8),
    opacity: 0.7,
    transition: 'opacity 0.3s ease',
    display: $isTutorial && $showExpandIcon ? 'block' : 'none',
  })
);

const FirstTimeIcon = styled(TouchAppIcon)(({ theme }) => ({
  position: 'absolute',
  right: '0.875rem',
  top: '2.5rem',
  transform: 'none',
  width: 'clamp(1.25rem, 3vw, 1.5rem)',
  height: 'clamp(1.25rem, 3vw, 1.5rem)',
  color: alpha(theme['palette'].primary.main, 0.6),
  opacity: 0.8,
  animation: `${tapAnimation} 1.5s infinite ease-in-out`,
  pointerEvents: 'auto',
  cursor: 'pointer',
  zIndex: 2,
}));

const TapIcon = styled(TouchAppIcon)(({ theme }) => ({
  position: 'absolute',
  right: '2.5rem',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 'clamp(2rem, 5vw, 3rem)',
  height: 'clamp(2rem, 5vw, 3rem)',
  color: theme['palette'].primary.main,
  opacity: 0.8,
  animation: `${tapAnimation} 1.5s infinite ease-in-out`,
  pointerEvents: 'none',
  zIndex: 1,
}));

const SpeechBubble = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: '-3.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: alpha(theme['palette'].primary.main, 0.9),
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  fontFamily: 'Orbitron, sans-serif',
  fontSize: '1.2rem',
  whiteSpace: 'nowrap',
  animation: 'floatUp 1s ease-out forwards',
  zIndex: 10,
  '@keyframes floatUp': {
    '0%': {
      transform: 'translate(-50%, 20px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translate(-50%, 0)',
      opacity: 1,
    },
  },
}));

const StyledQuestionBox = styled(Box)<StyledProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  marginBottom: '0.75rem',
  lineHeight: 1.5,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: 'Orbitron, sans-serif',
  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
  fontWeight: 500,
  letterSpacing: '0.01em',
  backgroundColor: alpha(theme['palette']?.background?.paper || '#000', 0.15),
  border: '0.0625rem solid rgba(255, 255, 255, 0.18)',
  borderRadius: '1.25rem',
  backdropFilter: 'blur(0.75rem)',
  position: 'relative',
  padding: '1rem 1.5rem',
  minHeight: 'min(15vh, 6rem)',
  color: '#fff',
  textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.2)',
  '& > span': {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: 'min(15vh, 5.25rem)',
    width: '100%',
  },
  '&:hover': {
    transform: 'translateX(0.625rem) scale(1.01)',
    '&::before': {
      opacity: 1,
    },
    '& .expand-icon': {
      opacity: 1,
    },
  },
  '&.reading': {
    animation: `${pulseAnimation} 2s infinite ease-in-out`,
  },
}));

const TutorialContainer = styled('div')({
  position: 'relative',
  width: '100%',
});

export const QuestionModalTutorialContainer = observer(() => {
  const {
    currQuestionText,
    showAnswers,
    showExpandIcon,
    shouldShowQExpandIcon,
    handleQuestionBoxClick,
    showFirstTimeHint,
    handleFirstTimeHintDismiss,
  } = useGameStore().questionViewStore;
  const { isTutorial } = useGameStore().gamePlayViewStore;
  return (
    <TutorialContainer>
      <StyledQuestionBox
        className={`question`}
        onClick={handleQuestionBoxClick}
        $isTutorial={isTutorial}
        component="div"
      >
        {/* Bonus points UI elements commented out but functionality kept in the store
                {showBonusPoints ? (
                  <BonusPointsCircle>
                    <CircularProgress
                      variant="determinate"
                      value={bonusPointsStore.progress}
                      size={70}
                      thickness={3}
                      sx={{
                        color: theme.palette.primary.main,
                      }}
                    />
                    <BonusPointsText>+300</BonusPointsText>
                  </BonusPointsCircle>
                ) : showSpeedBonus ? (
                  <SpeedBonusContainer>
                    <SpeedBonusIcon />
                    <SpeedBonusText>+300</SpeedBonusText>
                  </SpeedBonusContainer>
                ) : null}
                */}
        <span>{currQuestionText}</span>
        {!showAnswers && <ReadingProgressBar />}
        {isTutorial && showExpandIcon && (
          <ExpandIcon
            className="expand-icon"
            $isTutorial={isTutorial}
            $showExpandIcon={showExpandIcon}
          />
        )}
        {!isTutorial && showFirstTimeHint && (
          <FirstTimeIcon onClick={handleFirstTimeHintDismiss} />
        )}
      </StyledQuestionBox>
      {shouldShowQExpandIcon && (
        <>
          <SpeechBubble>Tap to expand the question!</SpeechBubble>
          <TapIcon />
        </>
      )}
    </TutorialContainer>
  );
});
