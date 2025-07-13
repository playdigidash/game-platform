import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';

export enum GameMode {
  RUNNER = 'runner',
  PRESENTER = 'presenter'
}

export class GameModeStore {
  root: RootStore;
  currentMode: GameMode = GameMode.RUNNER;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  setGameMode = (mode: GameMode) => {
    this.currentMode = mode;
    // Trigger any necessary mode-specific initializations
    this.initializeGameMode();
  };

  private initializeGameMode = () => {
    // Clear any existing game state
    this.root.gamePlayViewStore.resetGameState();
    
    switch (this.currentMode) {
      case GameMode.PRESENTER:
        // Initialize presenter-specific stores and state
        break;
      case GameMode.RUNNER:
        // Initialize runner-specific stores and state
        break;
    }
  };

  get isPresenterMode(): boolean {
    return this.currentMode === GameMode.PRESENTER;
  }

  get isRunnerMode(): boolean {
    return this.currentMode === GameMode.RUNNER;
  }
} 