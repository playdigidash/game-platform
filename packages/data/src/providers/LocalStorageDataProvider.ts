import { v4 as uuidv4 } from 'uuid';
import {
  IGameDataProvider,
  IGameModule,
  IGameSession,
  IUserProgress,
  IGameDataEvents
} from '../interfaces/IGameDataProvider';

/**
 * Local storage implementation of IGameDataProvider
 * Replaces MongoDB for open source version
 */
export class LocalStorageDataProvider implements IGameDataProvider {
  private events: IGameDataEvents;

  constructor(events: IGameDataEvents = {}) {
    this.events = events;
  }

  // Game data management
  async loadGame(gameId: string): Promise<IGameModule> {
    const stored = localStorage.getItem(`digidash_game_${gameId}`);
    if (!stored) {
      throw new Error(`Game ${gameId} not found`);
    }
    return JSON.parse(stored);
  }

  async saveGame(game: IGameModule): Promise<void> {
    localStorage.setItem(`digidash_game_${game.moduleId}`, JSON.stringify(game));
    this.events.onGameUpdated?.(game.moduleId, game);
  }

  // Session management
  async createGameSession(gameId: string, userId?: string): Promise<IGameSession> {
    const session: IGameSession = {
      sessionId: uuidv4(),
      gameId,
      userId: userId || `anonymous_${Date.now()}`,
      startTime: Date.now(),
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      questions: {}
    };

    localStorage.setItem(`digidash_session_${session.sessionId}`, JSON.stringify(session));
    return session;
  }

  async updateGameSession(session: IGameSession): Promise<void> {
    localStorage.setItem(`digidash_session_${session.sessionId}`, JSON.stringify(session));
    this.events.onSessionUpdated?.(session);
  }

  async getGameSession(sessionId: string): Promise<IGameSession | null> {
    const stored = localStorage.getItem(`digidash_session_${sessionId}`);
    return stored ? JSON.parse(stored) : null;
  }

  // User progress
  async getUserProgress(userId: string): Promise<IUserProgress> {
    const stored = localStorage.getItem(`digidash_progress_${userId}`);
    return stored ? JSON.parse(stored) : {
      userId,
      completedGames: [],
      totalScore: 0,
      achievements: []
    };
  }

  async updateUserProgress(progress: IUserProgress): Promise<void> {
    localStorage.setItem(`digidash_progress_${progress.userId}`, JSON.stringify(progress));
    this.events.onProgressUpdated?.(progress);
  }

  // Asset loading (local files)
  async loadAsset(assetPath: string): Promise<string> {
    // For local assets, return the public path
    // In production, this could check if file exists
    return `/assets/${assetPath}`;
  }

  async loadModel(modelPath: string): Promise<string> {
    return `/assets/models/${modelPath}`;
  }

  async loadTexture(texturePath: string): Promise<string> {
    return `/assets/textures/${texturePath}`;
  }

  // Utility methods
  getAllGameIds(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith('digidash_game_'))
      .map(key => key.replace('digidash_game_', ''));
  }

  getAllSessions(): IGameSession[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith('digidash_session_'))
      .map(key => JSON.parse(localStorage.getItem(key)!));
  }

  clearAllData(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('digidash_')) {
        localStorage.removeItem(key);
      }
    });
  }
}
