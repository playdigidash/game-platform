import {
  action,
  makeAutoObservable,
  reaction,
  observable,
  runInAction,
  IReactionDisposer,
  configure,
} from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import { isArray } from 'lodash';
import randomColor from 'randomcolor';
import {
  IDBPlayedQuestion,
  IDbQuestion,
  IGameSessionQuestions,
} from '@lidvizion/commonlib';
import { createRef } from 'react';
import { ScoreAdditions } from '../endgame/score/scoreViewStore';
import { TUTORIAL_QUESTION_DATA } from '../tutorial/tutorialConstants';

// Configure MobX to use decorators
configure({
  enforceActions: 'observed',
});

export class QuestionViewStore {
  root: RootStore;
  showQuestionModal = false;
  dbQuestionArr: IDbQuestion[] = [];
  currQuestion: IDbQuestion | null = null;
  currentQuestionData: IDbQuestion | null = null;
  triviaDivRef = createRef<HTMLDivElement>();
  currentQObsId: string | null = null;
  currentQTries = 1;
  confettiEffect = false;
  quickAns = 0;
  questionList: any[] = [];
  particlesEffect = false;
  layerCounter = 0;
  hintCounter = 0;
  progress = 0;
  questionAtLayer = 10;
  layersTimeoutDelay = 1650;
  randInd = -1;
  timeoutRef: NodeJS.Timeout | null = null;
  startTimeRef = 0;
  elapsedTimeRef = 0;
  remainingTimeRef = 0;
  hintsList: any[] = [];
  reachPlayer = false;
  showFullQuestion = false;
  moduleQuestionCnt = 0;
  questionCounter = 0;

  // New state variables moved from QuestionModal
  showTooltip = true;
  showFirstTimeHint = true;
  showSpeedBonus = false;
  showBonusPoints = false;
  showExpandIcon = true;
  isQuestionLayerActive = false;
  // Add bonus points progress state
  bonusPointsProgress = 100;
  private bonusPointsTimer: NodeJS.Timeout | null = null;
  // Modal state management
  selectedOption = -1;
  hoveredOption = '';
  showAnswers = false;
  isReading = false;
  isProcessing = false;
  firstLayerAdded = false;
  hasNavigatedBackFromAnswers = false;

  // Track wrong answer selections to prevent repeated clicks
  wrongSelections = observable.set<number>();

  // Reaction disposers - not tracked by MobX
  private questionAnsweredReaction: IReactionDisposer | null = null;

