import React from 'react';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { 
  Box, 
  Modal, 
  Typography, 
  styled, 
  Button
} from '@mui/material';
import { IPresenterQuestion } from '../PresenterViewStore';

// Styled Components for Containers
const ModalStyledContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '75rem',
  maxHeight: '95vh',
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem',
  borderRadius: '1.25rem',
  backgroundColor: 'rgba(25, 25, 35, 0.8)',
  backdropFilter: 'blur(0.75rem)',
  boxShadow: '0 0.5rem 2rem 0 rgba(31, 38, 135, 0.37)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  outline: 'none',
  overflow: 'auto',
}));

const QuestionStyledBox = styled(Box)(({ theme }) => ({
  marginBottom: '1.5rem',
  padding: '1.5rem',
  borderRadius: '1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  textAlign: 'center',
  color: '#fff',
}));

const AnswersStyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '1.5rem',
  flex: 1,
}));

const FeedbackStyledContainer = styled(Box)(({ theme }) => ({
  marginTop: '1.5rem',
  textAlign: 'center',
  padding: '1rem',
  borderRadius: '0.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
}));

const ButtonStyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1.5rem',
}));

// Styled Components for Answer Options (already styled, ensure consistency)
const AnswerOptionStyled = styled('div')<{ $isSelected?: boolean; $isCorrect?: boolean }>(
  ({ theme, $isSelected, $isCorrect }) => ({
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem',
    borderRadius: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', color: '#fff',
    transition: 'all 0.3s ease',
    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)', transform: 'translateX(5px)' },
    ...($isSelected && {
      backgroundColor: $isCorrect ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
      border: `1px solid ${$isCorrect ? theme.palette.success.main : theme.palette.error.main}`,
    }),
  })
);
const AnswerLetter = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontWeight: 'bold',
    fontSize: '1.25rem',
});
const AnswerText = styled('div')({
    flex: 1,
    fontSize: '1.1rem',
});
const ActionButton = styled(Button)({
    padding: '0.5rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
});

// Sub-components
interface QuestionDisplayProps {
  question: string;
}
const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => (
  <QuestionStyledBox>
    <Typography variant="h4" component="h2" gutterBottom>
      {question}
    </Typography>
  </QuestionStyledBox>
);

interface AnswerListProps {
  answers: string[];
  selectedAnswer: number;
  showAnswers: boolean;
  correctAnswerIdx: number;
  onAnswerClick: (index: number) => void;
}
const AnswerList: React.FC<AnswerListProps> = observer(({ answers, selectedAnswer, showAnswers, correctAnswerIdx, onAnswerClick }) => (
  <AnswersStyledContainer>
    {answers.map((answer, index) => (
      <AnswerOptionStyled
        key={index}
        onClick={() => onAnswerClick(index)}
        $isSelected={selectedAnswer === index}
        $isCorrect={showAnswers && index === correctAnswerIdx}
      >
        <AnswerLetter>{String.fromCharCode(65 + index)}</AnswerLetter>
        <AnswerText>{answer}</AnswerText>
      </AnswerOptionStyled>
    ))}
  </AnswersStyledContainer>
));

interface FeedbackDisplayProps {
  isCorrect: boolean;
  explanation: string;
}
const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ isCorrect, explanation }) => (
  <FeedbackStyledContainer>
    <Typography variant="h5" sx={{ color: isCorrect ? 'success.main' : 'error.main' }}>
      {isCorrect ? 'Correct!' : 'Incorrect. Try again!'}
    </Typography>
    <Typography sx={{ marginTop: '1rem' }}>{explanation}</Typography>
  </FeedbackStyledContainer>
);

interface ActionButtonsProps {
  onBackToLayer: () => void;
  onTryAgain?: () => void;
  showTryAgain: boolean;
}
const ActionButtons: React.FC<ActionButtonsProps> = ({ onBackToLayer, onTryAgain, showTryAgain }) => (
  <ButtonStyledContainer>
    <ActionButton variant="contained" color="primary" onClick={onBackToLayer}>
      Back to Layer
    </ActionButton>
    {showTryAgain && onTryAgain && (
      <ActionButton variant="outlined" color="primary" onClick={onTryAgain}>
        Try Again
      </ActionButton>
    )}
  </ButtonStyledContainer>
);

export const PresenterQuestionModal: React.FC = observer(() => {
  const { presenterViewStore } = useGameStore();
  const { currentQuestion, isQuestionMode, selectedAnswer, showAnswers, setQuestionMode, selectAnswer, resetQuestionState } = presenterViewStore;

  if (!isQuestionMode || !currentQuestion) return null;

  return (
    <Modal
      open={isQuestionMode}
      onClose={() => setQuestionMode(false)}
      sx={{ backdropFilter: 'blur(0.5rem)', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      <ModalStyledContainer>
        <QuestionDisplay question={currentQuestion.question} />
        <AnswerList 
          answers={currentQuestion.answers}
          selectedAnswer={selectedAnswer}
          showAnswers={showAnswers}
          correctAnswerIdx={currentQuestion.correctAnswerIdx}
          onAnswerClick={selectAnswer}
        />
        {showAnswers && (
          <FeedbackDisplay 
            isCorrect={selectedAnswer === currentQuestion.correctAnswerIdx}
            explanation={currentQuestion.explanation}
          />
        )}
        <ActionButtons 
          onBackToLayer={() => setQuestionMode(false)}
          onTryAgain={resetQuestionState}
          showTryAgain={showAnswers}
        />
      </ModalStyledContainer>
    </Modal>
  );
}); 