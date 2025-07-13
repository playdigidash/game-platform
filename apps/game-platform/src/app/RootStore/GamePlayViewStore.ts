import { action, makeAutoObservable, computed, reaction } from 'mobx';
import { RootStore } from './RootStore';
import {
  LoginLvl,
  IAnswerColors,
  IGlb,
  EObstacleModelType,
  updateGameSession,
  waitForSpecifiedTime,
  fetch3DObjects,
  IObstacleLayer,
  environmentConfig,
} from '@lidvizion/commonlib';
import Slide from 'react-spring-3d-carousel';
import { MutableRefObject } from 'react';
import { RapierRigidBody } from '@react-three/rapier';
import { AVA_ANIM } from '../FiberComponents/HeroModel';
import { FunFact, ObstacleFunFacts } from '@lidvizion/commonlib';
import { ScoreSubtractions } from '../endgame/score/scoreViewStore';
import { EObstacleLayerType, ObstacleType } from '@lidvizion/commonlib';
import { Vector3 } from 'three';

export interface ISecureLocations {
  [key: number]: {
    location: any;
  }[];
}

export interface HintData {
  id: string;
  qId: string;
  idx: number;
  title: string;
  xformedH: string;
}

export interface IGamePart {
  part: number;
  isCurrent: boolean;
  isNext: boolean;
}

export enum LaneType {
  ThreeLane = 'Three Lane',
}

