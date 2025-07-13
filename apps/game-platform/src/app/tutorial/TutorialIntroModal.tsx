import { Box, Button, Modal, Typography, useTheme, alpha } from '@mui/material';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { defaultModalStyle } from '../Common';
import { HowtoPlayHelp } from '../modals/HowtoPlayHelp';

export const TutorialIntroModal = () => {
  const {
    setIsTutorial,
    setIsTutorialCompleted,
    setShowTutorialIntro,
    setShowLaneSelect,
  } = useGameStore().gamePlayViewStore;
  const theme = useTheme();
  const { translatedGameData } = useGameStore().translateViewStore;
  
  const tutorialLabel = translatedGameData?.tutorialLabel || 'Tutorial';
  const tutorialDescriptionLabel = translatedGameData?.tutorialDescriptionLabel || 'Learn how to play in three simple steps.';
  const startTutorialLabel = translatedGameData?.startTutorialLabel || 'Start Tutorial';
  const skipLabel = translatedGameData?.skipLabel || 'Skip';

  const handleTutorialClose = () => {
    setShowTutorialIntro(false);
    // setShowLaneSelect(true);
  };

  const handlePlay = () => {
    setIsTutorial(true);
    handleTutorialClose();
  };

  const handleSkip = () => {
    setIsTutorial(false);
    setIsTutorialCompleted(true);
    handleTutorialClose();
  };

  return (
    <Modal open={true} onClose={handleSkip}>
        <Box
          component="div"
          sx={{
            ...defaultModalStyle,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '.5em',
            color: theme.palette.primary.contrastText,
            padding: '1em',
            backgroundColor: 'rgba(0, 0, 0, .5)',
            backdropFilter: 'blur(2px) contrast(.9)', // Add blur and contrast effects
            width: '90vw',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: theme.palette.primary.contrastText,
              textAlign: 'center',
            }}
          >
            {tutorialLabel}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              color: theme.palette.primary.contrastText,
              textAlign: 'center',
            }}
          >
            {tutorialDescriptionLabel}
          </Typography>

          <HowtoPlayHelp />
          <Box
            component="div"
            sx={{
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Button
              variant="contained"
              onClick={handlePlay}
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.main,
                width: '100%',
                fontSize: '1em',
                padding: '1em',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.85),
                  transform: 'scale(1.02)',
                },
              })}
            >
              {startTutorialLabel}
            </Button>
            <Button
              variant="outlined"
              onClick={handleSkip}
              sx={(theme) => ({
                border: '1px solid',
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                width: '100%',
                fontSize: '1em',
                padding: '1em',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: alpha(theme.palette.primary.main, 0.85),
                  color: alpha(theme.palette.primary.main, 0.85),
                  transform: 'scale(1.02)',
                  backgroundColor: 'transparent',
                },
              })}
            >
              {skipLabel}
            </Button>
          </Box>
        </Box>
    </Modal>
  );
};
