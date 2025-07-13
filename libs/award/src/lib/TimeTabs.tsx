import { Tabs, Tab } from '@mui/material';
import { observer } from 'mobx-react';
import { CurrentTimeTab } from './stores/AwardViewStore';
import { useStore } from './stores/Store';

export const TimeTabs: React.FC = observer(() => {
  // const { 
  //     handleTimeTabChange,
  //     currentActiveTimeTab
  //   } = useStore().awardsViewStore;

  return (
    <Tabs
      sx={{
        margin: 2,
        display: 'flex',
        flex: 1,
      }}
      // value={currentActiveTimeTab}
      // onChange={handleTimeTabChange}
      aria-label="leaderboard-date-tabs"
    >
      <Tab label="All Time" value={CurrentTimeTab.allTime} />
      {/* TODO: create query for these
      <Tab label="Month" value={CurrentTimeTab.month} />
      <Tab label="Week" value={CurrentTimeTab.week} /> */}
    </Tabs>
  );
});
