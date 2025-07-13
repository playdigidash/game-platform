import { action, makeAutoObservable } from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import { FunFact } from '@lidvizion/commonlib';

export class PauseMenuViewStore {
  root: RootStore;
  showPauseModal = false;
  showFunFactModal = false;
  currentFunFact: FunFact | null = null;
  canCloseFunFact = false;
  progress = 0;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  get isPaused() {
    let bool = false;

    if (this.showPauseModal) {
      bool = true;
    } else if (this.root.endGameViewStore?.isEndGameModalOpen) {
      bool = true;
    } else if (this.showFunFactModal) {
      bool = true;
    } else if (this.root.gameLoginViewStore?.forceLogin) {
      bool = true;
    } else if (this.root.questionViewStore?.showQuestionModal) {
      bool = true;
    }

    return bool;
  }

  // Show/hide pause modal
  setShowPauseModal = action((show: boolean) => {
    this.showPauseModal = show;

    // Play a sound effect when toggling the pause menu
    if (show) {
      this.playPauseSound();
    } else {
      this.playResumeSound();
    }
  });

  // Fun fact modal controls
  setShowFunFactModal = action((show: boolean) => {
    this.showFunFactModal = show;
    if (!show) {
      this.currentFunFact = null;
      this.canCloseFunFact = false;
    } else {
      // Play a sound effect when showing a fun fact
      this.playFunFactSound();
    }
  });

  setCurrentFunFact = action((fact: FunFact | null) => {
    this.currentFunFact = fact;
  });

  setCanCloseFunFact = action((canClose: boolean) => {
    this.canCloseFunFact = canClose;
  });

  // Example sound effect functions with volume control and logging
  playPauseSound = action(() => {
    const { isSoundEffectsChecked, soundEffectsVolume } =
      this.root.settingsViewStore;

    if (isSoundEffectsChecked) {
      // Example path - replace with actual sound effect file
      const soundPath = 'assets/audio/effects/pause.mp3';
      const normalizedVolume = soundEffectsVolume / 200;

      // Demonstration of playing a sound effect with appropriate volume
      this.root.settingsViewStore.playSoundEffect(soundPath);
    }
  });

  playResumeSound = action(() => {
    const { isSoundEffectsChecked, soundEffectsVolume } =
      this.root.settingsViewStore;

    if (isSoundEffectsChecked) {
      // Example path - replace with actual sound effect file
      const soundPath = 'assets/audio/effects/resume.mp3';
      const normalizedVolume = soundEffectsVolume / 200;

      // Demonstration of playing a sound effect with appropriate volume
      this.root.settingsViewStore.playSoundEffect(soundPath);
    }
  });

  playFunFactSound = action(() => {
    const { isSoundEffectsChecked, soundEffectsVolume } =
      this.root.settingsViewStore;

    if (isSoundEffectsChecked) {
      // Example path - replace with actual sound effect file
      // const soundPath = 'assets/audio/effects/funfact.mp3';
      const normalizedVolume = soundEffectsVolume / 200;

      // // Demonstration of playing a sound effect with appropriate volume
      // this.root.settingsViewStore.playSoundEffect(soundPath);
    }
  });

  startProgress = action(() => {
    this.progress = 0;
    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      this.progress = (currentStep / steps) * 100;

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
  });

  resetProgress = action(() => {
    this.progress = 0;
  });
}
