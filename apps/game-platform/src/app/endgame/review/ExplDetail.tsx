import { Editor } from '@lidvizion/commonlib';
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Modal,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { observer } from 'mobx-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { ReviewProgressRing } from './components/ReviewProgressRing';
import { IReviewedQuestion } from '@lidvizion/commonlib';
import { debounce } from 'lodash';

export const ExplDetail: React.FC<{ question: IReviewedQuestion; onClose: () => void }> = observer(
  ({ question, onClose }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState<string | null>(null);
    const { translatedGameData } = useGameStore().translateViewStore;
    const { gameSession } = useGameStore().gameViewStore;
    const { setGameSession } = useGameStore().gameViewStore;
    
    const qTxt = translatedGameData?.questions[question.id].question || '';
    const hints = translatedGameData?.questions[question.id].hints || [];
    const explanationLabel = translatedGameData?.explanationLabel || 'Explanation';
    const hintsLabel = translatedGameData?.hintsLabel || 'Hints';
    const sourceLabel = translatedGameData?.sourceLabel || 'Source';

    const [viewedSections, setViewedSections] = useState({
      explanation: false,
      hints: {} as { [key: string]: boolean },
      source: false
    });

    // Separate state for tracking expanded hints (different from viewed)
    const [expandedHints, setExpandedHints] = useState<{ [key: string]: boolean }>({});

    // Track section view times
    const recordSectionView = debounce((section: string, hintId?: string) => {
      const timestamp = Date.now();
      const updatedSession = { ...gameSession };
      
      // Add safety checks to prevent undefined errors
      if (!updatedSession.questions) {
        return;
      }
      
      if (!updatedSession.questions[question.id]) {
        return;
      }
      
      if (!updatedSession.questions[question.id].reviewAnalytics) {
        updatedSession.questions[question.id].reviewAnalytics = {
          explanationViewSessions: [],
          hintViewSessions: {},
          sourceViewSessions: []
        };
      }

      if (hintId) {
        if (!updatedSession.questions[question.id].reviewAnalytics!.hintViewSessions[hintId]) {
          updatedSession.questions[question.id].reviewAnalytics!.hintViewSessions[hintId] = [];
        }
        updatedSession.questions[question.id].reviewAnalytics!.hintViewSessions[hintId].push({
          start: timestamp,
          stop: timestamp
        });
      } else {
        const analytics = updatedSession.questions[question.id].reviewAnalytics!;
        switch (section) {
          case 'explanation':
            analytics.explanationViewSessions.push({ start: timestamp, stop: timestamp });
            break;
          case 'source':
            analytics.sourceViewSessions.push({ start: timestamp, stop: timestamp });
            break;
        }
      }

      setGameSession(updatedSession);
    }, 300);

    const handleExpand = (section: string) => {
      if (expanded !== section) {
        setExpanded(section);
        if (section === 'explanation' || section === 'source') {
          setViewedSections(prev => ({ ...prev, [section]: true }));
          recordSectionView(section);
        }
      } else {
        setExpanded(null);
      }
    };

    const handleHintExpand = (hintId: string) => {
      const isCurrentlyExpanded = expandedHints[hintId];
      
      // Toggle expanded state
      setExpandedHints(prev => ({
        ...prev,
        [hintId]: !isCurrentlyExpanded
      }));
      
      // Mark as viewed if opening for the first time
      if (!viewedSections.hints[hintId]) {
        setViewedSections(prev => ({
          ...prev,
          hints: { ...prev.hints, [hintId]: true }
        }));
        recordSectionView('hints', hintId);
      }
    };

    const allHintsViewed = hints.length === 0 || 
      hints.every((_, index) => viewedSections.hints[`hint${index}`]);

    const allSectionsViewed = 
      viewedSections.explanation && 
      allHintsViewed && 
      viewedSections.source;

    useEffect(() => {
      if (allSectionsViewed) {
        // Add safety checks before updating game session
        if (!gameSession?.questions?.[question.id]) {
          return;
        }
        
        // Update game session and trigger achievement
        const updatedSession = { ...gameSession };
        updatedSession.questions[question.id].reviewed = true;
        
        setGameSession(updatedSession);
        
        // Trigger achievement popup
        // TODO: Add achievement popup logic
      }
    }, [allSectionsViewed, gameSession, question.id, setGameSession]);

    const answers = translatedGameData?.questions[question.id].answers.map((answer: any, index: number) => (
      <Grid item xs={6} key={index}>
        <Paper
          sx={{
            backgroundColor: 'transparent',
            borderRadius: '0.5rem',
            boxShadow: '0 0.25rem 0.375rem rgba(0,0,0,0.1)',
            padding: '1.5vh',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              color:
                index === question.correctAnswerIdx
                  ? theme.palette.success.light
                  : theme.palette.primary.contrastText,
              fontSize: '1rem',
              height: '100%',
            }}
          >
            {answer}
          </Typography>
        </Paper>
      </Grid>
    ));

    const SectionHeader = ({ 
      label, 
      isViewed, 
      onClick 
    }: { 
      label: string; 
      isViewed: boolean; 
      onClick: () => void 
    }) => (
      <Box
        component="div"
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          mt: 2,
        }}
      >
        <Typography
          sx={{
            color: theme.palette.primary.contrastText,
            fontSize: '1.25rem',
            mr: 1,
          }}
        >
          {label}
        </Typography>
        {isViewed ? (
          <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
        ) : (
          <ExpandMoreIcon
            sx={{
              color: theme.palette.primary.contrastText,
              transform: expanded === label.toLowerCase() ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        )}
      </Box>
    );

    return (
      <Modal
        open
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="div"
          sx={{
            width: '90vw',
            height: '90vh',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            backdropFilter: 'blur(1rem)',
            overflowY: 'auto',
            p: '1vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            component="div"
            sx={{
              display: 'flex',
              gap: '1rem',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={onClose}>
                <ArrowBackIcon />
              </IconButton>
              <ReviewProgressRing
                progress={
                  ((viewedSections.explanation ? 1 : 0) +
                  (allHintsViewed ? 1 : 0) +
                  (viewedSections.source ? 1 : 0)) * (100 / 3)
                }
                reviewedCount={
                  (viewedSections.explanation ? 1 : 0) +
                  (allHintsViewed ? 1 : 0) +
                  (viewedSections.source ? 1 : 0)
                }
                totalCount={3}
                size={40}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.contrastText,
                textAlign: 'center',
                width: '100%',
                marginTop: '0.5rem',
                marginBottom: '1rem',
                fontSize: '1rem',
              }}
            >
              {qTxt}
            </Typography>
          </Box>

          <Grid container spacing={1} sx={{ fontSize: '.5rem', overflowY: 'auto' }}>
            {answers}
          </Grid>

          <Box component="div" sx={{ overflowY: 'auto' }}>
            <SectionHeader
              label={explanationLabel}
              isViewed={viewedSections.explanation}
              onClick={() => handleExpand('explanation')}
            />
            <Collapse in={expanded === 'explanation'} timeout="auto" unmountOnExit>
              <Paper sx={{
                padding: '1.5vh',
                backgroundColor: 'rgba(225, 225, 225, 0.1)',
                borderRadius: '0.5rem',
                boxShadow: '0 0.25rem 0.375rem rgba(0,0,0,0.1)',
                mt: 1,
              }}>
                <Editor
                  detail={translatedGameData?.questions[question.id].xformedExp || ''}
                  readOnly={true}
                  showToolbar={false}
                  classStyles={{
                    maxWidth: '90vw',
                  }}
                  namespace={'hints-modal'}
                />
              </Paper>
            </Collapse>

            <SectionHeader
              label={hintsLabel}
              isViewed={allHintsViewed}
              onClick={() => handleExpand('hints')}
            />
            <Collapse in={expanded === 'hints'} timeout="auto" unmountOnExit>
              <Paper sx={{
                padding: '1.5vh',
                backgroundColor: 'rgba(225, 225, 225, 0.1)',
                borderRadius: '0.5rem',
                boxShadow: '0 0.25rem 0.375rem rgba(0,0,0,0.1)',
                mt: 1,
              }}>
                {hints.length === 0 ? (
                  <Typography
                    sx={{
                      color: theme.palette.primary.contrastText,
                      fontSize: '1rem',
                      textAlign: 'center',
                      fontStyle: 'italic',
                    }}
                  >
                    No hints available for this question
                  </Typography>
                ) : (
                  hints.map((hint: any, index: number) => (
                    <Box component="div" key={index}>
                      <Box
                        component="div"
                        onClick={() => handleHintExpand(`hint${index}`)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          mt: index === 0 ? 0 : 2,
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.primary.contrastText,
                            fontSize: '1.1rem',
                            mr: 1,
                          }}
                        >
                          {hint.title}
                        </Typography>
                        {viewedSections.hints[`hint${index}`] ? (
                          <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                        ) : (
                          <ExpandMoreIcon
                            sx={{
                              color: theme.palette.primary.contrastText,
                              transform: 'rotate(0deg)',
                              transition: 'transform 0.3s ease',
                            }}
                          />
                        )}
                      </Box>
                      <Collapse in={expandedHints[`hint${index}`]} timeout="auto" unmountOnExit>
                        <Editor
                          detail={hint.xformedH}
                          readOnly={true}
                          showToolbar={false}
                          classStyles={{
                            maxWidth: '90vw',
                          }}
                          namespace={'hints-modal'}
                        />
                      </Collapse>
                    </Box>
                  ))
                )}
              </Paper>
            </Collapse>

            <SectionHeader
              label={sourceLabel}
              isViewed={viewedSections.source}
              onClick={() => handleExpand('source')}
            />
            <Collapse in={expanded === 'source'} timeout="auto" unmountOnExit>
              <Paper sx={{
                padding: '1.5vh',
                backgroundColor: 'rgba(225, 225, 225, 0.1)',
                borderRadius: '0.5rem',
                boxShadow: '0 0.25rem 0.375rem rgba(0,0,0,0.1)',
                mt: 1,
              }}>
                <Editor
                  detail={question.xformedS}
                  readOnly={true}
                  showToolbar={false}
                  classStyles={{
                    maxWidth: '90vw',
                  }}
                  namespace={'hints-modal'}
                />
              </Paper>
            </Collapse>
          </Box>
        </Box>
      </Modal>
    );
  }
);
