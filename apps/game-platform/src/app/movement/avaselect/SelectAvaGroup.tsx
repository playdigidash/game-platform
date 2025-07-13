import { alpha, Box, Button, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { observer } from 'mobx-react-lite';

export const SelectAvaGroup = observer(() => {
  const {
    avaSelectHelper,
    showCarousel,
    selectedIndex,
    setSelectedIndex,
    herosData,
  } = useGameStore().gameViewStore;
  const { setSelectedHero } = useGameStore().gamePlayViewStore;
  const { translatedGameData } = useGameStore().translateViewStore;
  const [hideNow, setHidden] = useState(false);
  const selectLabel = translatedGameData?.selectLabel || 'Select';
  const skipLabel = translatedGameData?.skipLabel || 'Skip';

  useEffect(() => {
    if (avaSelectHelper.event === 'enter') {
      setHidden(true);
    }
  }, [avaSelectHelper]);

  return (
    <Box
      className="ava-select-container"
      component="div"
      display="flex"
      gap="1em"
      width="100%"
      justifyContent="center"
      alignItems="center"
      zIndex={1000}
      sx={{
        pointerEvents: 'auto',
        maxWidth: '100vw',
        overflow: 'visible',
        margin: '0 auto',
      }}
    >
      {!hideNow && (
        <IconButton
          sx={(theme) => ({
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: alpha(theme.palette.primary.main, 0.85),
              transform: 'scale(1.05)',
            },
            '&:active': {
              color: alpha(theme.palette.primary.main, 0.85),
            },
            '&:focus': {
              color: 'white', // Reset to white when focus moves away
            },
            '&:focus:not(:hover)': {
              color: 'white', // Reset to white when no longer hovering
              transform: 'scale(1)',
            },
          })}
          onClick={() =>
            setSelectedIndex(
              selectedIndex - 1 >= 0 ? selectedIndex - 1 : herosData.length - 1
            )
          }
        >
          <ArrowBackIosIcon />
        </IconButton>
      )}

      <Button
        variant="contained"
        sx={(theme) => ({
          color: 'white',
          minWidth: '10rem', // Using rem for consistent width
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.85),
            transform: 'scale(1.05)',
          },
        })}
        onClick={() => {
          setSelectedHero(selectedIndex);
        }}
      >
        {hideNow ? skipLabel : selectLabel}
      </Button>

      {!hideNow && (
        <IconButton
          sx={(theme) => ({
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: alpha(theme.palette.primary.main, 0.85),
              transform: 'scale(1.05)',
            },
            '&:active': {
              color: alpha(theme.palette.primary.main, 0.85),
            },
            '&:focus': {
              color: 'white', // Reset to white when focus moves away
            },
            '&:focus:not(:hover)': {
              color: 'white', // Reset to white when no longer hovering
              transform: 'scale(1)',
            },
          })}
          onClick={() =>
            setSelectedIndex(
              selectedIndex + 1 < herosData.length ? selectedIndex + 1 : 0
            )
          }
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
});
