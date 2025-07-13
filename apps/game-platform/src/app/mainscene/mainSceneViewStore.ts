import { action, makeAutoObservable } from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import { GameBox } from '../GameBox';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { checkIsLandscape } from '../Common';
import { getCustomerInfo, getDbImage, IImgType } from '@lidvizion/commonlib';

interface IBoxCollisionParams {
  box1: GameBox;
  box2: GameBox;
}

export enum DIffLvl {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}

interface ILoadingAnimationState {
  showDodge: boolean;
  showCollect: boolean;
  showTrivia: boolean;
  animationComplete: boolean;
  isModalVisible: boolean;
}

export class MainSceneViewStore {
  root: RootStore;
  currentLoadLogo: string | null = null;
  loadingProgress = 0;
  showPauseModal = false;
  timeStep = 1 / 60;
  groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
  });
  difficulty = 1;
  isGameLoading = true;
  cannonWorld = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
  projectiles: GameBox[] = [];
  isBulletsOn = false;
  enemies: GameBox[] = [];
  targets: GameBox[] = [];
  cloudParticles: THREE.Mesh[] = [];
  isAvaSelectMode = false;
  boxHeights = {
    nonPassable: 10,
    slideUnder: 7,
  };
  endGame = false;
  containerRef: HTMLCanvasElement | null = null;
  initCameraPosition = {
    x: 0.61,
    y: 0.74,
    z: 0,
  };
  sequence: any = [];
  currSequenceIndex = 0;
  rainCount = 15000;
  cameraPositions = {
    questionMode: {
      position: {
        x: 12.120404259346083,
        y: 4.037226557706088,
        z: -9.851947793695704,
      },
      rotation: {
        x: -1.544981430375784,
        y: 1.152483060589007,
        z: 1.5425467561664856,
      },
    },
  };
  texturePlaceholder = document.createElement('canvas');
  questionFramePosition = {
    x: 0.61,
    y: 0.74,
    z: 0,
  };
  frames = 0;
  gltfLoader = new GLTFLoader();
  fontLoader = new FontLoader();
  //lower number = faster spawn
  spawnRate = 1200;
  fonts: {
    [fontName: string]: Font;
  } = {};

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  touchStartX = 0;
  touchEndX = 0;
  showLandscapeModal = false;
  isLandscape = checkIsLandscape();
  gameInitiated = false;
  canvasRef: HTMLCanvasElement | null = null;
  controls = new OrbitControls(this.camera, this.renderer.domElement);
  selectedAvaIdx = 0;
  flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
  pauseMenuViewStore: any;
  loadingAnimationState: ILoadingAnimationState = {
    showDodge: false,
    showCollect: false,
    showTrivia: false,
    animationComplete: false,
    isModalVisible: true,
  };
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  setCanvasRef = action((ref: HTMLCanvasElement) => {
    this.canvasRef = ref;
  });

  setGameInitiated = action((bool: boolean) => {
    this.gameInitiated = bool;
  });

  setIsLandscape = action((bool: boolean) => {
    this.isLandscape = bool;
  });

  setCurrentLoadLogo = action((str: string) => {
    this.currentLoadLogo = str;
  });

  getCurrentLoadLogo = action(
    async (
      db: Realm.Services.MongoDBDatabase,
      orgId: string,
      appId: string
    ) => {
      const customerInfo = await getCustomerInfo(db, orgId);
      if (customerInfo?.logos?.loadLogo) {
        const logo = await getDbImage(
          customerInfo.logos.loadLogo,
          IImgType.icon
        );
        if (logo?.b64) {
          this.setCurrentLoadLogo(logo.b64);
        }
      }
    }
  );

  setLoadingProgress = action((progress: number) => {
    this.loadingProgress = progress;
  });

  setIsGameLoading = action((bool: boolean) => {
    this.isGameLoading = bool;
  });

  setShowLandscapeModal = action((bool: boolean) => {
    this.showLandscapeModal = bool;
  });

  setSelectedAvaIdx = action((idx: number) => {
    this.selectedAvaIdx = idx;
  });

  setIsAvaSelectMode = action((bool: boolean) => {
    this.isAvaSelectMode = bool;
  });

  setEndGame = action((bool: boolean) => {
    this.endGame = bool;
  });

  resetGame = action(() => {
    this.root.endGameViewStore.setIsEndGameModalOpen(false);
    this.root.questionViewStore.resetQuestions();
    if (this.root.gameViewStore.prizeCode) {
      this.root.gameViewStore.prizeCode.isRedeemed = false;
    }

    this.endGame = false;
    this.scene.clear();
    this.frames = 0;
    this.currSequenceIndex = 0;

    this.root.scoreViewStore.reset();
    this.root.collectableViewStore.resetCollectables();
  });

  setLoadingAnimationState = action(
    (state: Partial<ILoadingAnimationState>) => {
      this.loadingAnimationState = { ...this.loadingAnimationState, ...state };
    }
  );

  startLoadingAnimation = action(async () => {
    try {
      // Show dodge animation after a delay
      await new Promise((resolve) =>
        setTimeout(() => {
          this.setLoadingAnimationState({ showDodge: true });
          resolve(true);
        }, 500)
      );

      // Show collect animation
      await new Promise((resolve) =>
        setTimeout(() => {
          this.setLoadingAnimationState({ showCollect: true });
          resolve(true);
        }, 500)
      );

      // Show trivia animation
      await new Promise((resolve) =>
        setTimeout(() => {
          this.setLoadingAnimationState({ showTrivia: true });
          resolve(true);
        }, 500)
      );

      // Complete animation sequence
      await new Promise((resolve) =>
        setTimeout(() => {
          this.setLoadingAnimationState({ animationComplete: true });
          resolve(true);
        }, 1000)
      );

      // Keep modal visible for a moment after completion
      await new Promise((resolve) =>
        setTimeout(() => {
          this.setLoadingAnimationState({ isModalVisible: false });
          // Only set isGameLoading to false after modal is hidden
          this.setIsGameLoading(false);
          this.root.gameViewStore.setShowMenuScreen(true);
          resolve(true);
        }, 500)
      );
    } catch (error) {
      console.error('Loading animation error:', error);
      // Ensure we clean up if there's an error
      this.resetLoadingAnimation();
      this.setIsGameLoading(false);
      this.root.gameViewStore.setShowMenuScreen(true);
    }
  });

  resetLoadingAnimation = action(() => {
    this.loadingAnimationState = {
      showDodge: false,
      showCollect: false,
      showTrivia: false,
      animationComplete: false,
      isModalVisible: false,
    };
  });
}
