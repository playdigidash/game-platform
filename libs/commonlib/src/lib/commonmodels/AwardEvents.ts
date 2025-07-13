import { Instance, types } from 'mobx-state-tree';
import firstLoginBadge from './assets/firstLoginBadge.svg';
import firstScanBadge from './assets/firstScanBadge.svg';
import anotherScanBadge from './assets/anotherScanBadge.svg';
import firstRespShrBadge from './assets/firstRespShrBadge.svg';
import firstUpdateShrBadge from './assets/firstUpdateShrBadge.svg';
import newUpdateShrBadge from './assets/firstUpdateShrBadge.svg';
import repeatUpdateShrBadge from './assets/firstUpdateShrBadge.svg';
import newResponseShrBadge from './assets/firstUpdateShrBadge.svg';
import dailyLogBadge from './assets/firstLoginBadge.svg';
import loginStreakWkBadge from './assets/newResShrBadge.svg';
import loginStreakMthBadge from './assets/newResShrBadge.svg';
import loginStreakYrBadge from './assets/newResShrBadge.svg';
import appTime1hBadge from './assets/anotherScanBadge.svg';
import appTime1dBadge from './assets/anotherScanBadge.svg';
import appTime1mBadge from './assets/anotherScanBadge.svg';
import appFeedbackBadge from './assets/firstLoginBadge.svg';

export enum EventWeight {
  weight1 = 1,
  weight5 = 5,
  weight10 = 10,
  weight25 = 25,
  weight50 = 50,
  weight100 = 100,
  weight200 = 200,
  weight250 = 250,
  weight500 = 500,
  weight1000 = 1000,
  weight10000 = 10000,
}

export enum EventLevel {
  Gold = '#FFD700',
  Silver = '#C0C0C0',
  Bronze = '#CD7F32',
}

export interface AwardEvent {
  title: string
  id: number
  date: Date | null
  description: string | null
  weight: number
  icon: string
  hasUserEarned: boolean
  level:EventLevel
}  

export interface PointEventModel {
  title: string
  weight: number
  icon: string
  date: Date | null
}

export const firstLoginEvt = {
  title: 'First Login',
  weight: EventWeight.weight25,
  icon: firstLoginBadge,
}

export const AllPointEventModel = {
  appFeedback: {
    title: 'App Feedback',
    weight: EventWeight.weight10,
    icon: appFeedbackBadge,
  },
  responseShare: {
    title: 'Response Share',
    weight: EventWeight.weight10,
    icon: appFeedbackBadge,
  },
  updateShare: {
    title: 'News Update Share',
    weight: EventWeight.weight10,
    icon: appFeedbackBadge,
  },
  dailyLog: {
    title: 'daily login',
    weight: EventWeight.weight10,
    icon: dailyLogBadge,
  },
}

export const theScanner25 = {
  title: 'The Scanner',
  id: 0,
  icon: firstRespShrBadge,
  description: 'Scan 25 items',
  weight: EventWeight.weight1,
  level: EventLevel.Bronze,
}

export const theScanner100 = {
  title: 'The Experienced Scanner',
  id: 1,
  icon: firstRespShrBadge,
  description: 'Scan 100 items',
  weight: EventWeight.weight1,
  level: EventLevel.Silver,
}

export const theScanner500 = {
  title: 'The Master Scanner',
  icon: firstRespShrBadge,
  id: 2,
  description: 'Scan 500 items',
  weight: EventWeight.weight1,
  level: EventLevel.Gold,
}

export const weekendScanner25 = {
  title: 'Weekend Scanner',
  id: 3,
  description: 'Scan 25 items during the weekend',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Bronze,
}

export const weekendScanner100 = {
  title: 'Weekend Experienced Scanner',
  id: 4,
  description: 'Scan 100 items during the weekend',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Silver,
}


export const weekendScanner500 = {
  title: 'Weekend Master Scanner',
  id: 5,
  description: 'Scan 500 items during the weekend',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Gold,
}

export const consistentLoginWeek = {
  title: 'Consistency is Key (Week)',
  id: 6,
  description: 'Login every day for a Week',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Bronze,
}

export const consistentLoginMonth = {
  title: 'Consistency is Key (Month)',
  icon: firstRespShrBadge,
  description: 'Login every day for a Month',
  weight: EventWeight.weight1,
  level: EventLevel.Silver,
  id: 7,
}

export const consistentLoginYr = {
  title: 'Consistency is Key (Year)',
  id: 8,
  description: 'Login every day for a Year',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Gold,
}

export const weekendWarrior24 = {
  title: 'Weekend Warrior',
  id: 9,
  description: '24 hours app time total on the weekend',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Bronze,
}

export const weekendWarrior72 = {
  title: 'Weekend Warrior',
  id: 10,
  description: '72 hours app time total on the weekend',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Silver,
}

export const weekendWarrior144 = {
  title: 'Weekend Warrior',
  id: 11,
  description: '144 hours app time total on the weekend',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Bronze,
}

export const multiMatChamp1 = {
  title: 'Multi-Material Champ',
  id: 12,
  description: '5 different material type responses in one day',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Bronze,
}

export const multiMatChamp2 = {
  title: 'Multi-Material Champ',
  id: 13,
  description: '5 different material type responses per day for a week!',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Silver,
}

export const multiMatChamp3 = {
  title: 'Multi-Material Champ',
  id: 14,
  description: '5 different material type responses per day for a month!',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Gold,
}

export const itemMaster = {
  title: 'Item Master',
  id: 15,
  description: 'Viewed a Response for each item in Search',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Gold,
}

export const teamPlayer2 = {
  title: 'Team Player 2',
  id: 16,
  description: 'Submit 10 feedback tickets',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Silver,
}

export const teamPlayer3 = {
  title: 'Team Player 3',
  id: 17,
  description: 'Submit 25 feedback tickets',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Gold,
}

export const teamPlayer1Award = {
  title: 'Team Player',
  id: 18,
  description: 'Submit 5 feedback tickets',
  icon: firstRespShrBadge,
  weight: EventWeight.weight1,
  level: EventLevel.Bronze,
}

// export const AllRewardEvents = types.array(AwardEvent).create([
//     teamPlayer1Award,
//     teamPlayer2,
//     teamPlayer3,
//     multiMatChamp1,
//     multiMatChamp2,
//     multiMatChamp3,
//     weekendScanner100,
//     weekendScanner25,
//     weekendScanner500,
//     weekendWarrior144,
//     weekendWarrior24,
//     weekendWarrior72,
//     consistentLoginMonth,
//     consistentLoginWeek,
//     consistentLoginYr,
//     theScanner100,
//     theScanner25,
//     theScanner500
// ])
