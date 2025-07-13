import {
  action,
  makeAutoObservable,
  reaction,
  runInAction,
  observable,
  ObservableMap,
  toJS,
  set,
  get,
  computed,
} from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import gsap from 'gsap';
import { defaultThemeData } from '../Constants';
import {
  getCurrUsrModProgress,
  getGameSessionByQs,
  getImgbyId,
  getModItms,
  getModuleById,
  getThemeData,
  IGlb,
  IDBPlayedQuestion,
  IDbQuestion,
  IGameSessionQuestions,
  IPlayedQuestionMap,
  IQuestData,
  LoginLvl,
  splitIndexes,
  updateGameSession,
  updateUserModuleProgress,
  ICustomModule,
  IGameSession,
  IQuestionReviewAnalytics,
  IViewedSections,
  loadGLTFModel,
  fetchModuleObjects,
  GLBType,
  EObstacleModelType,
  DefaultOrCustom,
} from '@lidvizion/commonlib';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons';
import { CurrentEndGameStep } from '../Common';
import { isArray } from 'lodash';
import { Vector3 } from 'three';
import { QuestStatus } from '../quest/QuestLineProps';
import DDLogo from '../../../../../libs/commonlib/src/lib/commonmodels/assets/digidashlogos/dd-logo-white500x500.svg';

export interface IPrizeCode {
  type: 'manual' | 'auto';
  code: string;
  points: string;
  isRedeemed?: boolean;
}

export interface ILogoData {
  s3Url: string;
}

export interface IGameSessionQuestion {
  id: string;
  tries: number;
  played: boolean;
  reviewed?: boolean;
  reviewAnalytics?: IQuestionReviewAnalytics;
  viewedSections?: IViewedSections;
  bonusPoints?: number;
  speedBonus?: number;
}

export class GameViewStore {
  root: RootStore;
  settings: ICustomModule = {
    moduleId: 'default-game',
    sponsors: [],
    settings: {
      music: true,
      limit: 10,
      random: false,
      gTitle: 'Digi-Dash',
      gDesc: '',
      url: '',
      gameLoginLvl: LoginLvl.none,
    },
  };
  isRotating = false;
  prizeCode: IPrizeCode | undefined = undefined;
  questionsData: any[] = [];
  obstaclesData = { dodgeObs: [], jumpObs: [], slideObs: [] };
  herosData: any[] = [];
  floorRef: any = null;
  heroSelGLTFMap: any = {};
  avaSelectHelper = { event: '', count: 0 };
  selectedIndex = -1;
  themeData = defaultThemeData;
  playedQuestions: IPlayedQuestionMap = {};
  apiQuestions: any[] = [];
  showAllQs = false;
  prevPlayedQs: string[] = [];
  questData: IQuestData = {
    questAttempt: 1,
  };
  logoData: ILogoData | null = null;
  bannerData: ILogoData | null = null;
  gameId = '';
  gameSession: IGameSession & { bonusGiven?: boolean } = {
    providerType: 'anon-user',
    sessionId: uuidv4(),
    ip: '',
    startTime: moment().valueOf(),
    endTime: null,
    questions: {},
    questionsAnswered: 0,
    correctAnswers: 0,
    score: 0,
    coins: 0,
    selectedHero: '',
    gameId: '',
    gameUrl: '',
    questAttempt: 1,
    questPart: 1,
    bonusGiven: false,
  };
  showMenuScreen = false;
  avaSelectisplayData: any[] = [];
  @observable questProgress: Record<number, QuestStatus> = {};
  @observable justReturnedFromGame = false;

