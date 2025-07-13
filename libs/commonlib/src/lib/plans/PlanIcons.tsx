import React from 'react';
import { 
  SportsEsports,
  AccessibilityNew,
  Quiz,
  Palette,
  BarChart,
  Security,
  Groups,
  SupportAgent,
  Create,
  Architecture
} from '@mui/icons-material';

// Import the FEATURE_GROUPS to ensure consistent naming
import { FEATURE_GROUPS } from './PlanDefinition';

// Define the group icons to be reused across components
export const GROUP_ICONS: Record<string, React.ReactNode> = {
  [FEATURE_GROUPS.GAMEPLAY]: <SportsEsports />,
  [FEATURE_GROUPS.HEROES]: <AccessibilityNew />,
  [FEATURE_GROUPS.TRIVIA]: <Quiz />,
  [FEATURE_GROUPS.BRANDING]: <Palette />,
  [FEATURE_GROUPS.ANALYTICS]: <BarChart />,
  [FEATURE_GROUPS.SECURITY]: <Security />,
  [FEATURE_GROUPS.TEAMS]: <Groups />,
  [FEATURE_GROUPS.SUPPORT]: <SupportAgent />,
  [FEATURE_GROUPS.CONTENT]: <Create />,
  [FEATURE_GROUPS.ADVANCED]: <Architecture />
}; 