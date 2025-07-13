import React from 'react';
import './award.scss';
import { Box } from '@mui/material';
import { Topbar } from '@lidvizion/topbar';
import {
  // IAwardEvent,
  ICurrentUserModel,
  ILeaderboardUserModel,
} from '@lidvizion/commonlib';
import { AwardTopPanel } from './AwardTopPanel';
import { store, StoreContext } from './stores/Store';
import { AwardBottomPanel } from './AwardBottomPanel';
import { observer } from 'mobx-react';

export interface IAwardProps {
  user: ICurrentUserModel;
  leaderboardList: ILeaderboardUserModel[];
  // allRewardEvents: IAwardEvent[];
}

export const Award: React.FC<IAwardProps> = observer(
  ({
    user,
    leaderboardList,
    // allRewardEvents
  }) => {
    return (
      <StoreContext.Provider value={store}>
        <Box
          component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <Box component="div">
            <Topbar title={'Awards'} />
          </Box>
          {/* <AwardTopPanel user={user} />
          <AwardBottomPanel
            leaderboardList={leaderboardList}
            user={user}
            allRewardEvents={allRewardEvents}
          /> */}
        </Box>
      </StoreContext.Provider>
    );
  }
);

export default Award;