  private frameCallbacks: ((delta: number) => void)[] = [];
  private lastSpawnTime: number = performance.now();
  private currentRotation = 0;
  private previousIndex = 0;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this, {
      gameSession: observable.deep,
    });
    this.addIp();
    this.detectDeviceInfo();
    
    reaction(
      () => this.questData.questAttempt,
      () => {
        if (
          this.root.gameLoginViewStore.currUser &&
          this.root.gameLoginViewStore.currUser.providerType !== 'anon-user' &&
          this.root.gameLoginViewStore.currUser.uid &&
          this.root.moduleViewStore.currentModule?.moduleId &&
          this.questData.questAttempt > 1
        ) {
          updateUserModuleProgress({
            db: this.root.db,
            uid: this.root.gameLoginViewStore.currUser?.uid,
            moduleId: this.root.moduleViewStore.currentModule?.moduleId,
            questData: this.questData,
          });
        }
      }
    );
    reaction(
      () =>
        [this.gameSession.questPart, this.questionsData.length] as [
          number,
          number
        ],
      ([currentPart, numQuestions]) => {
        if (numQuestions > 0 && currentPart !== undefined) {
          this.initializeQuestProgress(currentPart, numQuestions);
        }
      },
      { fireImmediately: true }
    );
    reaction(
      () => this.justReturnedFromGame,
      (returned) => {
        if (returned) {
          this.advanceQuest();
          runInAction(() => {
            this.justReturnedFromGame = false;
          });
        }
      }
    );

    reaction(
      () => this.gameSession,
      async () => {
        try {
          await updateGameSession({
            db: this.root.db,
            sessionId: this.gameSession.sessionId,
            gameSession: this.gameSession,
          });
        } catch (error) {
          console.error('Error updating game session:', error);
        }
      }
    );
  }

  get totalQuestParts() {
    const totalQuestions = this.getApiQuestions().length;

    if (totalQuestions > 0) {
      const parts = splitIndexes(totalQuestions);
      return parts;
    }

    // Fallback to settings limit if no questions available
    const fallback = this.settings?.settings?.limit || 1;
    return { parts: fallback, questionsInParts: [] };
  }

  get playLabel() {
    return this.root.translateViewStore.translatedGameData?.playLabel || 'Play';
  }

  get groundWidth() {
    // Camera FOV is 60 degrees and positioned at z=5 for gameplay
    const fov = this.root.cameraViewStore.fov;
    const cameraZ = 5;
    // Calculate visible width at z=0 plane using tangent
    const halfFovRadians = (fov / 2) * (Math.PI / 180);
    const visibleWidth = Math.abs(2 * cameraZ * Math.tan(halfFovRadians));
    return visibleWidth;
  }

  get laneSize() {
    return this.groundWidth / 3;
  }

  get displayNameToShow() {
    return this.root.gameLoginViewStore.isAnonLogin
      ? 'Guest'
      : this.root.gameLoginViewStore.currUser?.displayName || 'User';
  }

  get settingsLabel() {
    return (
      this.root.translateViewStore.translatedGameData?.settingsLabel ||
      'Settings'
    );
  }

  get retryQuestLabel() {
    return (
      this.root.translateViewStore.translatedGameData?.retryQuestLabel ||
      'retry quest'
    );
  }

  get ofLabel() {
    return this.root.translateViewStore.translatedGameData?.ofLabel || 'of';
  }

  get partLabel() {
    return this.root.translateViewStore.translatedGameData?.partLabel || 'Part';
  }

  get welcomeLabel() {
    return (
      this.root.translateViewStore.translatedGameData?.welcomeLabel ||
      'Welcome,'
    );
  }

  get nextQuestion() {
    const nextQ = this.questionsData.find((q) => {
      if (!this.playedQuestions[q.id]) {
        return true;
      }

      return false;
    });

    return nextQ;
  }

  get showAvaSelectDescription() {
    return (
      this.selectedIndex !== -1 &&
      this.avaSelectisplayData.length > 0 &&
      this.selectedIndex < this.avaSelectisplayData.length &&
      this.root.translateViewStore.translatedGameData
    );
  }

  initializeQuestProgress = action(
    (currentPart: number, totalParts: number) => {
      const newProgress: Record<number, QuestStatus> = {};
      const effectiveTotalParts = Math.max(1, totalParts);

      for (let i = 1; i <= effectiveTotalParts; i++) {
        if (i < currentPart) {
          newProgress[i] = 'complete';
        } else if (i === currentPart) {
          newProgress[i] = 'available';
        } else {
          newProgress[i] = 'locked';
        }
      }
      if (currentPart > effectiveTotalParts && effectiveTotalParts > 0) {
        newProgress[effectiveTotalParts] = 'complete';
      }

      this.questProgress = newProgress;
    }
  );

  advanceQuest = action(() => {
    const currentQuestPart = this.gameSession.questPart;
    const totalParts = this.totalQuestParts;
    if (currentQuestPart <= totalParts.parts) {
      this.gameSession.questPart = currentQuestPart + 1;
    }
    if (this.gameSession.questPart > totalParts.parts && totalParts.parts > 0) {
      console.log('Quest Line Completed! All parts finished.');
      runInAction(() => {
        if (this.questProgress[totalParts.parts]) {
          this.questProgress[totalParts.parts] = 'complete';
        }
      });
    }
  });

  get showCarousel() {
    return this.herosData.length > 0 && this.avaSelectisplayData.length > 0;
  }

  get currGamePlayedQuestions() {
    const arr: IDBPlayedQuestion[] = [];
    this.questionsData.forEach((q) => {
      if (this.playedQuestions[q.id]) {
        arr.push(this.playedQuestions[q.id]);
      }
    });
    return arr;
  }

  setShowMenuScreen = action((val: boolean) => {
    this.showMenuScreen = val;
  });

  setAvaSelectisplayData = action((data: any[]) => {
    this.avaSelectisplayData = data;
  });

  setQuestAttempt = action((val: number) => {
    this.questData.questAttempt = val;
    this.gameSession.questAttempt = val;
  });

  handleQuestPartClick = action(async (partId: string | number) => {
    this.root.questViewStore.setIsQuestTransitioning(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (
      Object.keys(this.playedQuestions).length ===
        this.getApiQuestions().length &&
      this.totalQuestParts.parts > 0 // Ensure there are parts to play
    ) {
      // If all questions in the current set were played, reset for a new attempt of the whole quest
      this.setQuestAttempt(this.questData.questAttempt + 1);
      this.questReset();
      this.getCurrQuest(this.questData.questAttempt);
    }

    this.root.gamePlayViewStore.setPlayGame(true);
    this.setShowMenuScreen(false);
    this.root.questViewStore.setIsQuestTransitioning(false);
  });

  resetForPlayAgain = action(() => {
    if (
      Object.keys(this.playedQuestions).length === this.getApiQuestions().length
    ) {
      this.setQuestAttempt(this.questData.questAttempt + 1);
    }

    this.resetSession();
    this.setAvatarSelection({ event: '', count: -1 });

    this.root.gamePlayViewStore.setShowScoreboardModal(false);
    this.root.gamePlayViewStore.setPlayGame(false);
    this.root.gamePlayViewStore.setCameraSlider(0);

    this.root.endGameViewStore.setIsEndGameModalOpen(false);
    this.root.endGameViewStore.setCurrentStep(CurrentEndGameStep.scoreboard);

    this.root.collectableViewStore.resetCoins();
    this.playedQuestions = {};
    if (
      Object.keys(this.playedQuestions).length < this.getApiQuestions().length
    ) {
      this.gameSession.questPart = 1;
    }
    this.initializeQuestProgress(
      this.gameSession.questPart,
      this.totalQuestParts.parts
    );
  });

  setGameLoginLvl = action((lvl: number) => {
    this.settings.settings.gameLoginLvl = lvl;
  });

  setQuestData = action((data: IQuestData) => {
    this.questData = data;
    if (data.questAttempt !== undefined)
      this.gameSession.questAttempt = data.questAttempt;
    if (this.gameSession.questPart === undefined) {
      this.gameSession.questPart = 1;
    }
    this.initializeQuestProgress(
      this.gameSession.questPart,
      this.totalQuestParts.parts
    );
  });

  setPrevPlayedQs = action((qIds: string[]) => {
    this.prevPlayedQs = qIds;
  });

  setSession = action((s: any) => {
    this.gameSession = s;
  });

  resetSession = action(() => {
    this.gameSession = {
      ...this.gameSession,
      startTime: moment().valueOf(),
      questions: {},
      questionsAnswered: 0,
      correctAnswers: 0,
      score: 0,
      coins: 0,
      selectedHero: '',
    };
  });

  setLogoData = action((data: ILogoData) => {
    this.logoData = data;
  });

  setBannerData = action((data: ILogoData) => {
    this.bannerData = data;
  });

  setSelectedIndex = action((index: number) => {
    this.selectedIndex = index;
  });

  setSettings = action((data: ICustomModule) => {
    this.settings = data;
  });

  setTheme = action((data: any) => {
    this.themeData = data;
  });

  setPrizeCode = action((data: IPrizeCode) => {
    this.prizeCode = data;
  });

  redeemPrizeCode = action(() => {
    if (this.prizeCode) {
      this.prizeCode.isRedeemed = true;
    }
  });

  setQuestionsData = action((list: any[]) => {
    this.questionsData = list;
  });

  setAvatars = action((avas: any) => {
    this.herosData = [...avas];
    this.setInitialSelectedAvatar();
  });

  setObstacles = action((obs: any) => {
    this.obstaclesData = { ...obs };
  });

  setGameSession = action((s: IGameSession & { bonusGiven?: boolean }) => {
    this.gameSession = s;
  });

  setFloorRef = action((ref: any) => {
    this.floorRef = ref;
  });

  setAvatarSelection = action((key: any) => {
    this.avaSelectHelper = key;
  });

  getOffset = action(() => {
    const gap = 2;
    const len = this.herosData.length;
    let base = len - 1;

    base = -(base * gap) / 2;
    if (len % 2 !== 0) {
      base++;
    }
    return base;
  });

  getFocusOffset = action((selectedIndex: number) => {
    const gap = 2;
    const len = this.herosData.length;
    const base = ((len - 1) * gap) / 2;
    const selectedOffset = selectedIndex * gap;
    return -(base - selectedOffset);
  });

  handleGameIdChg = action((val: string) => {
    this.gameId = val;
  });

  addIp = action(async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const ipData = await response.json();
      const ip = ipData.ip;
      if (ip) {
        this.gameSession.ip = ip;
      }

      return true;
    } catch (error) {
      return null;
    }
  });

  addModelToMap = action(({ idx, model }: { idx: number; model: any }) => {
    this.heroSelGLTFMap[idx] = model;
  });

  loadHeroModel = action(async (heroData: IGlb, index: number) => {
    try {
      // Check if we already have the loaded model (new system)
      if (heroData.res && heroData.res.type) {
        const modelData = {
          scene: heroData.res,
          animations: heroData.animations || [],
        };

        this.addModelToMap({
          idx: index,
          model: modelData,
        });

        return modelData;
      }
      // Fallback to URL-based loading (old system)
      else if (heroData.url) {
        const model = await loadGLTFModel(heroData.url);
        if (model && model.scene) {
          this.addModelToMap({
            idx: index,
            model: { scene: model.scene, animations: model.animations },
          });

          return { scene: model.scene, animations: model.animations };
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error('[loadHeroModel] Error loading hero model:', error);
      return null;
    }
  });

  setApiQuestions = action((questions: any[]) => {
    this.apiQuestions = [...questions];
  });
  getApiQuestions = action(() => {
    return [...this.apiQuestions];
  });

  setShowAllQs = action((val: boolean) => {
    this.showAllQs = val;
  });

  fetchAvatars = action(
    async (defaultAvasData: IGlb[], defaultAvaAssetPath: string) => {
      try {
        // Process default avatars - use assets path as configured in project.json
        const processedDefaultAvas: IGlb[] = defaultAvasData.map((ava) => {
          const constructedUrl = `assets/models/${ava.objId}.${ava.objExt}`;

          return {
            ...ava,
            type: DefaultOrCustom.default,
            url: constructedUrl, // Path as served by webpack dev server
          };
        });

        // Process custom avatars - fetch from S3
        let processedCustomAvas: IGlb[] = [];
        if (this.settings.moduleId && this.root.db) {
          const moduleObjects = await fetchModuleObjects(
            this.root.db,
            this.settings.moduleId
          );

          if (moduleObjects && moduleObjects.avatars) {
            // Get pre-signed URLs for custom avatars
            const customAvatarPromises = moduleObjects.avatars.map(
              async (avaDef: { id: string; ext: string }) => {
                try {
                  const folderId = this.settings.uid || this.settings.moduleId;
                  const fileKey = `${folderId}/${avaDef.id}.${avaDef.ext}`;

                  // Import getPreSignedUrl from commonlib
                  const { getPreSignedUrl } = await import(
                    '@lidvizion/commonlib'
                  );
                  const preSignedUrlResponse = await getPreSignedUrl(fileKey);

                  if (
                    preSignedUrlResponse?.statusCode === 200 &&
                    preSignedUrlResponse?.body
                  ) {
                    const s3Url = preSignedUrlResponse.body.replace(
                      /^"|"$/g,
                      ''
                    ); // Remove quotes

                    const customAvatar = {
                      id: avaDef.id,
                      ext: avaDef.ext,
                      type: DefaultOrCustom.custom,
                      glbType: GLBType.avatar,
                      folderId,
                      url: s3Url, // Use the S3 pre-signed URL
                      name: avaDef.id,
                      thumbnail: undefined,
                      thumbnailUrl: undefined,
                    };

                    return customAvatar;
                  } else {
                    return null;
                  }
                } catch (error) {
                  return null;
                }
              }
            );

            const customAvatarResults = await Promise.all(customAvatarPromises);
            processedCustomAvas = customAvatarResults.filter(
              (ava): ava is IGlb => ava !== null
            );
          }
        }
        const allAvatars: IGlb[] = [
          ...processedDefaultAvas,
          ...processedCustomAvas,
        ];

        this.setAvatars(allAvatars);
        this.setInitialSelectedAvatar();
      } catch (error) {
        console.error('[fetchAvatars] Error fetching avatars:', error);
      }
    }
  );

  questReset = action(() => {
    this.playedQuestions = {};
    this.root.collectableViewStore.resetCoins();
    this.gameSession.questPart = 1;
    this.initializeQuestProgress(1, this.totalQuestParts.parts);
  });

  updateUserModProgress = action(async (attempts: number) => {
    if (
      this.root.gameLoginViewStore.currUser &&
      this.root.gameLoginViewStore.currUser?.providerType !== 'anon-user' &&
      this.root.moduleViewStore.currentModule?.moduleId &&
      this.root.db
    ) {
      this.setQuestAttempt(attempts);
      updateUserModuleProgress({
        db: this.root.db,
        uid: this.root.gameLoginViewStore.currUser.uid,
        moduleId: this.root.moduleViewStore.currentModule.moduleId,
        questData: this.root.gameViewStore.questData,
      });

      this.setGameSession({
        ...this.gameSession,
        questAttempt: this.questData.questAttempt,
      });

      await updateGameSession({
        db: this.root.db,
        sessionId: this.root.gameViewStore.gameSession.sessionId,
        keyValPair: {
          questAttempt: this.questData.questAttempt,
        },
      });
    }
  });

  getCurrQuest = action(async (attempt?: number) => {
    if (
      isArray(this.questionsData) &&
      this.root.gameLoginViewStore.currUser?.uid &&
      this.root.moduleViewStore.currentModule?.moduleId &&
      this.root.db
    ) {
      let currAttempt = 1;
      this.setQuestionsData([...this.apiQuestions]);
      if (!attempt) {
        const currModProgress = await getCurrUsrModProgress({
          uid: this.root.gameLoginViewStore.currUser.uid,
          db: this.root.db,
          moduleId: this.root.moduleViewStore.currentModule.moduleId,
        });

        if (currModProgress) {
          currAttempt = currModProgress?.questData.questAttempt;
        }
      } else {
        currAttempt = attempt;
      }

      this.setQuestAttempt(currAttempt);
      const gameSessions: IGameSession[] = await getGameSessionByQs({
        db: this.root.db,
        uid: this.root.gameLoginViewStore.currUser.uid,
        moduleId: this.root.moduleViewStore.currentModule?.moduleId,
        questAttempt: currAttempt || this.questData.questAttempt,
      });

      const uniquePlayedMapped: IGameSessionQuestions = {};

      gameSessions.forEach((s) => {
        if (s.questions) {
          Object.values(s.questions).forEach((q) => {
            uniquePlayedMapped[q.id] = q;
          });
        }
      });

      const unPlayedQs = this.questionsData.filter((q) => {
        if (uniquePlayedMapped[q.id]) {
          this.playedQuestions[q.id] = q;
          this.playedQuestions[q.id].tries = uniquePlayedMapped[q.id].tries;
        }

        return !uniquePlayedMapped[q.id];
      });

      if (unPlayedQs.length > 0) {
        const { questionsInParts } = splitIndexes(unPlayedQs.length);
        this.setQuestionsData(
          unPlayedQs.slice(0, questionsInParts[this.gameSession.questPart])
        );
      }
    }
  });

  addQidToSet = action((q: IDBPlayedQuestion) => {
    this.playedQuestions[q.id] = q;
  });

  addQToSession = action((qData: IDbQuestion) => {
    const questionId = qData.id;
    if (!this.gameSession.questions[questionId]) {
      this.gameSession.questions[questionId] = {
        id: qData.id,
        tries: 1,
        played: true,
      };
    }
  });

  addTryToQ = action(() => {
    const qid = this.root.questionViewStore.currentQuestionData?.id;

    if (qid && this.gameSession.questions[qid]) {
      const oldTries = this.gameSession.questions[qid].tries;
      this.gameSession.questions[qid].tries += 1;
    }

    if (qid && this.playedQuestions[qid]) {
      if (!this.playedQuestions[qid].tries) {
        this.playedQuestions[qid].tries = 1;
      }

      if (
        this.playedQuestions[qid]?.tries &&
        typeof this.playedQuestions[qid].tries === 'number'
      ) {
        const oldTries = this.playedQuestions[qid].tries;
        this.playedQuestions[qid].tries += 1;
      }
    }
  });

  getAdjustedPosition = (index: number) => {
    let x = 0;
    let y = 0;
    let z = 0;

    if (index === this.selectedIndex) {
      x = 0;
      y = -1.15;
      z = 0;
    } else if (index < this.selectedIndex) {
      x = index === 0 ? 3 : -3;
      y = 0.5;
      z = -4;
    } else if (index > this.selectedIndex) {
      x = index === this.herosData.length - 1 ? -3 : 3;
      y = 0.5;
      z = -4;
    }

    return new Vector3(x, y, z);
  };

  // Functions moved from AvatarSelectionScene
  getHeroGLTF = action(async () => {
    if (!this.herosData || this.herosData.length === 0) {
      return;
    }
    try {
      const loadModelPromises = this.herosData.map((hd, idx) =>
        this.loadHeroModel(hd, idx)
      );
      await Promise.all(loadModelPromises);
    } catch (error) {
      console.error('Error in getHeroGLTF:', error);
    }
  });

  finalSelectHero = action(
    (displayData: any[], selectedIndex: number, readyCountdown: number) => {
      if (readyCountdown > 0) {
        this.root.gamePlayViewStore.setSelectedHero(selectedIndex);
      } else {
        const heroTitle =
          this.root.translateViewStore.translatedGameData?.heroes[selectedIndex]
            .title || 'Unknown Hero';

        this.root.gamePlayViewStore.setAchievement(
          this.root.gamePlayViewStore.createHeroAchievement(
            `${
              this.root.translateViewStore.translatedGameData?.youChoseLabel ||
              'You chose'
            } ${heroTitle}!`,
            undefined,
            3.0
          )
        );

        return 3;
      }
      return readyCountdown;
    }
  );

  handleAvatarNavigation = action(
    (
      event: string,
      count: number,
      readyCountdown: number,
      selectedIndex: number
    ) => {
      const max = this.herosData.length - 1;

      if (event === 'left' && readyCountdown < 0) {
        this.setSelectedIndex(selectedIndex - 1 >= 0 ? selectedIndex - 1 : max);
      } else if (event === 'right' && readyCountdown < 0) {
        this.setSelectedIndex(selectedIndex + 1 > max ? 0 : selectedIndex + 1);
      } else if (event === 'enter' && count > -1) {
        return true;
      }
      return false;
    }
  );

  handleHeroSelection = action((index: number, readyCountdown = -1) => {
    if (readyCountdown < 0 && !this.isRotating) {
      this.setSelectedIndex(index);
      this.root.gamePlayViewStore.setSelectedHero(index);
    }
  });

  handleAvatarKeyDown = action(
    (keyCode: string, pressedKeys: Set<string>, triggerCounter: number) => {
      if (keyCode) {
        pressedKeys.add(keyCode);
      }

      if (pressedKeys.has('ArrowLeft')) {
        this.setAvatarSelection({ event: 'left', count: ++triggerCounter });
        return triggerCounter;
      }

      if (pressedKeys.has('ArrowRight')) {
        this.setAvatarSelection({ event: 'right', count: ++triggerCounter });
        return triggerCounter;
      }

      if (pressedKeys.has('Enter')) {
        this.setAvatarSelection({ event: 'enter', count: ++triggerCounter });
        return triggerCounter;
      }

      return triggerCounter;
    }
  );

  handleAvatarKeyUp = action((keyCode: string, pressedKeys: Set<string>) => {
    if (keyCode) {
      pressedKeys.delete(keyCode);
    }
  });

  handleAvatarGesture = action((gestureKey: any, triggerCounter: number) => {
    if (!gestureKey) return triggerCounter;

    if (gestureKey.key === 'left') {
      this.setAvatarSelection({ event: 'right', count: ++triggerCounter });
      return triggerCounter;
    }

    if (gestureKey.key === 'right') {
      this.setAvatarSelection({ event: 'left', count: ++triggerCounter });
      return triggerCounter;
    }

    return triggerCounter;
  });

  setIsRotating = action((value: boolean) => {
    this.isRotating = value;
  });

  setInitialSelectedAvatar = action(() => {
    if (this.herosData.length > 0 && this.selectedIndex === -1) {
      this.setSelectedIndex(0);
    }
  });

  detectDeviceInfo = action(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
    const isTablet = /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    // Set deviceInfo as a string as expected by the interface
    if (isMobile) {
      this.gameSession.deviceInfo = 'mobile';
    } else if (isTablet) {
      this.gameSession.deviceInfo = 'tablet';
    } else {
      this.gameSession.deviceInfo = 'desktop';
    }
  });

  updateQuestionReviewAnalytics = action(
    (questionId: string, analytics: IQuestionReviewAnalytics) => {
      const updatedSession = { ...this.gameSession };
      if (!updatedSession.questions[questionId]) {
        const newQuestion = {
          id: questionId,
          tries: 1,
          played: true,
          reviewed: false,
          reviewAnalytics: analytics,
        };
        updatedSession.questions[questionId] = newQuestion;
      } else {
        updatedSession.questions[questionId]['reviewAnalytics'] = analytics;
      }
      this.setGameSession(updatedSession);
    }
  );

  markQuestionAsReviewed = action((questionId: string) => {
    const question = this.gameSession.questions[questionId];

    if (question && question.viewedSections) {
      const hintsArrayForCheck =
        this.root.translateViewStore.translatedGameData?.questions[questionId]
          ?.hints || [];
      const allHintsViewed =
        hintsArrayForCheck.length > 0 &&
        hintsArrayForCheck.every((_hintDef: any, index: number) => {
          const hintKey = `hint${index}`;
          return get(question.viewedSections!.hints, hintKey) === true;
        });

      if (
        question.viewedSections.explanation &&
        allHintsViewed &&
        question.viewedSections.source
      ) {
        question.reviewed = true;
        const allGameQuestions = Object.values(this.gameSession.questions);
        const allQuestionsReviewed = allGameQuestions.every(
          (q) => q.reviewed === true
        );

        if (allQuestionsReviewed && !this.gameSession.bonusGiven) {
          this.gameSession.coins = (this.gameSession.coins || 0) + 500;
          this.gameSession.bonusGiven = true;
          this.root.gamePlayViewStore.setAchievement(
            this.root.gamePlayViewStore.createReviewBonusAchievement(
              '+500 Review Bonus!'
            )
          );
        }
      }
    }
  });

  updateQuestionViewedSections = action(
    async (
      questionId: string,
      sectionType: 'explanation' | 'source' | 'hints',
      hintId?: string
    ) => {
      runInAction(() => {
        let question = this.gameSession.questions[questionId];

        if (!question) {
          this.gameSession.questions[questionId] = {
            id: questionId,
            tries: 0,
            played: false,
          };
          question = this.gameSession.questions[questionId];
        }

        if (!question.viewedSections) {
          question.viewedSections = {
            explanation: false,
            hints: {},
            source: false,
          };
        }
        if (
          typeof question.viewedSections.hints !== 'object' ||
          question.viewedSections.hints === null
        ) {
          question.viewedSections.hints = {};
        }

        if (sectionType === 'hints' && hintId) {
          set(question.viewedSections.hints, hintId, true);
        } else if (sectionType === 'explanation' || sectionType === 'source') {
          question.viewedSections[sectionType] = true;
        }

        const hintsArrayForCheck =
          this.root.translateViewStore.translatedGameData?.questions[questionId]
            ?.hints || [];
        const allHintsViewed =
          hintsArrayForCheck.length > 0 &&
          hintsArrayForCheck.every((_hintDef: any, index: number) => {
            const hintKey = `hint${index}`;
            return get(question.viewedSections!.hints, hintKey) === true;
          });

        if (
          question.viewedSections.explanation &&
          allHintsViewed &&
          question.viewedSections.source
        ) {
          if (!question.reviewed) {
            question.reviewed = true;
          }
        } else {
          question.reviewed = false;
        }
      });

      try {
        await this.root.endGameViewStore.updateGameSessionFunc();
      } catch (error) {
        return null;
      }
      return null;
    }
  );

  getQuestionViewedSections = (questionId: string): IViewedSections => {
    let question = this.gameSession.questions[questionId];

    if (!question) {
      runInAction(() => {
        this.gameSession.questions[questionId] = {
          id: questionId,
          tries: 0,
          played: false,
        };
        question = this.gameSession.questions[questionId];
        question.viewedSections = {
          explanation: false,
          hints: {},
          source: false,
        };
      });
    }

    if (!question.viewedSections) {
      runInAction(() => {
        question.viewedSections = {
          explanation: false,
          hints: {},
          source: false,
        };
      });
    } else if (
      typeof question.viewedSections.hints !== 'object' ||
      question.viewedSections.hints === null
    ) {
      runInAction(() => {
        question.viewedSections!.hints = {};
      });
    }

    const sectionsToReturn = question.viewedSections as IViewedSections;

    return sectionsToReturn;
  };

  setReturnedFromGame = action(() => {
    this.justReturnedFromGame = true;
  });

  // Frame callback registration system
  registerFrameCallback = (callback: (delta: number) => void) => {
    this.frameCallbacks.push(callback);
    return () => {
      this.frameCallbacks = this.frameCallbacks.filter((cb) => cb !== callback);
    };
  };

  executeFrameCallbacks = (delta: number) => {
    this.frameCallbacks.forEach((callback) => {
      try {
        callback(delta);
      } catch (error) {
        console.error('Error in frame callback:', error);
      }
    });
  };

  // Layer spawning logic
  handleLayerSpawning = () => {
    const {
      isGameActive,
      isSponsorLayerOnScreen,
      addGameLayer,
      addQuestionLayer,
      setCurrentRandomLayerArr,
      currentRandomLayerArr,
    } = this.root.gamePlayViewStore;
    const { isQuestionLayerActive, setFirstLayerAdded, firstLayerAdded } =
      this.root.questionViewStore;

    if (isGameActive && !isQuestionLayerActive && !isSponsorLayerOnScreen) {
      const currentTime = performance.now();
      const timeSinceLastSpawn = currentTime - this.lastSpawnTime;

      if (!firstLayerAdded) {
        const hasSponsor =
          this.root.obstacleViewStore.instancePool[EObstacleModelType.sponsor]
            .length > 0;
        if (hasSponsor) {
          addGameLayer(this.root.obstacleViewStore.sponsorLayers[0]);
          this.root.gamePlayViewStore.setIsSponsorLayerOnScreen(true);
          setFirstLayerAdded(true);
        } else {
          addGameLayer(
            this.root.obstacleViewStore.obstacleLayers[currentRandomLayerArr[0]]
          ); // Pass the first layer from obstacleLayers
          this.lastSpawnTime = currentTime;
          if (!firstLayerAdded) {
            setFirstLayerAdded(true);
          }

          setCurrentRandomLayerArr(currentRandomLayerArr.slice(1));
        }
      } else if (timeSinceLastSpawn >= this.root.mainSceneViewStore.spawnRate) {
        if (currentRandomLayerArr.length > 0) {
          if (
            currentRandomLayerArr.length === 2 ||
            currentRandomLayerArr.length === 5
          ) {
            addGameLayer(this.root.obstacleViewStore.hintLayers[0]);
          } else {
            addGameLayer(
              this.root.obstacleViewStore.obstacleLayers[
                currentRandomLayerArr[0]
              ]
            ); // Pass the first layer from obstacleLayers
            // Remove the first item from the array after using it
          }

          setCurrentRandomLayerArr(currentRandomLayerArr.slice(1));
        } else {
          addQuestionLayer();
        }
        this.lastSpawnTime = currentTime;
        if (!firstLayerAdded) {
          setFirstLayerAdded(true);
        }
      }
    }
    // else if(this.root.gamePlayViewStore.isTreadmillOn && this.root.gamePlayViewStore.isTU){

    // }
  };

  handleDescriptionClick = action(
    (
      event: React.MouseEvent<HTMLDivElement>,
      description: string | undefined
    ) => {
      if (!description) return;

      const target = event.currentTarget;
      const popover = document.createElement('div');
      popover.style.position = 'fixed';
      popover.style.left = `${target.getBoundingClientRect().left}px`;
      popover.style.top = `${target.getBoundingClientRect().bottom + 8}px`;
      popover.style.padding = '1rem';
      popover.style.background = 'rgba(0, 0, 0, 0.9)';
      popover.style.borderRadius = '0.5rem';
      popover.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.2)';
      popover.style.maxWidth = '80vw';
      popover.style.zIndex = '1000';
      popover.style.fontFamily = "'Orbitron', sans-serif";
      popover.style.color = '#fff';
      popover.innerText = description;

      const closePopover = () => {
        if (document.body.contains(popover)) {
          document.body.removeChild(popover);
        }
        document.removeEventListener('click', handleClickOutside);
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (!popover.contains(e.target as Node)) {
          closePopover();
        }
      };

      document.body.appendChild(popover);
      setTimeout(
        () => document.addEventListener('click', handleClickOutside),
        0
      );
    }
  );

  rotateCarousel = action((carouselRef: any, angleStep: number) => {
    if (carouselRef && this.herosData.length > 0) {
      // Mark rotation as in progress
      this.setIsRotating(true);

      // Calculate the direction of rotation (clockwise or counterclockwise)
      let targetRotation = -this.selectedIndex * angleStep;

      // Calculate the change needed in both directions
      const currentIndex = this.previousIndex;
      let clockwiseDiff = 0;
      let counterClockwiseDiff = 0;

      if (currentIndex !== this.selectedIndex) {
        // Calculate forward difference (clockwise)
        if (this.selectedIndex > currentIndex) {
          clockwiseDiff = this.selectedIndex - currentIndex;
        } else {
          clockwiseDiff =
            this.selectedIndex + this.herosData.length - currentIndex;
        }

        // Calculate backward difference (counterclockwise)
        if (currentIndex > this.selectedIndex) {
          counterClockwiseDiff = currentIndex - this.selectedIndex;
        } else {
          counterClockwiseDiff =
            currentIndex + this.herosData.length - this.selectedIndex;
        }

        // Choose the shorter rotation path
        const rotationDelta =
          clockwiseDiff <= counterClockwiseDiff
            ? angleStep * clockwiseDiff
            : -angleStep * counterClockwiseDiff;

        // Update the target rotation based on the current rotation
        targetRotation = this.currentRotation - rotationDelta;

        // Update the current rotation reference
        this.currentRotation = targetRotation;

        // Update previous index
        this.previousIndex = this.selectedIndex;
      }

      // Use a smoother, faster animation with proper timing
      gsap.to(carouselRef.rotation, {
        y: targetRotation,
        duration: 1.5, // Slightly faster but still smooth
        ease: 'power3.out', // Smoother easing function without the bounce
        onUpdate: () => {
          // We don't need to force render manually - Three.js and React Three Fiber
          // will handle the continuous rendering during GSAP animations
        },
        onComplete: () => {
          // Mark rotation as complete
          this.setIsRotating(false);

          // Normalize rotation if needed
          if (Math.abs(targetRotation) > Math.PI * 4) {
            this.currentRotation = targetRotation % (Math.PI * 2);
            carouselRef.rotation.y = this.currentRotation;
          }
        },
      });
    }
  });

  // Add computed properties for image sources
  @computed get logoSrc(): string {
    const src =
      this.logoData &&
      typeof this.logoData === 'object' &&
      's3Url' in this.logoData
        ? String(this.logoData.s3Url)
        : DDLogo;

    // Clean any surrounding quotes from S3 URLs
    const cleanSrc = src.replace(/^"|"$/g, '');

    return cleanSrc;
  }

  @computed get bannerSrc(): string {
    const src =
      this.bannerData &&
      typeof this.bannerData === 'object' &&
      's3Url' in this.bannerData
        ? String(this.bannerData.s3Url)
        : '';

    // Clean any surrounding quotes from S3 URLs
    const cleanSrc = src.replace(/^"|"$/g, '');

    return cleanSrc;
  }

  @computed get hasBanner(): boolean {
    return !!this.bannerData && !!this.bannerSrc;
  }

  @computed get hasLogo(): boolean {
    return !!this.logoData && !!this.logoSrc && this.logoSrc !== DDLogo;
  }

  @computed get imageDebugInfo() {
    return {
      logoData: this.logoData,
      bannerData: this.bannerData,
      logoSrc: this.logoSrc,
      bannerSrc: this.bannerSrc,
      hasBanner: this.hasBanner,
      hasLogo: this.hasLogo,
      isUsingFallbackLogo: this.logoSrc === DDLogo,
      logoDataType: typeof this.logoData,
      bannerDataType: typeof this.bannerData,
      logoS3Url:
        this.logoData &&
        typeof this.logoData === 'object' &&
        's3Url' in this.logoData
          ? this.logoData.s3Url
          : null,
      bannerS3Url:
        this.bannerData &&
        typeof this.bannerData === 'object' &&
        's3Url' in this.bannerData
          ? this.bannerData.s3Url
          : null,
    };
  }
}
