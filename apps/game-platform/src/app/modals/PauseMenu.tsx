import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react';
import { Settings } from '../settings/Settings';
import { HowtoPlayHelp } from './HowtoPlayHelp';
import { FeedbackModal } from './FeedbackModal';

export const PauseMenu: React.FC<any> = observer(() => {
  const theme = useTheme();
  const { pauseMenuTabIdx } = useGameStore().gamePlayViewStore;
  const { translatedGameData } = useGameStore().translateViewStore;
  const howToPlayLabel = translatedGameData?.howToPlayLabel || 'How To Play';
  return (
    <>
      {pauseMenuTabIdx === 0 && <Settings />}
      {pauseMenuTabIdx === 1 && (
        <Box
          component="div"
          display={'flex'}
          height={'100%'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'.5em'}
          color={theme.palette.primary.contrastText}
          padding={'1em'}
          sx={{ backgroundColor: 'transparent' }}
        >
          <Typography variant="h5">{howToPlayLabel}</Typography>
          <HowtoPlayHelp />
          {/* <Button
            variant="contained"
            onClick={() => hidePauseMenu()}
            sx={{
              marginTop: '2rem',
              width: '100%',
              fontSize: '1em',
              padding: '1em',
              backgroundColor: theme.palette.primary.main,
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.85),
                transform: 'scale(1.02)',
              },
            }}
          >
            Play!
          </Button> */}
        </Box>
      )}
      {pauseMenuTabIdx === 2 && (
        <Box
          component="div"
          display={'flex'}
          height={'100%'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'.5em'}
          color={theme.palette.primary.contrastText}
          padding={'1em'}
          sx={{ backgroundColor: 'transparent' }}
        >
          {/* <Typography variant="h5">We Want To Hear From You!</Typography> */}
          <FeedbackModal show={true} onClose={() => null} />
        </Box>
      )}
    </>
  );
});