  // Add helper data state
  helperData = {
    options: [
      { color: '', letter: 'A' },
      { color: '', letter: 'B' },
      { color: '', letter: 'C' },
      { color: '', letter: 'D' },
    ],
  };

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this, {
      wrongSelections: observable,
      root: false,
    });

    reaction(
      () => this.reachPlayer,
      (bool) => {
        if (bool) {
          this.handleReachPlayer();
        }
      }
    );

    reaction(
      () => this.currentQuestionData,
      (currentQuestionData) => {
        if (currentQuestionData) {
          // Skip adding tutorial questions to the played questions map
          const isTutorialMode = this.root.gamePlayViewStore.isTutorial;
          const isTutorialQuestion =
            currentQuestionData.isTutorial === true ||
            (currentQuestionData.id &&
              currentQuestionData.id.includes('tutorial'));

          // Only proceed for non-tutorial questions in non-tutorial mode
          if (!isTutorialMode && !isTutorialQuestion) {
            const playedQ: IDBPlayedQuestion = {
              ...currentQuestionData,
              tries: 1,
            };
            this.root.gameViewStore.addQToSession(currentQuestionData);
            this.root.gameViewStore.addQidToSet(playedQ);
          }
        }
      }
    );

    // Setup reaction for answered questions - instead of using setTimeout in afterQAnswered
    this.questionAnsweredReaction = reaction(
      () => this.selectedOption,
      (selectedOption) => {
        if (
          selectedOption !== -1 &&
          this.currentQuestionData?.correctAnswerIdx === selectedOption
        ) {
          this.root.gamePlayViewStore.buildRandomLayerArr();
          this.processCorrectAnswer();
        }
      }
    );
  }

  get shouldShowQModal() {
    return this.showQuestionModal && this.currentQuestionData !== null;
  }

  get shouldShowQExpandIcon() {
    return (
      this.root.gamePlayViewStore.isTutorial &&
      this.showTooltip &&
      this.showExpandIcon
    );
  }

  get showAnswerBtn() {
    let bool = true;

    if (this.root.endGameViewStore.isEndGameModalOpen) {
      bool = false;
    }

    return bool;
  }

  get currQuestionText() {
    return this.root.translateViewStore.translatedGameData &&
      this.currentQuestionData
      ? this.root.translateViewStore.translatedGameData.questions[
          this.root.gamePlayViewStore.isTutorial
            ? TUTORIAL_QUESTION_DATA.id
            : this.currentQuestionData.id
        ].question
      : '';
  }

  setIsQuestionLayerActive = action((bool: boolean) => {
    this.isQuestionLayerActive = bool;
  });

  setShowTooltip = action((value: boolean) => {
    this.showTooltip = value;
  });

  setShowFirstTimeHint = action((value: boolean) => {
    this.showFirstTimeHint = value;
  });

  setShowSpeedBonus = action((value: boolean) => {
    this.showSpeedBonus = value;
  });

  setModuleQuestionCnt = action((num: number) => {
    this.moduleQuestionCnt = num;
  });

  setShowBonusPoints = action((value: boolean) => {
    this.showBonusPoints = value;
  });

  setShowExpandIcon = action((value: boolean) => {
    this.showExpandIcon = value;
  });

  setReachPlayer = action((bool: boolean) => {
    this.reachPlayer = bool;
  });

  setTimeoutRef = action((timeout: NodeJS.Timeout | null) => {
    this.timeoutRef = timeout;
  });

  setHintsList = action((arr: any[]) => {
    this.hintsList = arr;
  });

  setRandInd = action((num: number) => {
    this.randInd = num;
  });

  setStartTimeRef = action((num: number) => {
    this.startTimeRef = num;
  });

  setLayersTimeoutDelay = action((num: number) => {
    this.layersTimeoutDelay = num;
  });

  setElapsedTimeRef = action((num: number) => {
    this.elapsedTimeRef = num;
  });

  setRemainingTimeRef = action((num: number) => {
    this.remainingTimeRef = num;
  });

  setShowFullQuestion = action((bool: boolean) => {
    this.showFullQuestion = bool;
  });

  setParticlesEffect = action((bool: boolean) => {
    this.particlesEffect = bool;
  });

  setConfettiEffect = action((bool: boolean) => {
    this.confettiEffect = bool;
  });

  setquickAns = action((num: number) => {
    this.quickAns = num;
  });

  setCurrentQTries = action((num: number) => {
    this.currentQTries = num;
  });

  setCurrentQObsId = action((id: string) => {
    this.currentQObsId = id;
  });

  setProgress = action((num: number) => {
    this.progress = num;
  });

  setCurrentQuestionData = action((q: IDbQuestion) => {
    this.currentQuestionData = q;
    // Update helper data with current answer colors
    if (this.root.gamePlayViewStore.answerColors) {
      this.updateHelperData(this.root.gamePlayViewStore.answerColors);
    }
  });

  setShowQuestionModal = action((bool: boolean) => {
    this.showQuestionModal = bool;
  });

  setLayerCounter = action((num: number) => {
    this.layerCounter = num;
  });

  setFirstLayerAdded = action((bool: boolean) => {
    this.firstLayerAdded = bool;
  });

  setDbQuestionArr = action((arr: IDbQuestion[]) => {
    this.dbQuestionArr = arr;
  });

  setQuestionList = action((l: any[]) => {
    this.questionList = l;
  });
  setHintCounter = action((num: number) => {
    this.hintCounter = num;
  });

  initializeQuestions = action(async (dbQuestionArr: IDbQuestion[]) => {
    if (this.root.gameViewStore.gameSession) {
      const sessionQuestions: IGameSessionQuestions = {};

      // Initialize questions and sync with playedQuestions Set
      dbQuestionArr.forEach((q) => {
        const isPlayed = this.root.gameViewStore.playedQuestions[q.id];
        sessionQuestions[q.id] = {
          tries: 0,
          id: q.id,
          played: isPlayed ? true : false,
        };
      });

      this.root.gameViewStore.gameSession.questions = sessionQuestions;
    }

    if (this.root.gameLoginViewStore.currUser?.uid) {
      this.root.gameViewStore.gameSession.uid =
        this.root.gameLoginViewStore.currUser.uid;
    }
  });

  getDbQuestionArr = action(async (db: Realm.Services.MongoDBDatabase) => {
    // Use the questions from the game module instead of fetching from test_qna
    const qs = this.root.gameViewStore.questionsData;

    if (isArray(qs)) {
      qs.forEach((q: IDbQuestion) => {
        q.answers.forEach((a) => {
          a.color = randomColor({ luminosity: 'dark' });
        });
      });

      await this.initializeQuestions(qs);
      this.setDbQuestionArr(qs);
      this.root.gameViewStore.getCurrQuest();
      return qs;
    }

    return [];
  });

  handleAnswerBtn = action(() => {
    this.setShowQuestionModal(false);
  });

  resetQuestions = action(async () => {
    this.dbQuestionArr = [];
    if (this.root.gameViewStore.gameSession) {
      this.root.gameViewStore.gameSession.questions = {};
    }
    await this.getDbQuestionArr(this.root.db);
  });

  removeQObstacle = action(() => {
    const inaRow = 0;
    // Calculate the base score based on number of tries
    const baseScore = ScoreAdditions.questionCorrect / this.currentQTries;

    // Calculate total score including any bonuses
    const totalScore = baseScore + this.quickAns + inaRow;

    // Check if in tutorial mode to skip counting this question
    const isTutorialMode = this.root.gamePlayViewStore.isTutorial;

    let translatedText;
    // Custom achievement messages based on attempts
    if (this.currentQTries === 1) {
      // Solved in first try
      if (!isTutorialMode) {
        this.root.gamePlayViewStore.setFirstTimeAnswers(
          this.root.gamePlayViewStore.firstTimeAnswers + 1
        );
      }
      this.setConfettiEffect(true);

      if (
        !isTutorialMode &&
        this.root.gamePlayViewStore.firstTimeAnswers + 1 ===
          Number(this.root.gameViewStore.settings?.limit)
      ) {
        translatedText =
          this.root.translateViewStore.translatedGameData?.onARollLabel ||
          "You're on a roll!";
        this.root.gamePlayViewStore.setAchievement({
          text: `+${Math.round(totalScore + 300)} You're on a roll!`,
          translatedText,
          position: 'middle', // Trivia achievements in the middle
        });
      } else if (this.quickAns > 0) {
        translatedText =
          this.root.translateViewStore.translatedGameData?.lightningFastLabel ||
          'Lightning fast!';
        // First try with speed bonus
        this.root.gamePlayViewStore.setAchievement({
          text: `+${Math.round(totalScore)} Lightning fast!`,
          translatedText,
          position: 'middle',
        });
      } else {
        translatedText =
          this.root.translateViewStore.translatedGameData?.firstTryLabel ||
          'First try!!';
        // First try without speed bonus
        this.root.gamePlayViewStore.setAchievement({
          text: `+${Math.round(baseScore)} First try!!`,
          translatedText,
          position: 'middle',
        });
      }
    } else if (this.currentQTries === 2) {
      this.setParticlesEffect(true);
      translatedText =
        this.root.translateViewStore.translatedGameData
          ?.secondShotSuccessLabel || 'Second shot success!';
      this.root.gamePlayViewStore.setAchievement({
        text: `+${Math.round(baseScore)} Second shot success!`,
        translatedText,
        position: 'middle',
      });
    } else if (this.currentQTries === 3) {
      translatedText =
        this.root.translateViewStore.translatedGameData?.thirdTimeCharmLabel ||
        "Third time's the charm!";
      this.root.gamePlayViewStore.setAchievement({
        text: `+${Math.round(baseScore)} Third time's the charm!`,
        translatedText,
        position: 'middle',
      });
    } else {
      translatedText =
        this.root.translateViewStore.translatedGameData?.youGotItLabel ||
        'You got it!';
      this.root.gamePlayViewStore.setAchievement({
        text: `+${Math.round(baseScore)} You got it!`,
        translatedText,
        position: 'middle',
      });
    }

    if (this.currentQuestionData?.id && !isTutorialMode) {
      this.root.gamePlayViewStore.setAttemptForQuestion(
        this.currentQuestionData.id,
        this.currentQTries
      );
    }

    // For tutorial questions, we'll still give points but won't count them in stats
    const score =
      ScoreAdditions.questionCorrect / this.currentQTries + this.quickAns;

    // Only add score to the game if not in tutorial mode
    if (!isTutorialMode) {
      this.root.scoreViewStore.addScore(score);
      this.root.scoreViewStore.setScorePerQuestion(score);
      this.root.scoreViewStore.setTriesPerQuestion(this.currentQTries);
    }

    this.root.gamePlayViewStore.setQuestionMode(false);
    this.setQuestionList(
      this.questionList.filter((item) => item.obs_id !== this.currQuestion?.id)
    );
    this.setLayerCounter(0);
    this.setHintCounter(0);

    // Reset progress
    this.setProgress(0);
  });

  handleOptionClick = action((ind: number) => {
    // Check if we're already processing an answer
    if (this.isProcessing) {
      return;
    }

    // Check if the option was already selected incorrectly
    if (this.wrongSelections.has(ind)) {
      return;
    }

    // Don't allow clicking if a correct answer was already selected
    if (this.selectedOption !== -1) {
      return;
    }

    // Get the correct answer index directly from the currentQuestionData
    let correctAnswerIdx = this.currentQuestionData?.correctAnswerIdx;

    // Check tutorial mode from GamePlayViewStore
    const isTutorialMode = this.root.gamePlayViewStore.isTutorial;

    // For tutorial questions, ALWAYS enforce Blue (index 0) as the correct answer
    // This is our safety check in case data got corrupted somewhere
    if (isTutorialMode) {
      // Force correct answer index to be 0 (Blue)
      correctAnswerIdx = 0;

      // For extra safety, force replace the question data with our standard tutorial question
      if (this.currentQuestionData) {
        this.currentQuestionData = {
          ...TUTORIAL_QUESTION_DATA,
          id: this.currentQuestionData.id || TUTORIAL_QUESTION_DATA.id,
        } as IDbQuestion;
      }
    }

    const isCorrect = correctAnswerIdx === ind;

    // Set the selected option immediately to provide visual feedback
    this.setSelectedOption(ind);

    if (isTutorialMode) {
      // For tutorial questions, we define what is correct:
      // Only Blue (index 0) is correct, regardless of what's in currentQuestionData
      const tutorialIsCorrect = ind === 0;

      if (tutorialIsCorrect) {
        // Mark as processing to prevent multiple clicks
        this.setIsProcessing(true);
        // For correct answers in tutorial, proceed after showing animation
        setTimeout(() => {
          // If we have a tutorial handler, use it
          if (
            this.root.tutorialViewStore &&
            this.root.tutorialViewStore.handleTutorialAnswer
          ) {
            this.root.tutorialViewStore.handleTutorialAnswer(
              true,
              this.currentQTries
            );
          } else {
            // Otherwise, just process with the default logic
            this.processCorrectAnswer();
          }
        }, 500);
      } else {
        // For incorrect answers in tutorial, increment tries and reset
        this.setCurrentQTries(this.currentQTries + 1);

        // Add incorrect selection to tracking set - this will show just the red border
        // Using action to modify observable set
        runInAction(() => {
          this.wrongSelections.add(ind);
        });

        // Brief delay for animation in tutorial mode only, then reset selection
        setTimeout(() => {
          this.setSelectedOption(-1);
        }, 300);
      }
      return;
    }

    // Regular game mode handling
    if (isCorrect) {
      // Mark as processing to prevent multiple clicks
      this.setIsProcessing(true);
      // For correct answers, the reaction will handle the afterQAnswered logic
      // No direct call to afterQAnswered needed - reaction takes care of it
    } else {
      this.root.gameViewStore.addTryToQ();

      // Add incorrect selection to tracking set - this will show just the red border
      // Using action to modify observable set
      runInAction(() => {
        this.wrongSelections.add(ind);
      });

      // Increment tries in question view store
      this.setCurrentQTries(this.currentQTries + 1);

      // Hide speed bonus immediately on wrong answer
      this.setShowSpeedBonus(false);
      this.setShowBonusPoints(false);
      // Reset quickAns to 0 to ensure no speed bonus is awarded for incorrect answers
      // This is the only place we need to call setquickAns(0) for wrong answers
      this.setquickAns(0);

      // Reset selection after a brief delay to allow the animation to complete
      setTimeout(() => {
        this.setSelectedOption(-1);
      }, 50);
    }
  });

  // Process correct answer - split from afterQAnswered to work with the reaction pattern
  processCorrectAnswer = action(() => {
    let asset = '';
    if (this.currentQTries === 1) {
      asset = '../../assets/audio/soundeffects/onetry.wav';
    } else if (this.currentQTries === 2) {
      asset = '../../assets/audio/soundeffects/2ndtry.wav';
    } else if (this.currentQTries === 3) {
      asset = '../../assets/audio/soundeffects/3rdtry.wav';
    } else if (this.currentQTries === 4) {
      asset = '../../assets/audio/soundeffects/4thtry.wav';
    }

    if (this.root.settingsViewStore.isSoundEffectsChecked) {
      const soundEffect = new Audio(asset);
      soundEffect.loop = false;
      soundEffect.play().catch(() => {
        /* Ignore audio play errors */
      });
    }

    // Immediately hide the speed timer
    this.setShowSpeedBonus(false);
    this.setShowBonusPoints(false);

    // Set quickAns from the current score timer value, but only on first try
    if (this.currentQTries === 1) {
      // Get the current timer value for the question (the speed bonus)
      const speedBonus = this.root.scoreViewStore.currQScore;
      this.setquickAns(speedBonus);
    } else {
      // No speed bonus for subsequent tries - only set once
      this.setquickAns(0);
    }

    // Very short delay (300ms) before closing the modal
    setTimeout(() => {
      // Close the modal
      this.setShowQuestionModal(false);
      this.setShowAnswers(false);
      this.setIsReading(false);
      this.setSelectedOption(-1);
      this.setHoveredOption('');

      // Clear all wrong selections since the question is now answered
      runInAction(() => {
        this.wrongSelections.clear();
      });

      // Reset other states
      this.setReachPlayer(false);
      this.setShowFullQuestion(false);
      this.setIsProcessing(false); // Reset processing state when done
      this.root.obstacleViewStore.setFunFactShownThisQuestion(false);
      // Show achievement AFTER the modal closes
      setTimeout(() => {
        this.removeQObstacle();
      }, 100);
    }, 300);
  });

  // Maintain the original afterQAnswered as a compatibility wrapper
  afterQAnswered = action(() => {
    this.processCorrectAnswer();
    return true; // Indicate successful execution
  });

  // Cleanup method to dispose reactions
  disposeReactions = action(() => {
    if (this.questionAnsweredReaction) {
      this.questionAnsweredReaction();
      this.questionAnsweredReaction = null;
    }
    this.disposeBonusPointsTimer();
  });

  handleReachPlayer = action(() => {
    this.setCurrentQuestionData(this.root.gameViewStore.nextQuestion || null);
    this.root.gamePlayViewStore.setShowGameUI(false);
    this.setShowFullQuestion(false);
    this.setSelectedOption(-1);
    this.setHoveredOption('');
    this.setShowAnswers(false);
    this.setIsReading(true);
    this.setIsProcessing(false);
    this.setShowQuestionModal(true);
    this.setHasNavigatedBackFromAnswers(false);

    // Reset tries counter to 1 for each new question
    this.setCurrentQTries(1);

    // Clear wrong selections for the new question
    runInAction(() => {
      this.wrongSelections.clear();
    });

    // If this is a tutorial question, ensure it has correct data
    const isTutorialMode = this.root.gamePlayViewStore.isTutorial;
    if (isTutorialMode) {
      // Always force the question to be about sky color in tutorial mode
      this.currentQuestionData = {
        ...TUTORIAL_QUESTION_DATA,
        // Preserve the ID if needed
        id: this.currentQuestionData?.id || TUTORIAL_QUESTION_DATA.id,
      } as IDbQuestion;
    }

    // Clear any existing timeout first
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }

    // First timeout for reading time (5 seconds)
    const timeout = setTimeout(() => {
      this.setIsReading(false);

      // Small delay before showing answers in the regular position
      setTimeout(() => {
        // Double-check that for tutorial questions, correct answer is still Blue (index 0)
        if (isTutorialMode && this.currentQuestionData) {
          // Force the question data again just to be absolutely sure
          this.currentQuestionData = {
            ...TUTORIAL_QUESTION_DATA,
            id: this.currentQuestionData.id || TUTORIAL_QUESTION_DATA.id,
          } as IDbQuestion;
        }

        this.setShowQuestionModal(true);
        this.setShowAnswers(true);
        this.root.gamePlayViewStore.setShrinkProgress(true);
        // Start the speed bonus timer after answers are shown
        this.root.gamePlayViewStore.startTriviaTimer();
      }, 500);
    }, 5000);

    this.setTimeoutRef(timeout);
  });

  setSelectedOption = action((value: number) => {
    this.selectedOption = value;
  });

  setHoveredOption = action((value: string) => {
    this.hoveredOption = value;
  });

  setShowAnswers = action((value: boolean) => {
    this.showAnswers = value;
  });

  setIsReading = action((value: boolean) => {
    this.isReading = value;
  });

  setIsProcessing = action((value: boolean) => {
    this.isProcessing = value;
  });

  setHasNavigatedBackFromAnswers = action((value: boolean) => {
    this.hasNavigatedBackFromAnswers = value;
  });

  // Navigate back to question from answers
  navigateBackToQuestion = action(() => {
    this.setShowAnswers(false);
    this.setIsReading(true);
    this.setHasNavigatedBackFromAnswers(true);
  });

  // Navigate back to answers from question
  navigateBackToAnswers = action(() => {
    this.setIsReading(false);
    this.setShowAnswers(true);
  });

  handleHover = action((letter: string, isEnter: boolean) => {
    // Only allow hover effects if not processing and no option is selected
    if (!this.isProcessing && this.selectedOption === -1) {
      this.setHoveredOption(isEnter ? letter : '');
    }
  });

  handleQuestionClick = action(() => {
    this.setShowFullQuestion(true);
  });

  // Add new methods after the existing ones
  handleQuestionBoxClick = action(() => {
    this.setShowTooltip(false);
    this.setShowFirstTimeHint(false);
    this.setShowExpandIcon(false);
    this.handleQuestionClick();
    localStorage.setItem('hasSeenExpandHint', 'true');
  });

  handleFirstTimeHintDismiss = action((event: React.MouseEvent) => {
    event.stopPropagation();
    this.setShowFirstTimeHint(false);
    localStorage.setItem('hasSeenQuestionHint', 'true');
  });

  // Handle localStorage for hints
  initializeHintStates = action(() => {
    const hasSeenQuestionHint = localStorage.getItem('hasSeenQuestionHint');
    const hasSeenExpandHint = localStorage.getItem('hasSeenExpandHint');

    if (hasSeenQuestionHint) {
      this.setShowFirstTimeHint(false);
    }
    if (hasSeenExpandHint) {
      this.setShowTooltip(false);
    }
  });

  // Handle speed bonus timer
  initializeSpeedBonus = action(() => {
    // Don't show speed bonus for tutorial hints
    if (this.root.gamePlayViewStore.isTutorial) {
      return;
    }

    if (this.showAnswers) {
      this.setShowSpeedBonus(true);
      this.setShowBonusPoints(true);

      // Hide bonus points message after animation
      setTimeout(() => {
        this.setShowBonusPoints(false);
      }, 5000);

      // Hide speed bonus after time limit
      setTimeout(() => {
        this.setShowSpeedBonus(false);
      }, 10000);
    }
  });

  // Add bonus points methods
  startBonusPointsCountdown = action(() => {
    this.bonusPointsProgress = 100;
    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    if (this.bonusPointsTimer) {
      clearInterval(this.bonusPointsTimer);
    }

    this.bonusPointsTimer = setInterval(() => {
      currentStep++;
      this.bonusPointsProgress = 100 - (currentStep / steps) * 100;

      if (currentStep >= steps) {
        if (this.bonusPointsTimer) {
          clearInterval(this.bonusPointsTimer);
          this.bonusPointsTimer = null;
        }
      }
    }, interval);
  });

  resetBonusPointsProgress = action(() => {
    if (this.bonusPointsTimer) {
      clearInterval(this.bonusPointsTimer);
      this.bonusPointsTimer = null;
    }
    this.bonusPointsProgress = 100;
  });

  // Add cleanup method for bonus points timer
  disposeBonusPointsTimer = action(() => {
    if (this.bonusPointsTimer) {
      clearInterval(this.bonusPointsTimer);
      this.bonusPointsTimer = null;
    }
  });

  // Add method to update helper data
  updateHelperData = action(
    (answerColors: { a: string; b: string; c: string; d: string }) => {
      this.helperData = {
        options: [
          { color: `#${answerColors.a}`, letter: 'A' },
          { color: `#${answerColors.b}`, letter: 'B' },
          { color: `#${answerColors.c}`, letter: 'C' },
          { color: `#${answerColors.d}`, letter: 'D' },
        ],
      };
    }
  );
}
