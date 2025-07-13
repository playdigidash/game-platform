import { alpha, Box, styled, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react';
import { shakeKeyframes } from '../animations/AnimationViewStore';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { TUTORIAL_QUESTION_DATA } from '../tutorial/tutorialConstants';

const AnswerOption = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: 'clamp(1rem, 3vh, 1.75rem) clamp(1.25rem, 3vw, 2rem)',
  marginBottom: '0.5rem',
  borderRadius: '1.25rem',
  transition: 'all 0.3s ease',
  fontFamily: 'Orbitron, sans-serif',
  backgroundColor: alpha(theme.palette.background.paper, 0.15),
  border: '0.0625rem solid rgba(255, 255, 255, 0.18)',
  backdropFilter: 'blur(0.75rem)',
  cursor: 'pointer',
  minHeight: 'min(12vh, 5rem)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '1.25rem',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateX(0.625rem) scale(1.01)',
    backgroundColor: alpha(theme.palette.background.paper, 0.25),
    '&::before': {
      opacity: 1,
    },
  },
  '&.hovered': {
    backgroundColor: alpha(theme.palette.background.paper, 0.2),
  },
}));

const AnswerLetter = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  minWidth: 'clamp(3rem, 8vw, 3.25rem)',
  height: 'clamp(3rem, 8vw, 3.25rem)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `0.125rem solid ${alpha(theme.palette.primary.main, 0.3)}`,
  fontFamily: 'Orbitron, sans-serif',
  marginLeft: '0.5rem',
}));

const AnswerText = styled(Typography)(() => ({
  flex: 1,
  overflow: 'visible',
  whiteSpace: 'normal',
  fontFamily: 'Orbitron, sans-serif',
  fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
  fontWeight: 500,
  color: '#fff',
  textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.2)',
  letterSpacing: '0.01em',
  lineHeight: 1.5,
  paddingRight: '0.5rem',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
}));

const AnswersContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  flex: 1,
  justifyContent: 'space-around',
  visibility: 'hidden',
  opacity: 0,
  transform: 'translateY(1.25rem)',
  transition: 'all 0.5s ease',
  padding: '0.5rem 1rem',
  paddingTop: '0.25rem',
  paddingBottom: '0.5rem',
  '&.show': {
    visibility: 'visible',
    opacity: 1,
    transform: 'translateY(0)',
  },
}));

interface Option {
  color: string;
  letter: string;
}

export const QuestionModalAnswerContainer = observer(() => {
  const theme = useTheme();
  const {
    currentQuestionData,
    selectedOption,
    hoveredOption,
    showAnswers,
    handleOptionClick,
    handleHover,
    showTooltip,
    wrongSelections,
    helperData,
  } = useGameStore().questionViewStore;
  const { isTutorial } = useGameStore().gamePlayViewStore;
  const { translatedGameData } = useGameStore().translateViewStore;

  return (
    <AnswersContainer className={`answers ${showAnswers ? 'show' : ''}`}>
      {helperData.options.map((item: Option, ind: number) => (
        <AnswerOption
          key={item.letter}
          style={{
            backgroundColor: alpha(theme.palette.background.paper, 0.15),
            ...(wrongSelections.has(ind) ||
            (selectedOption === ind &&
              selectedOption !== currentQuestionData?.correctAnswerIdx)
              ? {
                  borderColor: theme.palette.error.main,
                  borderWidth: '2px',
                }
              : {}),
            ...(selectedOption === ind &&
            selectedOption === currentQuestionData?.correctAnswerIdx
              ? {
                  borderColor: theme.palette.success.main,
                  boxShadow: `0 0 10px ${theme.palette.success.main}`,
                }
              : {}),
            ...(selectedOption === ind ? { transform: 'scale(1.02)' } : {}),
            ...(selectedOption === ind &&
            selectedOption !== currentQuestionData?.correctAnswerIdx
              ? { animation: `${shakeKeyframes} 0.5s ease-in-out` }
              : {}),
            ...(selectedOption !== -1 && selectedOption !== ind
              ? { opacity: 0.5, cursor: 'not-allowed' }
              : {}),
          }}
          className={`option ${
            hoveredOption === item.letter &&
            selectedOption === -1 &&
            !wrongSelections.has(ind)
              ? 'hovered'
              : ''
          }`}
          onMouseEnter={() =>
            selectedOption === -1 &&
            !wrongSelections.has(ind) &&
            handleHover(item.letter, true)
          }
          onMouseLeave={() =>
            selectedOption === -1 &&
            !wrongSelections.has(ind) &&
            handleHover(item.letter, false)
          }
          onClick={() => handleOptionClick(ind)}
        >
          <AnswerLetter>{item.letter}</AnswerLetter>
          <AnswerText>
            {currentQuestionData && translatedGameData
              ? translatedGameData.questions[
                  isTutorial
                    ? TUTORIAL_QUESTION_DATA.id
                    : currentQuestionData.id
                ].answers[ind]
              : ''}
          </AnswerText>
        </AnswerOption>
      ))}
    </AnswersContainer>
  );
});
