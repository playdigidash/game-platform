import { action, makeAutoObservable, reaction } from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  getImgbyId,
  getModuleById,
  getThemeData,
  getTxtFromEditor,
  ICustomModule,
  IGlb,
} from '@lidvizion/commonlib';
import { defaultThemeData } from '../Constants';
import {
  IGameData,
  IQuestionData,
} from '../google-translate/TranslateViewStore';
import { TUTORIAL_QUESTION_DATA } from '../tutorial/tutorialConstants';
import { GameMode } from '../RootStore/GameModeStore';

export enum ModObjType {
  avatar = 'avatar',
}

export enum ModuleSettings {
  limit,
  random,
  gTitle,
  gDesc,
  url,
  loginLvl,
  primaryColor,
  font,
}

export enum DefaultOrCustom {
  default = 'default',
  custom = 'custom',
}

export enum GLBType {
  avatar = 'avatar',
  obstacle = 'obstacle',
  dodge = 'dodge',
  jump = 'jump',
  slide = 'slide',
}

export class ModuleViewStore {
  root: RootStore;
  loader = new GLTFLoader();
  avatarArr: any[] = [];
  dodgeArr: any[] = [];
  jumpArr: any[] = [];
  glbs: IGlb[] = [];
  selectedModuleUrlName: string | null = null;
  currentModule: ICustomModule | null = null;
  duckArr: any[] = [];

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);

    reaction(
      () => this.selectedModuleUrlName,
      async (selectedModuleUrlName) => {
        if (selectedModuleUrlName) {
          await this.fetchData(selectedModuleUrlName);
          this.root.gameLoginViewStore.loadUser();
        }
      }
    );
  }

  setSelectedModuleUrlName = action((name: string) => {
    this.selectedModuleUrlName = name;
  });

  setCurrentModule = action((mod: ICustomModule) => {
    this.currentModule = mod;
  });

  addAvatar = action((ava: GLTF) => {
    this.avatarArr.push(ava);
  });

  addDuckObj = action((ava: GLTF) => {
    this.duckArr.push(ava);
  });

  addDodgeObj = action((ava: GLTF) => {
    this.dodgeArr.push(ava);
  });

  addJumpObj = action((ava: GLTF) => {
    this.jumpArr.push(ava);
  });

  addGlb = action((glb: IGlb) => {
    this.glbs.push(glb);
  });

  fetchData = action(async (module: string) => {
    if (module) {
      const data = await getModuleById(this.root.db, module);
      if (data) {
        this.root.moduleViewStore.setCurrentModule(data);
        this.root.questionViewStore.setModuleQuestionCnt(data.qs?.length || 0);
        this.root.gameViewStore.gameSession.gameId = data.moduleId;
        this.root.gameViewStore.gameSession.gameUrl = data.settings.url;
        this.root.gameViewStore.gameSession.gameCreatoruid = data.uid;

        // Set game mode based on module type
        if (data.type === 'presenter') {
          this.root.gameModeStore.setGameMode(GameMode.PRESENTER);

          // Initialize presenter data if needed
          if (data.presenterConfig) {
            // Can initialize presenter specific data here
          }
        } else {
          // Default to runner mode
          this.root.gameModeStore.setGameMode(GameMode.RUNNER);
        }

        // Collect game data for translation
        const originalGameData: IGameData = {
          title: data.settings.gTitle,
          desc: data.settings.gDesc,
          heroes: [],
          obstacles: {},
          questions: data.qs.reduce(
            (acc: Record<string, IQuestionData>, q: any) => {
              acc[q.id] = {
                question: getTxtFromEditor(q.xformedQ),
                answers: q.answers.map((a: any) => a.txt),
                hints: q.hints,
                xformedExp: q.xformedExp,
              };
              return acc;
            },
            {}
          ),
        };

        originalGameData.questions[TUTORIAL_QUESTION_DATA.id] = {
          question:
            'Sample question: What is the primary color of the sky on a clear day?',
          answers: ['Blue', 'Green', 'Red', 'Yellow'],
          xformedExp: '',
          hints: TUTORIAL_QUESTION_DATA.hints,
        };
        this.root.translateViewStore.setOriginalGameData(originalGameData);

        // Check if imgId exists before calling getImgbyId
        if (data.imgId) {
          const logo = await getImgbyId(this.root.db, data.imgId);
          if (logo) {
            this.root.gameViewStore.setLogoData(logo);
          }
        }

        // Check if sponsoredImgId exists before calling getImgbyId
        if (data.sponsoredImgId) {
          const banner = await getImgbyId(this.root.db, data.sponsoredImgId);
          if (banner) {
            this.root.gameViewStore.setBannerData(banner);
          }
        }

        this.root.gameViewStore.setSettings({
          ...data.settings,
          gameLoginLvl: data.settings.loginLvl,
        });
        // Initialize answer colors from module data
        if (data.answerColors) {
          this.root.gamePlayViewStore.setAnswerColors(data.answerColors);
        }

        this.root.gameViewStore.setQuestionsData(data.qs);
        this.root.gameViewStore.setApiQuestions(data.qs);
        if (data.prizeCode) {
          this.root.gameViewStore.setPrizeCode(data.prizeCode);
        }
        if (data.themeId) {
          const tempThemeData = await getThemeData(this.root.db, data.themeId);
          if (tempThemeData.default !== true) {
            // Check if background texture exists before calling getImgbyId
            if (tempThemeData.background?.textures?.baseColor) {
              const bgImg = await getImgbyId(
                this.root.db,
                tempThemeData.background.textures.baseColor
              );
              if (bgImg) {
                tempThemeData.background.textures.baseColor = bgImg.s3Url;
              }
            }
            // Check if road texture exists before calling getImgbyId
            if (tempThemeData.road?.textures?.baseColor) {
              const groundImg = await getImgbyId(
                this.root.db,
                tempThemeData.road.textures.baseColor
              );
              if (groundImg) {
                tempThemeData.road.textures.baseColor = groundImg.s3Url;
              }
            }
          }
          this.root.gameViewStore.setTheme({ ...tempThemeData });
        } else {
          this.root.gameViewStore.setTheme({ ...defaultThemeData });
        }

        // Fetch avatars using the new method in obstacleViewStore
        this.root.obstacleViewStore.fetchAvatars(data.avatars);
        
        this.root.obstacleViewStore.fetchObstacles(data);
      }
    }
  });
}
