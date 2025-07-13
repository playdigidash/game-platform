import { Theme } from '@mui/material';
import { ICustomModule, 
  IPageModel
 } from '@lidvizion/commonlib';
import { PagesViewStore } from './PagesViewStore';

export interface PagesHeaderProps {
  page: IPageModel;
  theme: Theme;
}

export interface GamesSectionProps {
  store: PagesViewStore;
  onGameClick: (game: ICustomModule) => void;
}

export interface FeaturedGamesProps {
  games: ICustomModule[];
  onGameClick: (game: ICustomModule) => void;
}

export interface AboutSectionProps {
  page: IPageModel;
} 