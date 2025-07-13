import { Instance, types } from 'mobx-state-tree';

import moment from 'moment';

export enum BottomPanels {
  points = 'points',
  badges = 'badges',
  stats = 'stats',
}

export enum CurrentTimeTab {
  today = 'today',
  week = 'week',
  month = 'month',
  allTime = 'all time',
}

export const HistoryModel = types.model({
  title: '',
  date: types.maybeNull(types.Date),
  points: types.maybeNull(types.number),
});

export const AwardsViewStore = types
  .model('AwardsViewStore', {
    // currentActiveBottomPanel: types.optional(
    //   types.enumeration('currentActive', [
    //     BottomPanels.points,
    //     BottomPanels.badges,
    //     BottomPanels.stats,
    //   ]),
    //   BottomPanels.stats
    // ),
    // currentActiveTimeTab: types.optional(
    //   types.enumeration('currentActive', [
    //     CurrentTimeTab.today,
    //     CurrentTimeTab.week,
    //     CurrentTimeTab.month,
    //     CurrentTimeTab.allTime,
    //   ]),
    //   CurrentTimeTab.allTime
    // ),
    // topOfLeaderboard: types.optional(types.array(LeaderboardUserModel), []),
    // history: types.optional(types.array(HistoryModel), [
    //   {
    //     title: 'First Scan',
    //     date: moment(new Date()).subtract(15).toDate(),
    //     points: 25,
    //   },
    //   {
    //     title: 'Daily Check-in',
    //     date: moment(new Date()).subtract(45).toDate(),
    //     points: 1,
    //   },
    //   {
    //     title: 'Quiz Points',
    //     date: moment(new Date()).subtract(70).toDate(),
    //     points: 10,
    //   },
    // ]),
    // leaderboardUser: types.maybeNull(LeaderboardUserModel),
  })
  // .actions((self) => ({
  //   setCurrentActiveBottomPanel: (active: BottomPanels) => {
  //     self.currentActiveBottomPanel = active;
  //   },
  //   addHistory: (history: IHistoryModel) => {
  //     self.history.push(history);
  //   },
  //   handleTimeTabChange: (
  //     event: React.SyntheticEvent<Element, Event>,
  //     tab: CurrentTimeTab
  //   ) => {
  //     self.currentActiveTimeTab = tab;
  //   },
  //   setLeaderboardUser: (user: ILeaderboardUserModel) => {
  //     self.leaderboardUser = user;
  //   },
  // }));


