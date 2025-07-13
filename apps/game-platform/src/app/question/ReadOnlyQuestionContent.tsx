import { Typography, alpha, styled } from '@mui/material';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { readingProgressBarAnimation } from '../animations/AnimationViewStore';
import { observer } from 'mobx-react';

const ReadingText = styled(Typography)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Orbitron, sans-serif',
  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
  fontWeight: 500,
  color: '#fff',
  textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.2)',
  letterSpacing: '0.01em',
  lineHeight: 1.5,
  textAlign: 'center',
  maxWidth: '75rem',
  padding: '0 2rem',
  width: '100%',
}));

export const ReadingProgressBar = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '0.3rem',
  marginTop: '0.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '0.15rem',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    animation: `${readingProgressBarAnimation} 5s linear forwards`,
    boxShadow: `0 0 0.5rem ${alpha(theme.palette.primary.main, 0.7)}`,
  },
}));

export const ReadOnlyQuestionContent = observer(() => {
  const { showAnswers, currQuestionText, isReading, hasNavigatedBackFromAnswers } =
    useGameStore().questionViewStore;
  return isReading ? (
    <ReadingText>
      {currQuestionText}
      {!showAnswers && !hasNavigatedBackFromAnswers && <ReadingProgressBar />}
    </ReadingText>
  ) : null;
});
