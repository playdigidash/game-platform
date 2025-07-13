import { Tabs, Tab, useTheme } from '@mui/material';
import { observer } from 'mobx-react';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CampaignIcon from '@mui/icons-material/Campaign';
import SettingsIcon from '@mui/icons-material/Settings';
import { useGameStore } from '../RootStore/RootStoreProvider';

export const PauseMenuTabs: React.FC = observer(() => {
  const theme = useTheme();
  const { pauseMenuTabIdx, setPauseMenuTabIdx } =
    useGameStore().gamePlayViewStore;

  return (
    <Tabs
      value={pauseMenuTabIdx}
      variant="scrollable"
      allowScrollButtonsMobile
      scrollButtons={true}
      onChange={(e, val) => {
        setPauseMenuTabIdx(val);
      }}
      sx={{
        '& .MuiTabs-indicator': {
          backgroundColor: theme.palette.primary.main, // Tab indicator color
        },
        '& .MuiTab-root': {
          backgroundColor: 'transparent',
          color: theme.palette.primary.contrastText, // Dimmed color for inactive icons
          opacity: 0.6, // Dimmed color for inactive tabs
          '&.Mui-selected': {
            color: theme.palette.primary.contrastText, // White color for the selected tab
            opacity: 1,
          },
          '& .MuiTab-wrapper > *:first-of-type': {
            color: theme.palette.primary.contrastText, // Dimmed color for inactive icons
            opacity: 0.6,
          },
          '&.Mui-selected .MuiTab-wrapper > *:first-of-type': {
            color: theme.palette.primary.contrastText, // White color for the selected icon
          },
        },
      }}
    >
      <Tab 
      // label="Settings" 
      icon={<SettingsIcon />} iconPosition="start" />
      <Tab
        // label="How to Play"
        icon={<QuestionMarkIcon />}
        iconPosition="start"
      />
      <Tab 
      // label="Feedback" 
      icon={<CampaignIcon />} iconPosition="start" />
    </Tabs>
  );
});
