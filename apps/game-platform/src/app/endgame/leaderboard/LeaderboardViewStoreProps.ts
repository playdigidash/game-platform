import { IGameProfile } from '@lidvizion/commonlib';

/**
 * Extended IGameProfile interface with additional properties for leaderboard display
 */
export interface ExtendedGameProfile extends IGameProfile {
  /**
   * Flag to indicate if this is the current user's latest attempt
   */
  isLatestAttempt?: boolean;
}

/**
 * Extended part interface with additional properties for leaderboard display
 */
export interface ExtendedPart {
  part: number;
  score: number;
  isLatestAttempt?: boolean;
} 