export class GamePlayViewStore {
  root: RootStore;
  shrinkProgress = false;
  attemptsPerQuestion: any = {};
  selectedHero = -1;
  questionMode = false;
  isMobile = false;
  collectedHints: HintData[] = [];
  gotAchievement = undefined;
  achievementsQueue: any[] = []; // Add queue for multiple achievements
  showScoreBoard = false;
  isHurt = false;
  gestureKey: any = undefined;
  firstTimeAnswers = 0;
  isTutorial = true;
  isTutorialCompleted = false;
  cameraSlider = 0;
  loginLvl: number = LoginLvl.high;
  shouldCheckAccess = false;
  laneSelected = LaneType.ThreeLane;
  sensitivity = 1.2;
  playGame = false;
  pauseMenuTabIdx = 0;
  currentSlideIndex = 0;
  tutorialSlides: Slide[] = [];
  showTutorialModal = false;
  downwardForce = 2;
  hintIdx = 0;
  answerColors: IAnswerColors = {
    a: 'ff69b4', // pink default
    b: 'ffd700', // gold default
    c: '008080', // teal default
    d: 'ff00ff', // magenta default
  };
  showTutorialIntro = true;
  showLaneSelect = false;
  partsArr: IGamePart[] = [];
  showGameUI = true;
  showFollowupTxt = false;
  private _funFacts: ObstacleFunFacts = {};
  private seenFunFacts: Set<string> = new Set();
  currentQuestionFunFactCount = 0;
  showCoinBubble = false;
  showObstacleBubble = false;
  isSponsorLayerOnScreen = false;
  // Add a property to track active timers
  triviaTimerInterval: NodeJS.Timeout | null = null;
  triviaTimerTimeout: NodeJS.Timeout | null = null;
  gameStartTime = 0;
  gameTimer = 0;
  timerInterval: NodeJS.Timeout | null = null;
  gameSpeeds = {
    normal: 13,
    slowMotion: 5,
  };
  gameSpeed = this.gameSpeeds.normal;
  currentRandomLayerArr: number[] = [];
  // Add properties for QR code modal
  showQrCodeModal = true;
  testMode = false;
  isActualMobileDevice: boolean | null = null;
  heroHeight = 0;
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this, {
      root: false,
    });
    // Initialize answer colors when store is created
    this.initAnswerColors();
    this.currentQuestionFunFactCount = 0;

    // Check if mobile device on initialization
    this.detectActualMobileDevice();

    // Check if user has previously dismissed the QR modal
    const modalDismissed = localStorage.getItem('qrCodeModalDismissed');
    if (modalDismissed === 'true') {
      this.setShowQrCodeModal(false);
    }

    reaction(
      () => this.questionCounter,
      async (questionCounter) => {
        this.setHintIdx(0);
        this.setCurrentQuestionFunFactCount(0);
        this.collectedHints = [];

        if (
          questionCounter > 0 &&
          questionCounter === this.root.gameViewStore.questionsData.length
        ) {
          this.setShowScoreboardModal(true);
          await this.root.endGameViewStore.updateGameSessionFunc();
        }
      }
    );

    reaction(
      () => this.gameStarted,
      () => {
        if (this.gameStarted) {
          this.buildRandomLayerArr();
        }
      }
    );

    // Start tracking time when game starts
    reaction(
      () => this.isGameActive,
      (isActive) => {
        if (isActive) {
          this.startGameTimer();
        } else {
          this.pauseGameTimer();
        }
      }
    );
  }

  get shouldShowQrCodeModal() {
    // Only show QR code if:
    // 1. It's definitely not a mobile device
    // 2. User hasn't dismissed it
    // 3. Not in dev mode
    return (
      this.isActualMobileDevice === false &&
      this.showQrCodeModal &&
      !environmentConfig.getConfig().isDev
    );
  }

  get isTreadmillOn() {
    return (
      !this.testMode &&
      !this.root.pauseMenuViewStore.isPaused &&
      !this.questionMode &&
      !this.showScoreBoard &&
      //TODO: check on this
      !this.root.settingsViewStore.isLimitedAnimations
    );
  }

  get questionCounter() {
    // Filter out any tutorial question IDs that may have been added
    const filteredAttempts = { ...this.attemptsPerQuestion };
    const keysToFilter = Object.keys(filteredAttempts).filter((id) =>
      id.includes('tutorial')
    );

    // Remove any tutorial questions from the count
    keysToFilter.forEach((key) => {
      delete filteredAttempts[key];
    });

    // Count only non-tutorial questions
    const count = Object.keys(filteredAttempts).length;
    return count;
  }

  get showPauseModal() {
    return (
      this.root.pauseMenuViewStore.isPaused ||
      this.root.gameLoginViewStore.forceLogin
    );
  }

  get gameStarted() {
    return this.selectedHero !== -1;
  }

  setIsSponsorLayerOnScreen = action((isOnScreen: boolean) => {
    this.isSponsorLayerOnScreen = isOnScreen;
  });

  setTriviaTimerInterval = action((i: NodeJS.Timeout | null) => {
    this.triviaTimerInterval = i;
  });

  setGameSpeed = action((speed: number) => {
    this.gameSpeed = speed;
  });

  setHintIdx = action((idx: number) => {
    this.hintIdx = idx;
  });

  setTestMode = action((testMode: boolean) => {
    this.testMode = testMode;
  });

  setCurrentRandomLayerArr = action((arr: number[]) => {
    this.currentRandomLayerArr = arr;
  });

  setTriviaTimerTimeout = action((t: NodeJS.Timeout | null) => {
    this.triviaTimerInterval = t;
  });

  setShrinkProgress = action((value: boolean) => {
    this.shrinkProgress = value;
  });

  startTriviaTimer = action(
    (
      startDelay = 3000, // Default 3 seconds delay before timer starts
      maxTime = 5, // Default max time of 5 seconds
      scoringFactor = 5 // Default decay factor for the score calculation
    ) => {
      // Clear any existing timers to prevent multiple timers running simultaneously
      if (this.triviaTimerInterval) {
        clearInterval(this.triviaTimerInterval);
        this.triviaTimerInterval = null;
      }

      if (this.triviaTimerTimeout) {
        clearTimeout(this.triviaTimerTimeout);
        this.triviaTimerTimeout = null;
      }

      // Reset the score to initial value
      this.root.scoreViewStore.setCurrQScore(300);

      // Start a timeout before starting the trivia timer
      this.triviaTimerTimeout = setTimeout(() => {
        // Capture the start time in milliseconds
        const startTime = Date.now();

        this.triviaTimerInterval = setInterval(() => {
          const elapsedTime = (Date.now() - startTime) / 1000;
          const newScore = Math.max(
            300 - Math.floor((elapsedTime / scoringFactor) * 300),
            0
          );

          this.root.scoreViewStore.setCurrQScore(newScore);

          if (elapsedTime >= maxTime) {
            if (this.triviaTimerInterval) {
              clearInterval(this.triviaTimerInterval);
              this.triviaTimerInterval = null;
            }
          }
        }, 100);
      }, startDelay);
    }
  );

  handlePlayerIntersection = action((payload: any) => {
    if (payload?.rigidBodyObject?.name === 'player') {
      this.root.questionViewStore.setReachPlayer(true); // Player has reached the question, show it
      this.setQuestionMode(true); // Enable question mode
    }
  });

  setHeroHeight = action((height: number) => {
    this.heroHeight = height;
  });

  setCurrentSlideIndex = action((i: number) => {
    this.currentSlideIndex = i;
  });

  setShowTutorialModal = action((bool: boolean) => {
    this.showTutorialModal = bool;
  });

  setSelectedHero = action(async (index: number) => {
    // Update local state immediately for responsiveness
    this.selectedHero = index;

    try {
      const gameSession = this.root.gameViewStore.gameSession;
      const heroDataArray = this.root.gameViewStore.herosData as IGlb[]; // Assume herosData is IGlb[]

      if (!gameSession || !gameSession.sessionId) {
        console.error(
          '[GamePlayViewStore] No active game session ID found to update selected hero.'
        );
        return;
      }

      if (index < 0 || index >= heroDataArray.length) {
        console.error('Invalid hero index selected:', index);
        return;
      }

      const selectedHeroData = heroDataArray[index];

      // Explicitly check the object before accessing objId
      if (!selectedHeroData) {
        console.error(
          `[GamePlayViewStore] No hero data found at index: ${index} in heroDataArray.`
        );
        return;
      }
      if (!selectedHeroData.objId) {
        console.error(
          `[GamePlayViewStore] Hero data found at index ${index}, but objId is missing:`,
          JSON.parse(JSON.stringify(selectedHeroData))
        );
        // Try to use 'id' as fallback if objId is missing
        if ((selectedHeroData as any).id) {
          console.log(
            '[GamePlayViewStore] Using id as fallback for objId:',
            (selectedHeroData as any).id
          );
          const heroIdentifier = (selectedHeroData as any).id;

          // Call the database update function with fallback id
          const updateResult = await updateGameSession({
            db: this.root.db,
            sessionId: gameSession.sessionId,
            keyValPair: { selectedHero: heroIdentifier },
          });

          console.log(
            '[GamePlayViewStore] Database update result (using id):',
            updateResult
          );
          return;
        } else {
          console.error(
            '[GamePlayViewStore] Neither objId nor id found on hero data'
          );
          return;
        }
      }

      const heroIdentifier = selectedHeroData.objId; // Use .objId
      console.log(
        '[GamePlayViewStore] Using objId for database update:',
        heroIdentifier
      );

      // Call the database update function
      const updateResult = await updateGameSession({
        db: this.root.db, // Assuming db is accessible at this.root.db
        sessionId: gameSession.sessionId,
        keyValPair: { selectedHero: heroIdentifier }, // Update only the selectedHero field
      });

      // Check if the update or upsert was successful
      if (
        !updateResult ||
        (updateResult.modifiedCount === 0 && !updateResult.upsertedId)
      ) {
        console.warn(
          'Failed to update or upsert selected hero in the database for session:',
          gameSession.sessionId,
          'Result:',
          updateResult
        );
        // Potentially revert local state or show an error message?
      }
    } catch (error) {
      console.error(
        '[GamePlayViewStore] Error updating selected hero in database:',
        error
      );
      // Handle error appropriately, maybe show a notification to the user
    }
  });

  setPauseMenuTabIdx = action((index: number) => {
    this.pauseMenuTabIdx = index;
  });

  setShouldCheckAccess = action((bool: boolean) => {
    this.shouldCheckAccess = bool;
  });

  setLoginRequired = action((lvl: number) => {
    this.loginLvl = lvl;
  });

  setCameraSlider = action((xaxes: number) => {
    this.cameraSlider = xaxes;
  });

  setAchievement = action((data: any) => {
    if (!data) {
      this.gotAchievement = undefined;
      return;
    }

    // If type is provided, use it to determine position
    if (data.type) {
      let position = data.position;

      // If no position specified, determine based on type
      if (!position) {
        switch (data.type) {
          case 'coin':
            position = 'bottom'; // Coins go to the bottom
            break;
          case 'penalty':
            position = 'top'; // Penalties go to the top
            break;
          case 'trivia':
          case 'hero':
            position = 'middle'; // Trivia and hero achievements in the middle
            break;
          default:
            position = 'middle'; // Default position
        }
      }

      // Set the position in the data
      this.gotAchievement = { ...data, position };
      return;
    }

    // Fallback to old text-based logic for backward compatibility
    let position = data.position;

    // If no position is specified, determine based on content
    if (!position) {
      if (
        data.text.includes('Trivia Time!') ||
        data.text.includes('🏆') ||
        data.text.includes('🎯') ||
        data.text.includes('⚡')
      ) {
        position = 'middle';
      } else if (data.text.includes('+100')) {
        position = 'bottom';
      } else if (data.text.includes('-50')) {
        position = 'top';
      } else {
        position = 'middle';
      }
    }

    // Set the position in the data
    this.gotAchievement = { ...data, position };
  });

  setQuestionMode = action((mode: boolean) => {
    this.questionMode = mode;
  });

  setGestureMovementKey = action(
    (key: string, count: number, force: number) => {
      this.gestureKey = { key, count, force };
    }
  );

  setHurt = action((isHurt: boolean) => {
    this.isHurt = isHurt;
  });

  setMobile = action((isMob: boolean) => {
    this.isMobile = isMob;
  });

  setShowScoreboardModal = action(async (show: boolean) => {
    this.showScoreBoard = show;

    if (show) {
      await waitForSpecifiedTime(3);
      this.root.endGameViewStore.setIsEndGameModalOpen(true);
    }
  });

  // setLaneSelection = action((laneType: laneType) => {
  //   this.laneSelected = laneType;
  // });

  setSensitivity = action((sensitivity: number) => {
    this.sensitivity = sensitivity;
  });

  setPlayGame = action((val: boolean) => {
    this.playGame = val;
    if (!val) {
      // When stopping play, set the flag in GameViewStore
      // this.root.gameViewStore.setReturnedFromGame();
    }
  });

  setFirstTimeAnswers = action((count: number) => {
    this.firstTimeAnswers = count;
  });

  setCurrentQuestionFunFactCount = action((cnt: number) => {
    this.currentQuestionFunFactCount = cnt;
  });

  setIsTutorial = action((isTutorial: boolean) => {
    this.isTutorial = isTutorial;
    if (!isTutorial) {
      // Reset game state when exiting tutorial
      this.resetGameState();
    }
  });

  setIsTutorialCompleted = action((completed: boolean) => {
    this.isTutorialCompleted = completed;
  });

  setShowTutorialIntro = action((show: boolean) => {
    this.showTutorialIntro = show;
  });

  setShowLaneSelect = action((show: boolean) => {
    this.showLaneSelect = show;
  });

  setAttemptForQuestion = action((questionId: string, attempts: number) => {
    // Skip recording attempts when in tutorial mode (regardless of the question ID)
    if (this.isTutorial) {
      return;
    }

    // Also skip if this is specifically a tutorial question ID (just as a safety measure)
    if (questionId.includes('tutorial')) {
      return;
    }

    this.attemptsPerQuestion[questionId] = attempts;
  });

  setShowGameUI = action((show: boolean) => {
    this.showGameUI = show;
  });

  setShowFollowupTxt = action((bool: boolean) => {
    this.showFollowupTxt = bool;
  });

  setAnswerColors = action((colors: IAnswerColors) => {
    // Ensure all color values have the '#' prefix removed
    this.answerColors = {
      a: colors.a.replace('#', ''),
      b: colors.b.replace('#', ''),
      c: colors.c.replace('#', ''),
      d: colors.d.replace('#', ''),
    };
  });

  initAnswerColors = action(() => {
    const currentModule = this.root.moduleViewStore.currentModule;
    if (currentModule?.answerColors) {
      this.setAnswerColors(currentModule.answerColors);
    }
  });

  //TODO:Refactor refs
  handleKeyDown = ({
    e,
    playerRef,
    pressedKeys,
    currentLaneIndexRef,
    lanePositions,
    setTargetX,
    updateAnimation,
    isOnFloor,
  }: {
    e: KeyboardEvent;
    playerRef: MutableRefObject<RapierRigidBody | null>;
    pressedKeys: MutableRefObject<Set<unknown>>;
    currentLaneIndexRef: MutableRefObject<number>;
    lanePositions: number[];
    setTargetX: (num: number) => void;
    updateAnimation: (animName: AVA_ANIM) => void;
    isOnFloor: MutableRefObject<boolean>;
  }) => {
    if (!playerRef.current || this.root.gamePlayViewStore.showScoreBoard)
      return;
    // if (this.root.gamePlayViewStore.laneSelected === 'Free movement') {
    //   pressedKeys.current.add(e.code);
    // }
    if (this.root.gamePlayViewStore.laneSelected) {
      if (e.code === 'ArrowLeft') {
        if (currentLaneIndexRef.current > 0) {
          currentLaneIndexRef.current -= 1;
          setTargetX(lanePositions[currentLaneIndexRef.current]);
          updateAnimation(AVA_ANIM.RUN_LEFT);
        }
      }

      if (e.code === 'ArrowRight') {
        if (currentLaneIndexRef.current < lanePositions.length - 1) {
          currentLaneIndexRef.current += 1;
          setTargetX(lanePositions[currentLaneIndexRef.current]);
          updateAnimation(AVA_ANIM.RUN_RIGHT);
        }
      }

      if (e.code === 'ArrowUp' && isOnFloor.current) {
        playerRef.current.applyImpulse(
          { x: 0, y: this.root.movementViewStore.jumpHeight, z: 0 },
          true
        );
        updateAnimation(AVA_ANIM.JUMP);
      }

      if (e.code === 'ArrowDown' && !isOnFloor.current) {
        playerRef.current.applyImpulse(
          { x: 0, y: -this.downwardForce * 4, z: 0 },
          true
        );
      }
    }
  };

  handleKeyUp = ({
    e,
    playerRef,
    pressedKeys,
  }: {
    e: KeyboardEvent;
    playerRef: MutableRefObject<RapierRigidBody | null>;
    pressedKeys: MutableRefObject<Set<unknown>>;
  }) => {
    if (!playerRef.current) return;
    pressedKeys.current.delete(e.code);
  };

  fetchReqData = action(async (fullListRef: MutableRefObject<IGlb[]>) => {
    if (
      !this.root.translateViewStore.originalGameData ||
      !this.root.translateViewStore.translatedGameData
    ) {
      console.error('Cannot fetch 3D objects: Translated game data not found.');
      return;
    }
    const dataList: any[] = [];
    const funFactsMap: ObstacleFunFacts = {};
    ////TO-DO DON'T NEED ALL OBSTACLES...
    if (fullListRef.current.length === 0) {
      const list = await fetch3DObjects(this.root.db);
      fullListRef.current = [...list];
    }

    // Get obstacle data directly from the current module configuration
    const currentModule = this.root.moduleViewStore.currentModule;
    if (!currentModule) {
      console.error('[fetchReqData] Current module data not available!');
      return []; // Return empty list if module data is missing
    }

    // Process dodge obstacles
    const dodgeObs = currentModule.selectedDodge || [];
    if (dodgeObs.length > 0) {
      funFactsMap['dodge_obstacle'] = [];
      for (const objId of dodgeObs) {
        const found = fullListRef.current.find(
          (item: IGlb) => item.objId === objId
        );
        if (found?.funFacts && Array.isArray(found.funFacts)) {
          const formattedFacts: FunFact[] = found.funFacts.map(
            (factObj: { fact: string }, index: number) => ({
              id: `${found.objId}_fact_${index}`,
              idx: index,
              title: found.title || 'Fun Fact',
              text: factObj.fact,
              seenCount: 0,
              modelData: {
                title: found.title,
                objId: found.objId,
                obstacleType: 'dodge_obstacle',
              },
            })
          );
          funFactsMap['dodge_obstacle'].push(...formattedFacts);

          this.root.translateViewStore.originalGameData.obstacles[found.objId] =
            {
              title: found.title || 'Fun Fact',
              funFacts: found.funFacts.map((f) => f.fact),
            };
        }
      }
    }

    // Process jump obstacles
    const jumpObs = currentModule.selectedJump || [];
    if (jumpObs.length > 0) {
      funFactsMap['jump_obstacle'] = [];
      for (const objId of jumpObs) {
        const found = fullListRef.current.find(
          (item: IGlb) => item.objId === objId
        );
        if (found?.funFacts && Array.isArray(found.funFacts)) {
          const formattedFacts: FunFact[] = found.funFacts.map(
            (factObj: { fact: string }, index: number) => ({
              id: `${found.objId}_fact_${index}`,
              idx: index,
              title: found.title || 'Fun Fact',
              text: factObj.fact,
              seenCount: 0,
              modelData: {
                title: found.title,
                objId: found.objId,
                obstacleType: 'jump_obstacle',
              },
            })
          );
          funFactsMap['jump_obstacle'].push(...formattedFacts);

          this.root.translateViewStore.originalGameData.obstacles[found.objId] =
            {
              title: found.title || 'Fun Fact',
              funFacts: found.funFacts.map((f) => f.fact),
            };
        }
      }
    }

    // Process slide obstacles
    const slideObs = currentModule.selectedSlide || [];
    if (slideObs.length > 0) {
      funFactsMap['slide_obstacle'] = [];
      for (const objId of slideObs) {
        const found = fullListRef.current.find(
          (item: IGlb) => item.objId === objId
        );
        if (found?.funFacts && Array.isArray(found.funFacts)) {
          const formattedFacts: FunFact[] = found.funFacts.map(
            (factObj: { fact: string }, index: number) => ({
              id: `${found.objId}_fact_${index}`,
              idx: index,
              title: found.title || 'Fun Fact',
              text: factObj.fact,
              seenCount: 0,
              modelData: {
                title: found.title,
                objId: found.objId,
                obstacleType: 'slide_obstacle',
              },
            })
          );
          funFactsMap['slide_obstacle'].push(...formattedFacts);

          this.root.translateViewStore.originalGameData.obstacles[found.objId] =
            {
              title: found.title || 'Fun Fact',
              funFacts: found.funFacts.map((f) => f.fact),
            };
        }
      }
    }

    // Process hero data separately
    for (let i = 0; i < this.root.gameViewStore.herosData.length; i++) {
      const found = fullListRef.current.find(
        (item: any) => item.objId === this.root.gameViewStore.herosData[i].id
      );
      if (found) {
        const heroData = {
          title:
            found.title && found.title.length > 0
              ? found.title
              : `Character ${i + 1}`,
          description: found.description ?? 'Your Awesome Character 3d Model!',
        };
        dataList.push(heroData);
        this.root.translateViewStore.originalGameData.heroes.push(heroData);
      } else {
        const heroData = {
          title: `Character ${i + 1}`,
          description: 'Your Awesome Character 3d Model!',
        };
        dataList.push(heroData);
        this.root.translateViewStore.originalGameData.heroes.push(heroData);
      }
    }

    if (
      this.root.translateViewStore.currentLanguage !==
      this.root.translateViewStore.defaultLanguage
    ) {
      await this.root.translateViewStore.translate3DObjects();
    } else {
      this.root.translateViewStore.translatedGameData.heroes =
        this.root.translateViewStore.originalGameData.heroes;
      this.root.translateViewStore.translatedGameData.obstacles =
        this.root.translateViewStore.originalGameData.obstacles;
    }

    // Update the fun facts store with the collected data
    this._funFacts = funFactsMap;
    return dataList;
  });

  resetGamePlay = action(() => {
    this.attemptsPerQuestion = {};
    this.selectedHero = -1;
    this.collectedHints = [];
    this.gestureKey = { event: '', count: 0 };
    this.firstTimeAnswers = 0;
    this.isTutorial = true;
    this.isTutorialCompleted = false;
  });

  buildRandomLayerArr = action(() => {
    const { questionAtLayer } = this.root.questionViewStore;

    // Create array of indices from 0 to layerCount-1
    const indices = Array.from({ length: questionAtLayer }, (_, i) => i);

    // Shuffle the array using Fisher-Yates algorithm
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Return first questionAtLayer elements
    this.setCurrentRandomLayerArr(indices.slice(0, questionAtLayer));
  });

  addQuestionLayer = action(() => {
    this.root.questionViewStore.setIsQuestionLayerActive(true);
    this.addGameLayer(this.root.obstacleViewStore.questionLayers[0]);
  });

  shouldIncreaseLayerCounter = (layer: IObstacleLayer) => {
    if (layer.layerType === EObstacleLayerType.hint) {
      return false;
    } else if (layer.layerType === EObstacleLayerType.sponsor) {
      return false;
    }

    return true;
  };

  addGameLayer = action((layer: IObstacleLayer) => {
    this.root.questionViewStore.setLayerCounter(
      this.root.questionViewStore.layerCounter + 1
    );

    if (
      this.root.questionViewStore.layerCounter ===
      this.root.questionViewStore.questionAtLayer
    ) {
      setTimeout(() => {
        this.root.questionViewStore.setProgress(100);
      }, 3000);
    } else if (
      this.root.questionViewStore.layerCounter >=
      this.root.questionViewStore.questionAtLayer - 3
    ) {
      this.root.questionViewStore.setProgress(
        (Math.max(this.root.questionViewStore.layerCounter - 1, 0) /
          this.root.questionViewStore.questionAtLayer) *
          100
      );
    } else {
      this.root.questionViewStore.setProgress(
        (Math.max(this.root.questionViewStore.layerCounter - 2, 0) /
          this.root.questionViewStore.questionAtLayer) *
          100
      );
    }

    // Create a new map with both obstacles and collectables
    const newObstaclesMap = { ...this.root.obstacleViewStore.obstaclesMap };

    // Add obstacles to the map
    layer?.obstacles?.forEach((item: ObstacleType) => {
      this.root.obstacleViewStore.setObsCounter(
        this.root.obstacleViewStore.obsCounter + 1
      );
      const instance = this.root.obstacleViewStore.getObsInstance(item.type);

      if (instance) {
        item.position.y = this.root.obstacleViewStore.getSpecifiedObsPos(
          item.position,
          item.boxArg
        ).y;
        newObstaclesMap[instance.id] = {
          position: item.position,
          boxArg: item.boxArg,
          type: item.type,
          id: instance.id,
          instance,
        };

        if (item.type === EObstacleModelType.hint) {
          newObstaclesMap[instance.id].text =
            this.root.translateViewStore.translatedGameData?.questions[
              this.root.gameViewStore.questionsData[this.questionCounter].id
            ]?.hints[this.hintIdx].title;
          this.setHintIdx(this.hintIdx + 1);
        }
      }
    });

    // Update the obstacles map with all items
    this.root.obstacleViewStore.setObstacles(newObstaclesMap);
  });

  // handleUnpause = action(() => {
  //   this.root.questionViewStore.setStartTimeRef(moment().valueOf());
  //   this.root.questionViewStore.setElapsedTimeRef(0);

  //   this.root.questionViewStore.setTimeoutRef(
  //     setTimeout(() => {
  //       this.addLayer(this.root.questionViewStore.randInd);
  //     }, this.root.questionViewStore.remainingTimeRef)
  //   );
  // });

  get funFacts(): ObstacleFunFacts {
    return this._funFacts;
  }

  private set funFacts(value: ObstacleFunFacts) {
    this._funFacts = value;
  }

  showFunFactForObstacle = action((obstacleType: string) => {
    // Get available facts for this obstacle type
    const availableFacts = this._funFacts[obstacleType] || [];

    // If no facts are available, just return without pausing
    if (!availableFacts.length) {
      return;
    }

    // Try to find an unseen fact for this obstacle
    const unseenFact = availableFacts.find(
      (fact) => !this.seenFunFacts.has(fact.id)
    );

    if (unseenFact) {
      this.showFunFact(unseenFact);
      this.currentQuestionFunFactCount++; // Increment count of facts shown
      this.root.obstacleViewStore.setFunFactShownThisQuestion(true);
    }

    // // If all facts for this obstacle are seen, try to find an unseen fact from any obstacle
    // for (const [type, facts] of Object.entries(this._funFacts)) {
    //   if (type === obstacleType) continue; // Skip current obstacle type

    //   const unseenFactFromOther = facts.find(
    //     (fact) => !this.seenFunFacts.has(fact.id)
    //   );
    //   if (unseenFactFromOther) {
    //     this.showFunFact(unseenFactFromOther);
    //     this.currentQuestionFunFactCount++; // Increment count of facts shown
    //     return;
    //   }
    // }
  });

  showFunFact = action((fact: FunFact) => {
    // Mark the fact as seen
    this.markFactAsSeen(fact.id);
    fact.seenCount++;

    // Show the fun fact modal
    this.root.pauseMenuViewStore.setCurrentFunFact(fact);
    this.root.pauseMenuViewStore.setShowFunFactModal(true);

    // Start the timer to allow closing
    setTimeout(() => {
      this.root.pauseMenuViewStore.setCanCloseFunFact(true);
    }, 3000);
  });

  private markFactAsSeen = action((factId: string) => {
    this.seenFunFacts.add(factId);
  });

  hasSeenAllFunFacts = computed(() => {
    let totalFacts = 0;
    Object.values(this._funFacts).forEach((facts) => {
      totalFacts += facts.length;
    });
    return this.seenFunFacts.size >= totalFacts;
  });

  // Generic helper function to create a typed achievement
  createAchievement = (
    text: string,
    type: 'hero' | 'trivia' | 'coin' | 'penalty' | 'positive' | 'default',
    position?: 'top' | 'middle' | 'bottom' | 'left',
    style?: React.CSSProperties,
    duration?: number
  ) => {
    return {
      text,
      type,
      position,
      style,
      duration,
    };
  };

  // Convenience methods for common achievement types
  createTriviaAchievement = (
    text: string,
    style?: React.CSSProperties,
    duration?: number
  ) => {
    return this.createAchievement(text, 'trivia', 'middle', style, duration);
  };

  createTutorialHintAchievement = (text: string, duration?: number) => {
    return this.createAchievement(
      text,
      'default',
      'middle',
      {
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '1.2rem',
      },
      duration || 3.5
    );
  };

  createCoinAchievement = (text: string, duration?: number) => {
    return this.createAchievement(text, 'coin', 'left', undefined, duration);
  };

  createPenaltyAchievement = (text: string, duration?: number) => {
    // Setting default duration to 0.5 seconds unless explicitly specified
    return this.createAchievement(
      text,
      'penalty',
      'left',
      undefined,
      duration || 0.5
    );
  };

  createHeroAchievement = (
    text: string,
    style?: React.CSSProperties,
    duration?: number
  ) => {
    // For selection confirmation messages, format with line break if it contains "You chose"
    if (text.includes('You chose')) {
      // Extract the hero title from the text
      const heroTitle = text.replace('You chose ', '').replace('!', '');
      // Create formatted text with line break
      text = `You chose\n${heroTitle}!`;
    }

    // Use longer duration for hero achievements by default (4 seconds)
    return this.createAchievement(
      text,
      'hero',
      'middle',
      style,
      duration || 4.0
    );
  };

  createPositiveAchievement = (text: string, duration?: number) => {
    return this.createAchievement(
      text,
      'positive',
      'middle',
      undefined,
      duration
    );
  };

  // New method for review bonus achievement
  createReviewBonusAchievement = (text: string, duration?: number) => {
    return {
      text,
      type: 'positive',
      position: 'middle',
      style: {
        color: '#4CAF50',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
      },
      duration: duration || 3.0,
    };
  };

  // Special game events achievements
  showLaneSelectionMessage = action(() => {
    this.setAchievement(
      this.createAchievement(
        'Dodge Obstacles! Or lose points.',
        'hero',
        'middle',
        undefined,
        3.0
      )
    );
  });

  showObstaclePenalty = action(() => {
    this.setAchievement(this.createPenaltyAchievement('-50'));

    // Play penalty sound if enabled
    if (this.root.settingsViewStore.isSoundEffectsChecked) {
      try {
        const hitSound = new Audio('/assets/audio/soundeffects/ouch.wav');
        hitSound.volume = 0.3;
        hitSound.play();
      } catch (error) {
        console.error('Error playing hit sound:', error);
      }
    }

    this.root.scoreViewStore.subtractScore(ScoreSubtractions.obstacleHit);
  });

  resetGameState = action(() => {
    // Reset score and progress
    this.root.scoreViewStore.reset();
    this.root.collectableViewStore.resetCoins();
    this.firstTimeAnswers = 0;
    this.collectedHints = [];
    this.setQuestionMode(false);
    this.root.questionViewStore.setShowQuestionModal(false);
    this.root.questionViewStore.setShowAnswers(false);
    this.root.questionViewStore.setIsReading(false);
    this.root.questionViewStore.setSelectedOption(-1);
    this.root.questionViewStore.setHoveredOption('');
    this.root.questionViewStore.setShowFullQuestion(false);
    this.root.questionViewStore.setIsProcessing(false);
    this.root.questionViewStore.setCurrentQTries(1);
    this.root.questionViewStore.setProgress(0);
    this.root.questionViewStore.setLayerCounter(0);
    this.root.questionViewStore.setHintCounter(0);
  });

  // Computed property to determine if game is active
  get isGameActive() {
    return (
      !this.root.pauseMenuViewStore.isPaused &&
      !this.isTutorial &&
      !this.root.endGameViewStore.isEndGameModalOpen
    );
  }

  startGameTimer = action(() => {
    if (!this.gameStartTime) {
      this.gameStartTime = Date.now();
    }

    this.timerInterval = setInterval(() => {
      this.gameTimer = Date.now() - this.gameStartTime;
    }, 1000);
  });

  pauseGameTimer = action(() => {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  });

  resetGameTimer = action(() => {
    this.pauseGameTimer();
    this.gameStartTime = 0;
    this.gameTimer = 0;
  });

  // Clean up on unmount
  cleanup() {
    this.pauseGameTimer();
  }

  // Add new methods for QR code modal
  setShowQrCodeModal = action((show: boolean) => {
    this.showQrCodeModal = show;
    if (!show) {
      // Store preference in localStorage when dismissed
      localStorage.setItem('qrCodeModalDismissed', 'true');
    }
  });

  setIsActualMobileDevice = action((isMobile: boolean) => {
    this.isActualMobileDevice = isMobile;
    sessionStorage.setItem('isActualMobileDevice', String(isMobile));
  });

  detectActualMobileDevice = action(() => {
    // First check session storage for previous detection
    const savedDetection = sessionStorage.getItem('isActualMobileDevice');
    if (savedDetection !== null) {
      this.isActualMobileDevice = savedDetection === 'true';
      return;
    }

    // Otherwise detect based on user agent and touch capability
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileUserAgent =
      /android|webos|iphone|ipad|ipod|blackberry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    const hasTouchScreen =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Make determination based on multiple factors
    const result = isMobileUserAgent || hasTouchScreen;

    // Save to state and session storage
    this.setIsActualMobileDevice(result);
  });
}
