import { v4 as uuidv4 } from 'uuid';
import {
  IGameDataProvider,
  IGameModule,
  IGameSession,
  IUserProgress,
  IGameDataEvents
} from '../interfaces/IGameDataProvider';

/**
 * JSON file-based data provider for loading predefined games
 * Useful for static game content and demos
 */
export class JSONFileDataProvider implements IGameDataProvider {
  private basePath: string;
  private events: IGameDataEvents;
  private sessionCache = new Map<string, IGameSession>();
  private progressCache = new Map<string, IUserProgress>();

  constructor(basePath: string = '/games/', events: IGameDataEvents = {}) {
    this.basePath = basePath.endsWith('/') ? basePath : `${basePath}/`;
    this.events = events;
  }

  // Game data management
  async loadGame(gameId: string): Promise<IGameModule> {
    try {
      const response = await fetch(`${this.basePath}${gameId}/game.json`);
      if (!response.ok) {
        throw new Error(`Failed to load game ${gameId}: ${response.statusText}`);
      }
      const game = await response.json();

      // Validate required fields
      if (!game.moduleId || !game.settings || !game.trivia) {
        throw new Error(`Invalid game format for ${gameId}`);
      }

      return game;
    } catch (error) {
      throw new Error(`Failed to load game ${gameId}: ${error.message}`);
    }
  }

  async saveGame(game: IGameModule): Promise<void> {
    // JSON file provider is read-only for games
    // In a real implementation, this could POST to an API
    console.warn('JSONFileDataProvider: saveGame is not supported for static files');
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

    this.sessionCache.set(session.sessionId, session);
    return session;
  }

  async updateGameSession(session: IGameSession): Promise<void> {
    this.sessionCache.set(session.sessionId, { ...session });
    this.events.onSessionUpdated?.(session);
  }

  async getGameSession(sessionId: string): Promise<IGameSession | null> {
    return this.sessionCache.get(sessionId) || null;
  }

  // User progress
  async getUserProgress(userId: string): Promise<IUserProgress> {
    if (!this.progressCache.has(userId)) {
      this.progressCache.set(userId, {
        userId,
        completedGames: [],
        totalScore: 0,
        achievements: []
      });
    }
    return this.progressCache.get(userId)!;
  }

  async updateUserProgress(progress: IUserProgress): Promise<void> {
    this.progressCache.set(progress.userId, { ...progress });
    this.events.onProgressUpdated?.(progress);
  }

  // Asset loading
  async loadAsset(assetPath: string): Promise<string> {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    return `/assets/${cleanPath}`;
  }

  async loadModel(modelPath: string): Promise<string> {
    // Models are typically stored in a models subdirectory
    const cleanPath = modelPath.startsWith('/') ? modelPath.slice(1) : modelPath;
    return `/assets/models/${cleanPath}`;
  }

  async loadTexture(texturePath: string): Promise<string> {
    // Textures are typically stored in a textures subdirectory
    const cleanPath = texturePath.startsWith('/') ? texturePath.slice(1) : texturePath;
    return `/assets/textures/${cleanPath}`;
  }

  // Utility methods specific to JSON file provider
  async loadGameManifest(): Promise<{ games: Array<{ id: string; title: string; description: string }> }> {
    try {
      const response = await fetch(`${this.basePath}manifest.json`);
      if (!response.ok) {
        // Return empty manifest if not found
        return { games: [] };
      }
      return await response.json();
    } catch (error) {
      console.warn('Could not load game manifest:', error);
      return { games: [] };
    }
  }

  async preloadGameAssets(gameId: string): Promise<void> {
    try {
      const game = await this.loadGame(gameId);

      // Preload critical assets
      const preloadPromises: Promise<any>[] = [];

      // Preload avatars
      if (game.avatars) {
        game.avatars.forEach(avatar => {
          preloadPromises.push(this.loadModel(avatar.modelPath));
        });
      }

      // Preload obstacles
      if (game.obstacles) {
        game.obstacles.forEach(obstacle => {
          preloadPromises.push(this.loadModel(obstacle.modelPath));
        });
      }

      // Preload theme background
      if (game.theme?.background?.textures?.baseColor) {
        preloadPromises.push(this.loadTexture(game.theme.background.textures.baseColor));
      }

      await Promise.all(preloadPromises);
    } catch (error) {
      console.warn(`Failed to preload assets for game ${gameId}:`, error);
    }
  }
}
