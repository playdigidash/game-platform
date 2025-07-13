import { SxProps, Theme } from '@mui/material';
import { ICustomModule } from '@lidvizion/commonlib';

// Component interfaces
export interface GameLibraryHeaderProps {
  selectedCategory: string | null;
  showFilterDropdown: boolean;
  onFilterToggle: (event: React.MouseEvent) => void;
  onCategorySelect: (categoryId: string) => void;
  onResetFilter: () => void;
  onClickAway: () => void;
}

export interface FilterDropdownProps {
  open: boolean;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  onResetFilter: () => void;
  onClickAway: () => void;
}

export interface GameGridProps {
  games: ICustomModule[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  onGameSelect: (game: ICustomModule) => void;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus: () => void;
  onSearchToggle: () => void;
  showSearch: boolean;
  isDesktop: boolean;
}

export interface GameLibraryAppBarProps {
  onBackClick: () => void;
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus: () => void;
  onSearchToggle: () => void;
  showSearch: boolean;
  isDesktop: boolean;
}

export interface UserNameDisplayProps {
  displayName: string;
}

export interface ContentContainerProps {
  children: React.ReactNode;
}

// Data interfaces
export interface ICategory {
  id: string;
  name: string;
  iconType: string;
}

// Constants
export const CATEGORIES: ICategory[] = [
  { id: 'games', name: 'Games', iconType: 'games' },
  { id: 'education', name: 'Education', iconType: 'education' },
  { id: 'cognitive', name: 'Cognitive', iconType: 'cognitive' },
  { id: 'physical', name: 'Physical', iconType: 'physical' },
  { id: 'science', name: 'Science', iconType: 'science' },
  { id: 'music', name: 'Music', iconType: 'music' },
  { id: 'geography', name: 'Geography', iconType: 'geography' },
  { id: 'math', name: 'Math', iconType: 'math' }
];

// Instead of using JSX directly, we'll use a mapping of icon types to icon names
export const ICON_TYPES = {
  games: 'SportsEsportsIcon',
  education: 'SchoolIcon',
  cognitive: 'PsychologyIcon',
  physical: 'DirectionsRunIcon',
  science: 'ScienceIcon',
  music: 'MusicNoteIcon',
  geography: 'PublicIcon',
  math: 'CalculateIcon'
};

export const SUBCATEGORY_TO_CATEGORY: { [key: string]: string } = {
  'arcade': 'games',
  'puzzle': 'games',
  'strategy': 'games',
  'adventure': 'games',
  'language': 'education',
  'history': 'education',
  'literature': 'education',
  'memory': 'cognitive',
  'attention': 'cognitive',
  'problem-solving': 'cognitive',
  'fitness': 'physical',
  'coordination': 'physical',
  'biology': 'science',
  'chemistry': 'science',
  'physics': 'science',
  'instruments': 'music',
  'theory': 'music',
  'composition': 'music',
  'countries': 'geography',
  'capitals': 'geography',
  'landmarks': 'geography',
  'arithmetic': 'math',
  'algebra': 'math',
  'geometry': 'math'
};

export const SAMPLE_TAGS: { [key: string]: string } = {
  'tag1': 'Multiplayer',
  'tag2': 'Single Player',
  'tag3': 'Educational',
  'tag4': 'Puzzle',
  'tag5': 'Strategy',
  'tag6': 'Adventure',
  'tag7': 'Arcade',
  'tag8': 'Simulation',
  'tag9': 'Role-Playing',
  'tag10': 'Action',
  'tag11': 'Sports',
  'tag12': 'Racing',
  'tag13': 'Card Game',
  'tag14': 'Board Game',
  'tag15': 'Word Game',
  'tag16': 'Trivia',
  'tag17': 'Music',
  'tag18': 'Art',
  'tag19': 'Science',
  'tag20': 'Math'
};

// Styles
export const categoryBubbleStyles = (isSelected: boolean): SxProps<Theme> => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  backgroundColor: isSelected ? 'secondary.main' : 'rgba(255, 255, 255, 0.1)',
  color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.8)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  gap: '0.25rem',
  fontSize: 'clamp(0.625rem, 0.8vw, 0.75rem)',
  width: '100%',
  height: '100%',
  '&:hover': {
    backgroundColor: isSelected ? 'secondary.dark' : 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)'
  }
});

export const scrollableContainerStyles: SxProps<Theme> = {
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
  '&::-webkit-scrollbar': {
    width: '0.4rem'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '0.2rem'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(255, 255, 255, 0.5)'
  }
};

export type StyleObject = SxProps<Theme>; 