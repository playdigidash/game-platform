// Core data interfaces for Digi Dash open source
export interface IGameModule {
  moduleId: string;
  settings: IGameSettings;
  trivia: ITrivia[];
  obstacles?: IObstacle[];
  avatars?: IAvatar[];
  sponsors?: ISponsor[];
  theme?: IGameTheme;
}

export interface IGameSettings {
  gTitle: string;
  gDesc: string;
  music: boolean;
  limit: number;
  random: boolean;
  url?: string;
}

export interface ITrivia {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
  source?: string;
  hints?: string[];
  category?: string;
}

export interface IObstacle {
  id: string;
  type: 'dodge' | 'jump' | 'slide';
  modelPath: string;
  name: string;
  funFact?: string;
}

export interface IAvatar {
  id: string;
  name: string;
  modelPath: string;
  animationPaths?: string[];
}

export interface ISponsor {
  id: string;
  name: string;
  imagePath: string;
  url?: string;
}

export interface IGameTheme {
  background: {
    textures: {
      baseColor: string;
    };
  };
  colors?: {
    primary: string;
    secondary: string;
  };
}

export interface IGameSession {
  sessionId: string;
  gameId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  questions: Record<string, boolean>;
}

export interface IUserProgress {
  userId: string;
  completedGames: string[];
  totalScore: number;
  achievements: string[];
}

// Main data provider interface
export interface IGameDataProvider {
  // Game data
  loadGame(gameId: string): Promise<IGameModule>;
  saveGame(game: IGameModule): Promise<void>;

  // Session management
  createGameSession(gameId: string, userId?: string): Promise<IGameSession>;
  updateGameSession(session: IGameSession): Promise<void>;
  getGameSession(sessionId: string): Promise<IGameSession | null>;

  // User progress
  getUserProgress(userId: string): Promise<IUserProgress>;
  updateUserProgress(progress: IUserProgress): Promise<void>;

  // Asset loading
  loadAsset(assetPath: string): Promise<string>; // Returns URL or data URL
  loadModel(modelPath: string): Promise<string>; // Returns URL for GLB/GLTF
  loadTexture(texturePath: string): Promise<string>; // Returns URL for image
}

// Events for reactive updates
export interface IGameDataEvents {
  onGameUpdated?: (gameId: string, game: IGameModule) => void;
  onSessionUpdated?: (session: IGameSession) => void;
  onProgressUpdated?: (progress: IUserProgress) => void;
}
