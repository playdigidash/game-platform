import { getTxtFromEditor } from '@lidvizion/commonlib';
import { Box, IconButton, Modal, styled, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import CloseIcon from '@mui/icons-material/Close';
import { tutorialItems } from '../tutorial/tutorialViewStore';

export const DetailQuestionModal: React.FC = observer(() => {
  const { showFullQuestion, setShowFullQuestion, currentQuestionData } =
    useGameStore().questionViewStore;
  const { isTutorial } = useGameStore().gamePlayViewStore;

  // Get tutorial question data if in tutorial mode
  const questionData = isTutorial 
    ? tutorialItems[tutorialItems.length - 1].questionData 
    : currentQuestionData;

  const ModalBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(90vw, 40rem)',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    color: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 0 2rem rgba(0, 0, 0, 0.5)',
    padding: theme.spacing(4),
    outline: 'none',
    maxHeight: '90vh',
    overflowY: 'auto',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: theme.spacing(6),
  }));

  const CloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: '0.5rem',
    top: '0.5rem',
    color: 'rgba(255, 255, 255, 0.8)',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#fff',
    },
  }));

  const QuestionTypography = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    color: '#fff',
    // marginBottom: theme.spacing(1),
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    lineHeight: 1.4,
    fontFamily: 'Orbitron, sans-serif',
  }));

  return (
    <Modal
      open={showFullQuestion}
      onClose={() => setShowFullQuestion(false)}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <ModalBox>
        <CloseButton
          onClick={() => setShowFullQuestion(false)}
          aria-label="close question"
        >
          <CloseIcon />
        </CloseButton>
        <QuestionTypography variant="h4">
          {getTxtFromEditor(questionData?.xformedQ || '')}
        </QuestionTypography>
      </ModalBox>
    </Modal>
  );
});
