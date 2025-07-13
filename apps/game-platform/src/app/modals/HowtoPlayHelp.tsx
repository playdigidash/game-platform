import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { Quiz, Toll } from '@mui/icons-material';
import { useGameStore } from '../RootStore/RootStoreProvider';

export const HowtoPlayHelp = () => {
  const theme = useTheme();
  const { setAchievement } = useGameStore().gamePlayViewStore;
  const { translatedGameData } = useGameStore().translateViewStore;
  const dodgeObstaclesLabel = translatedGameData?.dodgeObstaclesLabel || 'Dodge Obstacles (-50)';
  const collectCoinsHintsLabel = translatedGameData?.collectCoinsHintsLabel || 'Collect Coins (+100)';
  const answerTriviaLabel = translatedGameData?.answerTriviaLabel || 'Answer Trivia (accuracy is key!)';
  const avoidObstaclesLabel = translatedGameData?.avoidObstaclesLabel || 'Avoid obstacles in your path to keep your points! (-50 points per hit)';
  const collectCoinsHintBoxesLabel =  translatedGameData?.collectCoinsHintBoxesLabel ||  'Collect coins to increase your score (+100 points each) and collect hint boxes for trivia help!';
  const answerAccuracySpeedLabel =  translatedGameData?.answerAccuracySpeedLabel || 
  'Answer accurately to earn more points! Base 1000 points ÷ attempts + speed bonus (up to 300 points). Your score decreases with each attempt, so aim for the right answer early!';

  return (
    <Box
      component="div"
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      alignItems={'center'}
      gap={'.5em'}
      padding={'.5em'}
      textAlign={'center'}
    >
      <Box
        component="div"
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={'1.5em'}
        flexGrow={1}
        sx={{ backgroundColor: 'transparent' }}
      >
        <Box
          component="div"
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          gap={'0.5em'}
          onClick={() => {
            setAchievement({
              text: avoidObstaclesLabel,
            });
          }}
        >
          <KeyboardDoubleArrowLeftIcon sx={{ color: theme.palette.primary.contrastText }} />
          <KeyboardDoubleArrowRightIcon sx={{ color: theme.palette.primary.contrastText }} />
          <KeyboardDoubleArrowUpIcon sx={{ color: theme.palette.primary.contrastText }} />
          <KeyboardDoubleArrowDownIcon sx={{ color: theme.palette.primary.contrastText }} />
          <Tooltip
            title={avoidObstaclesLabel}
            placement="right"
            arrow
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
              <Typography
                sx={{
                  fontSize: '1em',
                  color: theme.palette.primary.contrastText,
                }}
              >
                Dodge Obstacles
              </Typography>
              <Typography
                sx={{
                  fontSize: '1em',
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '0.5em',
                  padding: '0.2em 0.5em',
                }}
              >
                (-50)
              </Typography>
            </div>
          </Tooltip>
        </Box>
        <Box
          component="div"
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          gap={'0.5em'}
          onClick={() => {
            setAchievement({
              text: collectCoinsHintBoxesLabel,
            });
          }}
        >
          <Toll sx={{ color: theme.palette.primary.contrastText }} />
          <Box
            component="div"
            style={{
              backgroundColor: theme.palette.grey[600],
              borderRadius: '0.5em',
              padding: '0.2em 0.5em',
            }}
          >
            H
          </Box>
          <Tooltip
            title={collectCoinsHintBoxesLabel}
            placement="right"
            arrow
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
              <Typography
                sx={{
                  fontSize: '1em',
                  color: theme.palette.primary.contrastText,
                }}
              >
                Collect Coins
              </Typography>
              <Typography
                sx={{
                  fontSize: '1em',
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '0.5em',
                  padding: '0.2em 0.5em',
                }}
              >
                (+100)
              </Typography>
            </div>
          </Tooltip>
        </Box>
        <Box
          component="div"
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          gap={'0.5em'}
          onClick={() => {
            setAchievement({
              text: answerAccuracySpeedLabel
            });
          }}
        >
          <Quiz sx={{ color: theme.palette.primary.contrastText }} />
          <Tooltip
            title={answerAccuracySpeedLabel}
            placement="right"
            arrow
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
              <Typography
                sx={{
                  fontSize: '1em',
                  color: theme.palette.primary.contrastText,
                }}
              >
                Answer Trivia (accuracy is key!)
              </Typography>
              <Typography
                sx={{
                  fontSize: '1em',
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '0.5em',
                  padding: '0.2em 0.5em',
                }}
              >
                ?
              </Typography>
            </div>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
