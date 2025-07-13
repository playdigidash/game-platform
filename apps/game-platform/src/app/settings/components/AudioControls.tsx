import { Slider, Switch, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { VolumeUp, VolumeDown, VolumeOff, NotificationsActive, NotificationsOff } from '@mui/icons-material';
import { MusicControlProps, SoundEffectsControlProps, ToggleControlProps } from './AudioControlsProps';

// Extracted component for volume controls with icon header
const VolumeControlHeader = ({ 
  Icon, 
  label, 
  isChecked, 
  onToggle 
}: { 
  Icon: React.ReactNode; 
  label: string; 
  isChecked: boolean; 
  onToggle: (checked: boolean) => void 
}) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '0.5rem' 
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {Icon}
      <Typography variant="body1">{label}</Typography>
    </div>
    <Switch
      checked={isChecked}
      onChange={(e) => onToggle(e.target.checked)}
    />
  </div>
);

// Extracted component for volume slider with percentage
const VolumeSlider = ({ 
  value, 
  isEnabled, 
  onChange 
}: { 
  value: number; 
  isEnabled: boolean; 
  onChange: (value: number) => void 
}) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    width: '100%', 
    opacity: isEnabled ? 1 : 0.5 
  }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      width: '100%', 
      gap: '1rem' 
    }}>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        aria-label="Volume Control"
        disabled={!isEnabled}
        min={0}
        max={100}
        sx={{
          flex: 1,
          color: theme => theme.palette.primary.main,
          '& .MuiSlider-thumb': {
            width: '0.75rem',
            height: '0.75rem',
            transition: 'all 0.2s ease',
          },
          '& .MuiSlider-rail': {
            opacity: 0.28,
          },
        }}
      />
      <div style={{ 
        minWidth: '2.5rem', 
        textAlign: 'center',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem'
      }}>
        {Math.round(value)}%
      </div>
    </div>
  </div>
);

export const MusicControl = observer(({ 
  volume, 
  isMusicChecked, 
  handleMusicToggle, 
  handleVolumeChange 
}: MusicControlProps) => {
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeOff />;
    if (volume < 50) return <VolumeDown />;
    return <VolumeUp />;
  };

  return (
    <div style={{ width: '100%' }}>
      <VolumeControlHeader 
        Icon={getVolumeIcon()} 
        label="Music" 
        isChecked={isMusicChecked} 
        onToggle={handleMusicToggle} 
      />
      
      <VolumeSlider 
        value={volume} 
        isEnabled={isMusicChecked} 
        onChange={handleVolumeChange} 
      />
    </div>
  );
});

export const SoundEffectsControl = observer(({ 
  soundEffectsVolume, 
  isSoundEffectsChecked, 
  handleSoundEffectsToggle, 
  handleSoundEffectsVolumeChange 
}: SoundEffectsControlProps) => {
  const getSoundEffectsIcon = () => {
    return isSoundEffectsChecked ? <NotificationsActive /> : <NotificationsOff />;
  };

  return (
    <div style={{ width: '100%' }}>
      <VolumeControlHeader 
        Icon={getSoundEffectsIcon()} 
        label="Sound Effects" 
        isChecked={isSoundEffectsChecked} 
        onToggle={handleSoundEffectsToggle} 
      />
      
      <VolumeSlider 
        value={soundEffectsVolume} 
        isEnabled={isSoundEffectsChecked} 
        onChange={handleSoundEffectsVolumeChange} 
      />
    </div>
  );
});

export const ToggleControl = ({ label, checked, onChange }: ToggleControlProps) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    <Typography variant="body1">{label}</Typography>
    <Switch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  </div>
); 