import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  Divider,
  alpha,
  Paper,
  Badge,
  Theme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RedeemIcon from '@mui/icons-material/Redeem';
import { observer } from 'mobx-react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { ExplDetail } from './ExplDetail';
import { ColorLabels, IDbQuestion, IGameSessionQuestions } from '@lidvizion/commonlib';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { StyledProgress } from '../../playerprofile/PlayerProfile';
import ReplayIcon from '@mui/icons-material/Replay';
import { EndGameQuestTxt } from '../../Common';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ReviewProgressRing } from './components/ReviewProgressRing';
import { IReviewedQuestion } from '@lidvizion/commonlib';

interface ReviewQProps {
  onBack: () => void;
}

interface BonusBadgeProps {
  unlocked: boolean;
  theme: Theme;
}

const BonusBadge: React.FC<BonusBadgeProps> = ({ unlocked, theme }) => {
  return (
    <Badge 
      badgeContent={
        unlocked ? 
          <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: '1.2rem' }} /> : 
          <LockIcon sx={{ color: theme.palette.grey[500], fontSize: '1rem' }} />
      } 
      overlap="circular"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: 'transparent',
          border: 'none',
        }
      }}
    >
      <RedeemIcon 
        sx={{ 
          color: unlocked ? theme.palette.success.main : theme.palette.grey[500],
          fontSize: '2rem'
        }} 
      />
    </Badge>
  );
};

