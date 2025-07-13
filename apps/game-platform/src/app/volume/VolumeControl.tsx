import React, { useState, useRef } from 'react';
import { IconButton, Tooltip, Box, Slider, ClickAwayListener } from '@mui/material';
import { VolumeUp, VolumeDown, VolumeOff } from '@mui/icons-material';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react';

const VolumeControl: React.FC = observer(() => {
  const { isMasterAudioEnabled, volume, handleVolumeChange } = useGameStore().settingsViewStore;
  const [showSlider, setShowSlider] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousVolume = useRef(volume);
  const { settingsViewStore } = useGameStore();


  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeOff />;
    if (volume < 50) return <VolumeDown />;
    return <VolumeUp />;
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowSlider(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowSlider(false);
    }, 1000);
  };

  const handleClickAway = () => {
    setShowSlider(false);
  };

  const handleVolumeIconClick = () => {
    if (volume === 0) {
      // Unmute: restore to previous volume or default to 50%
      handleVolumeChange(previousVolume.current || 50);
      settingsViewStore.handleMasterAudioToggle(true);
    } else {
      // Mute: save current volume and set to 0
      previousVolume.current = volume;
      handleVolumeChange(0);
      settingsViewStore.handleMasterAudioToggle(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            transform: showSlider ? 'translateX(0)' : 'translateX(calc(100% - 3rem))',
            width: showSlider ? '12.5rem' : '3rem',
          }}
        >
          <Tooltip title={`Volume: ${Math.round(volume)}%`}>
            <IconButton
              onClick={handleVolumeIconClick}
              size="small"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '2px',
                '&:hover': {
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '2rem',
                },
              }}
            >
              {getVolumeIcon()}
            </IconButton>
          </Tooltip>

          <Slider
            value={volume}
            onChange={(_, value) => handleVolumeChange(value as number)}
            aria-label="Volume"
            min={0}
            max={100}
            sx={{
              width: '7.5rem',
              ml: 1,
              color: 'white',
              opacity: showSlider ? 1 : 0,
              transition: 'opacity 0.3s ease',
              '& .MuiSlider-thumb': {
                width: '0.75rem',
                height: '0.75rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 0 0 0.5rem rgba(255, 255, 255, 0.16)',
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.28,
              },
            }}
          />
        </Box>
      </Box>
    </ClickAwayListener>
  );
});

export default VolumeControl;
