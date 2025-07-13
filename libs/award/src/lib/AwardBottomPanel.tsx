import {
  // IAwardEvent,
  ICurrentUserModel,
  ILeaderboardUserModel,
  // LeaderboardUserModel,
} from '@lidvizion/commonlib';
import { Box } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { BadgePanel } from './badge/BadgePanel';
import { Leaderboard } from './Leaderboard';
import { PointsPanel } from './PointsPanel';
// import { Statistics } from './Statistics';

import { BottomPanels } from './stores/AwardViewStore';
import { useStore } from './stores/Store';

export interface IAwardBottomPanel {
  user: ICurrentUserModel;
  leaderboardList: ILeaderboardUserModel[];
  // allRewardEvents: IAwardEvent[];
}

export const AwardBottomPanel: React.FC<IAwardBottomPanel> = observer(
  ({ user, leaderboardList, 
    // allRewardEvents 
  }) => {
    // const { currentActiveBottomPanel, setLeaderboardUser, leaderboardUser } =
    //   useStore().awardsViewStore;

    useEffect(() => {
      if (user && user.stats) {
        // setLeaderboardUser(
        //   LeaderboardUserModel.create({
        //     name: user.displayName,
        //     points: user.stats.totalPoints,
        //     id: user.uid,
        //     currentRank: 0,
        //     icon: user.icon,
        //   })
        // );
      }
    }, [user]);

    return (
      <>
        {/* {currentActiveBottomPanel === BottomPanels.badges && (
          <BadgePanel allRewardEvents={allRewardEvents} />
        )}
        {currentActiveBottomPanel === BottomPanels.points &&
          leaderboardUser && (
            <Leaderboard
              leaderboardList={leaderboardList}
              currentLeaderboardUser={leaderboardUser}
            />
          )} */}
        {/* {currentActiveBottomPanel === BottomPanels.stats && (
          <Statistics user={user} />
        )} */}
      </>
    );
  }
);
