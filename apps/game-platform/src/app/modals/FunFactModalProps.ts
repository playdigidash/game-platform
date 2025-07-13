import { FunFact } from '@lidvizion/commonlib';

export interface FunFactModalProps {
  showFunFactModal: boolean;
  currentFunFact: FunFact | null;
  setShowFunFactModal: (show: boolean) => void;
  canCloseFunFact: boolean;
}


export interface ObstacleFunFacts {
  [obstacleType: string]: FunFact[];
} 