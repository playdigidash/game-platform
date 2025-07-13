import { CleanupViewStore } from '../cleanup/CleanupViewStore';
import { CollectableViewStore } from '../collectables/CollectableViewStore';
import { FenceViewStore } from '../fence/fenceViewStore';
import { MainSceneViewStore } from '../mainscene/mainSceneViewStore';
import { ModuleViewStore } from '../modules/ModuleViewStore';
import { MovementViewStore } from '../movement/movementViewStore';
import { ObstaclesViewStore } from '../obstacles/obstaclesViewStore';
import { PauseMenuViewStore } from '../pause/PauseMenuViewStore';
import { QuestionViewStore } from '../question/QuestionViewStore';
import { ScoreViewStore } from '../endgame/score/scoreViewStore';
import { StageViewStore } from '../stage/stageViewStore';
import { LeaderboardViewStore } from '../endgame/leaderboard/LeaderboardViewStore';
import { FeedbackModalViewStore } from '../feedback/FeedbackModalViewStore';
import { EndGameViewStore } from '../endgame/EndGameViewStore';
import { GameViewStore } from '../mainscene/GameViewStore';
import { GamePlayViewStore } from './GamePlayViewStore';
import { SettingsViewStore } from '../settings/SettingsViewStore';
import { GameLoginViewStore } from '../login/GameLoginViewStore';
import { IRealmContext } from '@lidvizion/commonlib';
import { TutorialViewStore } from '../tutorial/tutorialViewStore';
import { CarouselViewStore } from '../carousel/CarouselViewStore';
import { GameLibraryViewStore } from '../gamelibrary/GameLibraryViewStore';
import { PagesViewStore } from '../pages/PagesViewStore';
import { SubscriptionViewStore } from '../settings/components/Subscription/SubscriptionViewStore';
import { AnimationViewStore } from '../animations/AnimationViewStore';
import { TranslateViewStore } from '../google-translate/TranslateViewStore';
import { CameraViewStore } from '../Camera/CameraViewStore';
import { GameModeStore } from '../RootStore/GameModeStore';
import { PresenterViewStore } from '../presenter/PresenterViewStore';
import { ActionViewStore } from '../endgame/stores/ActionViewStore';
import { QuestViewStore } from '../quest/QuestViewStore';

export class RootStore {
  db: Realm.Services.MongoDBDatabase;
  realmContext: IRealmContext;
  questViewStore: QuestViewStore;
  mainSceneViewStore: MainSceneViewStore;
  fenceViewStore: FenceViewStore;
  obstacleViewStore: ObstaclesViewStore;
  movementViewStore: MovementViewStore;
  stageViewStore: StageViewStore;
  collectableViewStore: CollectableViewStore;
  cleanupViewStore: CleanupViewStore;
  questionViewStore: QuestionViewStore;
  scoreViewStore: ScoreViewStore;
  pauseMenuViewStore: PauseMenuViewStore;
  moduleViewStore: ModuleViewStore;
  leaderboardViewStore: LeaderboardViewStore;
  feedbackModalViewStore: FeedbackModalViewStore;
  endGameViewStore: EndGameViewStore;
  gameViewStore: GameViewStore;
  gamePlayViewStore: GamePlayViewStore;
  settingsViewStore: SettingsViewStore;
  gameLoginViewStore: GameLoginViewStore;
  tutorialViewStore: TutorialViewStore;
  carouselViewStore: CarouselViewStore;
  gameLibraryViewStore: GameLibraryViewStore;
  pagesViewStore: PagesViewStore;
  subscriptionViewStore: SubscriptionViewStore;
  animationViewStore: AnimationViewStore;
  translateViewStore: TranslateViewStore;
  cameraViewStore: CameraViewStore;
  gameModeStore: GameModeStore;
  presenterViewStore: PresenterViewStore;
  actionViewStore: ActionViewStore;

  constructor({
    realmContext,
    db,
  }: {
    realmContext: IRealmContext;
    db: Realm.Services.MongoDBDatabase;
  }) {
    this.db = db;
    this.realmContext = realmContext;
    this.questViewStore = new QuestViewStore(this);
    this.mainSceneViewStore = new MainSceneViewStore(this);
    this.fenceViewStore = new FenceViewStore(this);
    this.cameraViewStore = new CameraViewStore(this);
    this.gameViewStore = new GameViewStore(this);
    this.settingsViewStore = new SettingsViewStore(this);
    this.obstacleViewStore = new ObstaclesViewStore(this);
    this.movementViewStore = new MovementViewStore(this);
    this.stageViewStore = new StageViewStore(this);
    this.collectableViewStore = new CollectableViewStore(this);
    this.cleanupViewStore = new CleanupViewStore(this);
    this.questionViewStore = new QuestionViewStore(this);
    this.pauseMenuViewStore = new PauseMenuViewStore(this);
    this.moduleViewStore = new ModuleViewStore(this);
    this.leaderboardViewStore = new LeaderboardViewStore(this);
    this.feedbackModalViewStore = new FeedbackModalViewStore(this);
    this.endGameViewStore = new EndGameViewStore(this);
    this.gamePlayViewStore = new GamePlayViewStore(this);
    this.scoreViewStore = new ScoreViewStore(this);
    this.gameLoginViewStore = new GameLoginViewStore(this, realmContext);
    this.tutorialViewStore = new TutorialViewStore(this);
    this.carouselViewStore = new CarouselViewStore(this);
    this.gameLibraryViewStore = new GameLibraryViewStore(this);
    this.pagesViewStore = new PagesViewStore(this);
    this.subscriptionViewStore = new SubscriptionViewStore(this);
    this.animationViewStore = new AnimationViewStore(this);
    this.translateViewStore = new TranslateViewStore(this);
    this.gameModeStore = new GameModeStore(this);
    this.presenterViewStore = new PresenterViewStore(this);
    this.actionViewStore = new ActionViewStore(this);
  }
}
