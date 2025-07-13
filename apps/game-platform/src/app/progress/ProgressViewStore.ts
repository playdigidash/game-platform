import { action, makeAutoObservable, reaction } from 'mobx';
import { RootStore } from '../RootStore/RootStore';

export type ProgressViewMode = 'overview' | 'detail';

export class ProgressViewStore {
  root: RootStore;
  currentView: ProgressViewMode = 'detail';
  isTransitioning = false;
  viewTimer: number | null = null;
  overviewStartTime: number | null = null;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);

    // React to question changes to trigger overview mode
    reaction(
      () => this.root.gamePlayViewStore.questionCounter,
      (questionCounter, previousQuestionCounter) => {
        // Trigger on question changes OR when starting first question (0)
        if ((questionCounter !== previousQuestionCounter || 
             (questionCounter === 0 && previousQuestionCounter === undefined)) && 
            !this.root.gamePlayViewStore.isTutorial && 
            !this.root.gamePlayViewStore.showScoreBoard) {
          this.showOverviewFor2Seconds();
        }
      }
    );
  }

  showOverviewFor2Seconds = action(() => {
    // Clear any existing timer
    if (this.viewTimer) {
      clearTimeout(this.viewTimer);
    }

    // Switch to overview mode
    this.currentView = 'overview';
    this.isTransitioning = true;
    this.overviewStartTime = Date.now();

    // Set timer to switch to detail mode after 2 seconds
    this.viewTimer = window.setTimeout(() => {
      this.transitionToDetailView();
    }, 2000);
  });

  transitionToDetailView = action(() => {
    this.currentView = 'detail';
    this.isTransitioning = false;
    this.overviewStartTime = null;
    
    if (this.viewTimer) {
      clearTimeout(this.viewTimer);
      this.viewTimer = null;
    }
  });

  forceDetailView = action(() => {
    if (this.viewTimer) {
      clearTimeout(this.viewTimer);
      this.viewTimer = null;
    }
    this.currentView = 'detail';
    this.isTransitioning = false;
    this.overviewStartTime = null;
  });

  // Manual trigger for testing - can be removed in production
  triggerOverviewMode = action(() => {
    this.showOverviewFor2Seconds();
  });

  // Get elapsed time in overview mode (for animation purposes)
  getOverviewElapsedTime = (): number => {
    if (!this.overviewStartTime) return 0;
    return Date.now() - this.overviewStartTime;
  };

  // Clean up timers
  dispose = () => {
    if (this.viewTimer) {
      clearTimeout(this.viewTimer);
      this.viewTimer = null;
    }
  };
} 