import { Box, IconButton, useTheme } from '@mui/material';
import { observer } from 'mobx-react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useGameStore } from '../RootStore/RootStoreProvider';

interface SkipButtonProps {
  size?: 'small' | 'medium';
}

export const SkipButton = observer(({ size = 'medium' }: SkipButtonProps) => {
  const { setIsTutorial, setIsTutorialCompleted } = useGameStore().gamePlayViewStore;
  const theme = useTheme();
  const { translatedGameData } = useGameStore().translateViewStore;
  const skipTutorialLabel = translatedGameData?.skipTutorialLabel || 'Skip Tutorial';

  return (
    <Box 
      component="div" 
      position="fixed" 
      bottom={size === 'small' ? '2rem' : '4rem'} 
      left="2rem"
      zIndex={1000}
    >
      <IconButton
        sx={{
          color: 'white',
          backgroundColor: theme.palette.primary.main,
          borderRadius: '0.5em',
          fontSize: size === 'small' ? '0.875rem' : '1rem',
          padding: size === 'small' ? '0.5rem 0.75rem' : '0.75rem 1rem',
          fontFamily: 'Orbitron, sans-serif',
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            opacity: 0.9,
          },
        }}
        onClick={() => {
          setIsTutorialCompleted(true);
          setIsTutorial(false);
        }}
      >
        <ArrowForwardIosIcon fontSize={size === 'small' ? 'small' : 'medium'} />
        <Box component="span" sx={{ fontFamily: 'Orbitron, sans-serif', ml: 1 }}>
          {skipTutorialLabel}          
        </Box>
      </IconButton>
    </Box>
  );
});