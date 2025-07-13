export interface MusicControlProps {
  volume: number;
  isMusicChecked: boolean;
  handleMusicToggle: (checked: boolean) => void;
  handleVolumeChange: (volume: number) => void;
}

export interface SoundEffectsControlProps {
  soundEffectsVolume: number;
  isSoundEffectsChecked: boolean;
  handleSoundEffectsToggle: (checked: boolean) => void;
  handleSoundEffectsVolumeChange: (volume: number) => void;
}

export interface ToggleControlProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
} 