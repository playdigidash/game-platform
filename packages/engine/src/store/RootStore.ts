import { IGameDataProvider } from '@digidash/data';
import { MainSceneViewStore } from './MainSceneViewStore';
import { GameViewStore } from './GameViewStore';
import { GamePlayViewStore } from './GamePlayViewStore';
import { SettingsViewStore } from './SettingsViewStore';
import { ScoreViewStore } from './ScoreViewStore';
import { QuestionViewStore } from './QuestionViewStore';
import { MovementViewStore } from './MovementViewStore';
import { ObstaclesViewStore } from './ObstaclesViewStore';
import { CollectableViewStore } from './CollectableViewStore';
import { PauseMenuViewStore } from './PauseMenuViewStore';
import { EndGameViewStore } from './EndGameViewStore';
import { TutorialViewStore } from './TutorialViewStore';
import { CleanupViewStore } from './CleanupViewStore';
import { CameraViewStore } from './CameraViewStore';
import { AnimationViewStore } from './AnimationViewStore';

/**
 * Open source RootStore - simplified version without MongoDB dependencies
 * Uses the IGameDataProvider abstraction for all data operations
 */
export class RootStore {
  // Data provider replaces MongoDB
  dataProvider: IGameDataProvider;

  // Core game stores (essential for 3D trivia runner)
  mainSceneViewStore: MainSceneViewStore;
  gameViewStore: GameViewStore;
  gamePlayViewStore: GamePlayViewStore;
  settingsViewStore: SettingsViewStore;
  scoreViewStore: ScoreViewStore;
  questionViewStore: QuestionViewStore;
  movementViewStore: MovementViewStore;
  obstacleViewStore: ObstaclesViewStore;
  collectableViewStore: CollectableViewStore;
  pauseMenuViewStore: PauseMenuViewStore;
  endGameViewStore: EndGameViewStore;
  tutorialViewStore: TutorialViewStore;
  cleanupViewStore: CleanupViewStore;
  cameraViewStore: CameraViewStore;
  animationViewStore: AnimationViewStore;

  constructor(dataProvider: IGameDataProvider) {
    this.dataProvider = dataProvider;

    // Initialize core stores
    this.mainSceneViewStore = new MainSceneViewStore(this);
    this.gameViewStore = new GameViewStore(this);
    this.gamePlayViewStore = new GamePlayViewStore(this);
    this.settingsViewStore = new SettingsViewStore(this);
    this.scoreViewStore = new ScoreViewStore(this);
    this.questionViewStore = new QuestionViewStore(this);
    this.movementViewStore = new MovementViewStore(this);
    this.obstacleViewStore = new ObstaclesViewStore(this);
    this.collectableViewStore = new CollectableViewStore(this);
    this.pauseMenuViewStore = new PauseMenuViewStore(this);
    this.endGameViewStore = new EndGameViewStore(this);
    this.tutorialViewStore = new TutorialViewStore(this);
    this.cleanupViewStore = new CleanupViewStore(this);
    this.cameraViewStore = new CameraViewStore(this);
    this.animationViewStore = new AnimationViewStore(this);
  }

  // Convenience methods for common data operations
  async loadGame(gameId: string) {
    return this.dataProvider.loadGame(gameId);
  }

  async createSession(gameId: string, userId?: string) {
    return this.dataProvider.createGameSession(gameId, userId);
  }

  async updateSession(session: any) {
    return this.dataProvider.updateGameSession(session);
  }

  async loadAsset(path: string) {
    return this.dataProvider.loadAsset(path);
  }

  async loadModel(path: string) {
    return this.dataProvider.loadModel(path);
  }

  async loadTexture(path: string) {
    return this.dataProvider.loadTexture(path);
  }

  // Clean up resources when game ends
  cleanup() {
    this.cleanupViewStore.cleanup();
    // Additional cleanup logic here
  }
}
