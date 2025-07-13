import { ProviderType } from 'realm-web';
import { EObstacleModelType, IDbQuestion } from '@lidvizion/commonlib';
import { Vector3 } from 'three';

export interface IGameSessionQuestions {
  [id: string]: {
    id: string;
    tries: number;
    played: boolean;
    reviewed?: boolean;
    reviewAnalytics?: IQuestionReviewAnalytics;
    bonusPoints?: number;
    speedBonus?: number;
    viewedSections?: IViewedSections;
  };
}

export type ObstacleType = {
  id?: number | null;
  position: Vector3;
  boxArg: Vector3;
  texture?: string;
  type: EObstacleModelType;
  instance?: IObstacleInstance | null;
  alreadyUsed?: boolean;
  glowColor?: string;
  text?: string;
};

export interface ILayerObstacle {
  position: Vector3;
  boxArg: Vector3;
  type: EObstacleModelType;
  id: number | null;
  instance: IObstacleInstance | null;
  glowColor?: string;
}

export interface IObstacleLayer {
  obstacles: ILayerObstacle[];
  layerUsed: boolean;
  layerType: EObstacleLayerType;
}

export enum IDirection {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
  enter = 'enter',
  hint = 'hint',
  coin = 'coin',
}

export type ObsProps = {
  removeItem: (id: number) => void;
  solvedItem: (id: number) => void;
  id: number;
  laneSize: number;
  args: any;
  direction: IDirection;
  type: 'obstacle' | 'hint' | 'coin';
};

export interface IObstacleInstance extends THREE.Group {
  userData: {
    id: string;
    type: EObstacleModelType;
    isCustom: boolean;
  };
}

export enum EObstaclePlacementOptions {
  leftGround = 'leftGround',
  middleGround = 'middleGround',
  rightGround = 'rightGround',
  leftAir = 'leftAir',
  rightAir = 'rightAir',
  middleAir = 'middleAir',
}

interface IObstacleSizeValue {
  size: Vector3;
  placementOptions: Vector3[];
}

export type IObstacleSizeMap = {
  [key in EObstacleModelType]: IObstacleSizeValue;
};

export enum EObstacleLayerType {
  tutorial = 'tutorial',
  sponsor = 'sponsor',
  regular = 'regular',
  hint = 'hint',
}

export interface ILayerObstacle {
  position: Vector3;
  boxArg: Vector3;
  type: EObstacleModelType;
}

export interface IViewedSections {
  explanation: boolean;
  hints: { [key: string]: boolean };
  source: boolean;
}

export enum ILeaderboardProfileType {
  today = 'today',
  allTime = 'allTime',
}

export interface IGameSession {
  providerType: ProviderType;
  sessionId: string;
  ip: string;
  questAttempt: number;
  questPart: number;
  startTime: number;
  endTime: number | null;
  totalDuration?: number;
  questions: IGameSessionQuestions;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy?: number;
  score: number;
  coins: number;
  selectedHero: string;
  uid?: string;
  gameId: string;
  gameUrl: string;
  deviceInfo?: string;
  status?: 'active' | 'completed' | 'abandoned';
  gameMode?: string;
  isHighScore?: boolean;
  gameCreatoruid?: string;
  isCompleted?: boolean;
  gameEntryTime?: number;
  actions?: IGameSessionAction[]; // Track actions taken during this session
  bonusPoints?: number;
  speedBonus?: number;
}

export interface IViewSession {
  start: number;
  stop: number;
}

export interface IQuestionReviewAnalytics {
  explanationViewSessions: IViewSession[];
  hintViewSessions: { [hintId: string]: IViewSession[] };
  sourceViewSessions: IViewSession[];
}

export interface IGameData {
  reviewLabel: string;
  questionsCompletedLabel: string;
  restartQuestLabel: string;
  nextDashLabel: string;
  reviewBonusLabel: string;
  questions: { [key: string]: any };
  heroes: any[];
}

export interface IReviewedQuestion extends IDbQuestion {
  reviewed: boolean;
  reviewAnalytics?: IQuestionReviewAnalytics;
  viewedSections: {
    explanation: boolean;
    hints: { [hintId: string]: boolean };
    source: boolean;
  };
}

export interface IDBObsInstance {
  id: string;
  obsType: EObstacleModelType;
  isCustom: boolean;
  res: {
    scene: THREE.Group;
  };
}

export interface IReviewProgress {
  questionsReviewed: number;
  totalQuestions: number;
  bonusGiven: boolean;
  sectionsViewed: {
    [questionId: string]: {
      explanation: boolean;
      hints: { [hintId: string]: boolean };
      source: boolean;
    };
  };
}

export interface IGameSessionAction {
  actionId: string;
  completed: boolean;
  completedAt?: Date;
  pointsEarned?: number;
  type?: string; // 'code', 'redirect', etc.
}

export interface IQuestData {
  questAttempt: number;
}

export interface IGameProfileParts {
  score: number;
  part: number;
}

export interface IGameProfile {
  displayName: string;
  score: number;
  uid: string;
  type: ILeaderboardProfileType;
  parts?: IGameProfileParts[];
  partScore?: number;
}
