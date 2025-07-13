import { action, makeAutoObservable } from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import { IDirection } from '@lidvizion/commonlib';
import { TUTORIAL_QUESTION_DATA } from './tutorialConstants';

export const tutorialItems = [
  {
    type: 'obstacle',
    direction: IDirection.right,
    args: 'wide',
  },
  {
    type: 'obstacle',
    direction: IDirection.left,
    args: 'wide',
  },
  {
    type: 'obstacle',
    direction: IDirection.up,
    args: 'full',
  },
  {
    type: 'hint',
    direction: IDirection.hint,
    args: 'box',
  },
  {
    type: 'coin',
    direction: IDirection.coin,
    args: 'box',
  },
  {
    type: 'question',
    direction: IDirection.enter,
    args: 'full',
    questionData: TUTORIAL_QUESTION_DATA,
  },
];

export class TutorialViewStore {
  root: RootStore;
  tutorialList: any[] = [];
  tutorialIndex = 0;
  isStart = false;
  obsCounter = 0;
  tutorialScore = 0;
  speedBonus = 300;
  lastScoreUpdate = 0;
  tutorialHints: any[] = [];
  tutorialQuestionAnswered = false;

  // New state for TutorialItem
  showMarks = false;
  hitRef = false;
  objIndex: any = null;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  // New actions for TutorialItem
  setShowMarks = action((show: boolean) => {
    this.showMarks = show;
  });

  setHitRef = action((hit: boolean) => {
    this.hitRef = hit;
  });

  setObjIndex = action((index: any) => {
    this.objIndex = index;
  });

  setTutorialItems = action((items: any[]) => {
    this.tutorialList = items;
  });

  setTutorialIndex = action((index: number) => {
    this.tutorialIndex = index;
  });

  setIsStart = action((value: boolean) => {
    this.isStart = value;
  });

  setObsCounter = action((value: number) => {
    this.obsCounter = value;
  });

  setTutorialScore = action((score: number) => {
    this.tutorialScore = score;
  });

  setSpeedBonus = action((bonus: number) => {
    this.speedBonus = bonus;
  });

  getArgs = action((tutorialArg: string, laneSize: number) => {
    switch (tutorialArg) {
      case 'wide':
        return [laneSize, 1, 1];
      case 'full':
        return [laneSize * 3, 1, 1];
      case 'long':
        return [1, 1, laneSize];
      case 'box':
        return [1, 1, 1];
      default:
        return [1, 1, 1];
    }
  });

  solvedTutorialId = action((id: number, laneSize: number) => {
    this.setTutorialIndex(this.tutorialIndex + 1);
    // this.root.gamePlayViewStore.addLayer(this.tutorialIndex + 1, laneSize);
  });

  removeTutorialId = action((id: number, laneSize: number) => {
    // Only proceed with layer addition if we haven't already completed the tutorial
    // Question items are handled by handleTutorialAnswer and completedTutorial
    if (id === 6 && !this.tutorialQuestionAnswered) {
      this.root.gamePlayViewStore.setQuestionMode(false);
      this.setTutorialIndex(this.tutorialIndex + 1);
      // this.addLayer(this.tutorialIndex + 1, laneSize);
    }
    this.setTutorialItems(this.tutorialList.filter((item) => item.id !== id));
  });

  addTutorialScore = action((points: number) => {
    this.tutorialScore += points;
    this.lastScoreUpdate = points;

    // Show achievement notification
    this.root.gamePlayViewStore.setAchievement({
      text: `+${points} points!`,
      style: {
        color: '#4CAF50',
        fontSize: '1.5rem',
        fontFamily: 'Orbitron, sans-serif',
        animation: 'floatUp 1s ease-out forwards',
      },
      position: 'center',
    });
  });