export const ReviewQ: React.FC<ReviewQProps> = observer(({ onBack }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<IReviewedQuestion | null>(null);
  const { attemptsPerQuestion } = useGameStore().gamePlayViewStore;
  const { currentProgress, endGameQuestTxt, handleNextGameClick } = useGameStore().endGameViewStore;
  const { getApiQuestions, playedQuestions, gameSession } = useGameStore().gameViewStore;
  const theme = useTheme();
  const { translatedGameData } = useGameStore().translateViewStore;

  const reviewLabel = translatedGameData?.reviewLabel || 'Review';
  const questionsCompletedLabel = translatedGameData?.questionsCompletedLabel || 'Questions Completed';
  const restartQuestLabel = translatedGameData?.restartQuestLabel || 'Restart Quest';
  const nextDashLabel = translatedGameData?.nextDashLabel || 'Next Dash';
  const reviewBonusLabel = 'Review Bonus'; // Hardcoded since it's not in IGameData

  const handleQuestionClick = (question: IDbQuestion) => {
    // Convert IDbQuestion to IReviewedQuestion
    const reviewedQuestion: IReviewedQuestion = {
      ...question,
      reviewed: false,
      viewedSections: {
        explanation: false,
        hints: {},
        source: false
      }
    };
    setSelectedQuestion(reviewedQuestion);
  };

  const reviewedQuestions = Object.values(gameSession.questions)
    .filter(q => q && typeof q === 'object' && 'reviewed' in q && q.reviewed === true).length;
  const totalQuestions = Object.keys(gameSession.questions).length;
  const progressPercent = (reviewedQuestions / totalQuestions) * 100;
  const bonusUnlocked = reviewedQuestions === totalQuestions;

  return (
    <Box
      component="div"
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {selectedQuestion && (
        <ExplDetail
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
      <>
        <Box
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={onBack}
            sx={{
              position: 'absolute',
              left: 0,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              marginBottom: '.5rem',
              color: theme.palette.text.primary,
              fontSize: '1.5rem',
              width: '100%',
            }}
          >
            {reviewLabel}
          </Typography>
        </Box>
        <Divider sx={{ marginBottom: '1em' }} />

        <Box
          component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Paper
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.1),
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: bonusUnlocked ? 'default' : 'not-allowed',
              transition: 'all 0.3s ease',
              transform: bonusUnlocked ? 'scale(1.05)' : 'scale(1)',
              border: `1px solid ${bonusUnlocked ? theme.palette.success.main : theme.palette.grey[700]}`,
            }}
          >
            <BonusBadge unlocked={bonusUnlocked} theme={theme} />
            <Typography
              sx={{
                color: bonusUnlocked ? theme.palette.success.main : theme.palette.grey[500],
                fontWeight: 'bold',
              }}
            >
              {reviewBonusLabel} +500
            </Typography>
          </Paper>
        </Box>

        <Box
          component="div"
          sx={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: '60vh',
          }}
        >
          {Object.values(playedQuestions).map((q) => {
            const isReviewed = gameSession.questions[q.id]?.reviewed;
            
            return (
              <Accordion
                expanded={false}
                key={q.id}
                sx={{
                  padding: '1rem',
                  backgroundColor: isReviewed 
                    ? alpha(theme.palette.success.main, 0.3) 
                    : 'rgba(225, 225, 225, 0.1)',
                  border: isReviewed 
                    ? `2px solid ${theme.palette.success.main}` 
                    : '1px solid transparent',
                  borderRadius: '0.5rem',
                  boxShadow: isReviewed 
                    ? `0 0.5rem 1rem rgba(76, 175, 80, 0.2)` 
                    : '0 0.25rem 0.375rem rgba(0,0,0,0.1)',
                  marginBottom: '.1rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: isReviewed 
                      ? alpha(theme.palette.success.main, 0.4) 
                      : alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-2px)',
                  },
                }}
                onChange={() => handleQuestionClick(q)}
              >
                <AccordionSummary
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{
                    minHeight: 'auto',
                    padding: '0 1rem',
                    '& .MuiAccordionSummary-content': {
                      margin: 0,
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                    },
                  }}
                >
                  <Box
                    component="div"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    sx={{
                      flexWrap: 'nowrap',
                    }}
                  >
                    <Typography
                      sx={{
                        color: theme.palette.text.primary,
                        fontSize: '1rem',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                        flex: 1,
                        marginRight: '1rem',
                      }}
                    >
                      {translatedGameData?.questions[q.id].question || ''}
                    </Typography>
                    <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isReviewed && (
                        <CheckCircleIcon
                          sx={{
                            color: theme.palette.success.main,
                            fontSize: '1.5rem',
                          }}
                        />
                      )}
                      {typeof q.tries === 'number' && q.tries > 1 && (
                        <CancelIcon
                          sx={{
                            color: isReviewed ? theme.palette.success.main : 'white',
                            fontSize: '2rem',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>
              </Accordion>
            );
          })}
        </Box>
      </>
      <StyledProgress
        value={currentProgress()}
        style={{
          color: theme.palette.primary.main,
          width: '100%',
        }}
      />
      <Typography
        sx={{
          color: 'white',
          fontSize: '1.25rem',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          alignSelf: 'center',
        }}
      >
        ({Object.keys(playedQuestions).length}/{getApiQuestions().length}) {questionsCompletedLabel}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleNextGameClick}
        sx={(theme) => ({
          width: 'fit-content',
          alignSelf: 'center',
          marginTop: '1rem',
          backgroundColor: theme.palette.primary.main,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.85),
            transform: 'scale(1.05)',
          },
        })}
        endIcon={
          <>
            {endGameQuestTxt === EndGameQuestTxt.next && (
              <KeyboardDoubleArrowRightIcon
                sx={{ fontSize: 40, color: ColorLabels.gold }}
              />
            )}
            {endGameQuestTxt === EndGameQuestTxt.complete && (
              <ReplayIcon sx={{ fontSize: 40, color: ColorLabels.gold }} />
            )}
          </>
        }
      >
        <Box
          component={'div'}
          display={'flex'}
          gap={'1em'}
          alignItems={'center'}
        >
          <Typography>
            {endGameQuestTxt === EndGameQuestTxt.next ? nextDashLabel : restartQuestLabel}
          </Typography>
        </Box>
      </Button>
    </Box>
  );
});

export default ReviewQ;
