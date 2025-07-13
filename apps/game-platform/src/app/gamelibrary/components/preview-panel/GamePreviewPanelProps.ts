import { ICustomModule } from '@lidvizion/commonlib';

// Props interface
export interface GamePreviewPanelProps {
  open: boolean;
  onClose: () => void;
}

// Default image as a constant URL
export const DEFAULT_GAME_IMAGE = '/assets/images/dd-logo-white500x500.svg';

// Feature section icons
export interface FeatureSectionIcon {
  icon: React.ReactNode;
  title: string;
}

// Game feature types
export interface GameFeature {
  items: any[];
  title: React.ReactNode;
  namePrefix: string;
}

// Game data interface
export interface GameData {
  title: string;
  description: string;
  imageUrl: string;
  // creator: string;
  features: GameFeature[];
} 