  handleTutorialAnswer = action((isCorrect: boolean, tries: number) => {
    if (isCorrect) {
      this.tutorialQuestionAnswered = true;

      // Find the question item in the tutorial list
      const questionItem = this.tutorialList.find(
        (item) => item.type === 'question'
      );

      if (questionItem) {
        // Remove the question from the tutorial list
        this.setTutorialItems(
          this.tutorialList.filter((item) => item.id !== questionItem.id)
        );

        // Set question mode to false immediately to close the modal
        this.root.gamePlayViewStore.setQuestionMode(false);

        this.root.questionViewStore.setShowQuestionModal(false);

        // Small delay before proceeding to the next tutorial step
        setTimeout(() => {
          // Show achievement for answering the question
          this.root.gamePlayViewStore.setAchievement({
            text: '+100 Great job answering the question!',
            position: 'middle',
          });

          // Instead of continuing the tutorial, use completedTutorial to immediately transition to the real game
          this.completedTutorial();
        }, 500);
      } else {
        // If we can't find the question for some reason, still start the real game
        setTimeout(() => {
          this.completedTutorial();
        }, 1000);
      }
    }

    return true; // Return true to indicate successful handling
  });

  // New method to handle tutorial completion (vs skipping)
  completedTutorial = action(() => {
    // TODO: Add analytics tracking to differentiate users who completed the tutorial vs skipped it

    // Mark tutorial as completed FIRST, then set isTutorial to false
    // This matches the exact order in skipButton.tsx
    this.root.gamePlayViewStore.setIsTutorialCompleted(true);

    this.root.gamePlayViewStore.setIsTutorial(false);

    // Show a completion message
    this.root.gamePlayViewStore.setAchievement({
      text:
        this.root.translateViewStore.translatedGameData
          ?.tutorialCompleteLabel || 'Tutorial completed! Starting the game...',
      position: 'middle',
    });

    // Clean up any remaining tutorial items
    this.setTutorialItems([]);

    // Start the real game after a brief delay
    setTimeout(() => {
      this.startRealGame();
    }, 100);
  });

  startRealGame = action(() => {
    // Reset tutorial state
    this.tutorialScore = 0;
    this.tutorialHints = [];
    this.tutorialQuestionAnswered = false;

    // Reset game state and start fresh
    this.root.gamePlayViewStore.resetGameState();

    // isTutorial should already be false from completedTutorial, but ensure it's false here
    this.root.gamePlayViewStore.setIsTutorial(false);

    this.root.gamePlayViewStore.setShowGameUI(true);

    // Reset all stores to fresh state
    this.root.scoreViewStore.reset();
    this.root.collectableViewStore.resetCoins();
    this.root.questionViewStore.setCurrentQTries(1);
    this.root.questionViewStore.setProgress(0);
    this.root.questionViewStore.setLayerCounter(0);
    this.root.questionViewStore.setHintCounter(0);
    this.root.questionViewStore.setShowQuestionModal(false);
    this.root.questionViewStore.setShowAnswers(false);
    this.root.questionViewStore.setIsReading(false);
    this.root.questionViewStore.setSelectedOption(-1);
    this.root.questionViewStore.setHoveredOption('');
    this.root.questionViewStore.setShowFullQuestion(false);
    this.root.questionViewStore.setIsProcessing(false);
  });

  handleTutorialCollectible = action((type: 'coin' | 'hint') => {
    if (type === 'coin') {
      this.tutorialScore += 100;
      // Show coin collection achievement with floating animation
      this.root.gamePlayViewStore.setAchievement({
        text: '+100',
        style: {
          color: '#4CAF50',
          fontSize: '1.5rem',
          fontFamily: 'Orbitron, sans-serif',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'coinFloat 1s ease-out forwards',
        },
        customStyle: `
          @keyframes coinFloat {
            0% { 
              transform: translate(-50%, -50%);
              opacity: 1;
            }
            50% {
              transform: translate(-400px, -200px);
              opacity: 0.8;
            }
            100% { 
              transform: translate(-400px, -300px);
              opacity: 0;
            }
          }
        `,
      });
    } else if (type === 'hint') {
      this.tutorialScore += 50;
      this.tutorialHints.push({
        id: `tutorial-hint-${this.tutorialHints.length + 1}`,
        collected: true,
      });
    }
  });

  removeTutorialItem = action((id: number) => {
    const idx = this.tutorialList.findIndex((item) => item.id === id);
    if (idx !== -1) {
      const item = this.tutorialList[idx];
      this.root.obstacleViewStore.returnToPool(item.instance, item.type);
      this.tutorialList.splice(idx, 1);
    }
  });
}
