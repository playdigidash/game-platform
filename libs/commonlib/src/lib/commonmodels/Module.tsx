import { Moment } from 'moment';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ISliderState } from './SingleSliderModel';
import { blankEditorStr } from '@lidvizion/commonlib';
import { ObjectId } from 'bson';

export enum ModuleSubject {
  math = 'Math',
  science = 'Biology',
  computerScience = 'Computer Science',
  notselected = 'Not Selected',
}

export enum EObstacleModelType {
  oneLaneJumpable = 'oneLaneJumpable',
  oneLaneUnjumpable = 'oneLaneUnjumpable',
  twoLaneJumpable = 'twoLaneJumpable',
  twoLaneUnjumpable = 'twoLaneUnjumpable',
  threeLaneJumpable = 'threeLaneJumpable',
  unavoidable = 'unavoidable',
  sponsor = 'sponsor',
  question = 'question',
  hint = 'hint',
  coin = 'coin',
  tutorial = 'tutorial',
}

export enum DefaultOrCustom {
  default = 'default',
  custom = 'custom',
}

export enum GLBType {
  duck = 'Duck',
  jump = 'Jump',
  dodge = 'Dodge',
  avatar = 'Avatar',
}

// export interface IGlb {
//   id: string;
//   folderId: string;
//   res?: any;
//   animations?: any[];
//   ext: string;
//   type: AvatarType;
//   glbType: GLBType;
//   url?: string;
//   thumbnail?: string;
//   thumbnailUrl?: string;
//   name?: string;
//   glb?: GLTF;
//   loading?: boolean;
//   title?: string;
//   description?: string;
// }

export interface ISelectedGlb {
  id: string;
  folderId: string;
}

export interface IAnswerColors {
  a: string;
  b: string;
  c: string;
  d: string;
}

export enum ESponsorContentType {
  image = 'image',
  video = 'video',
}

export interface IDBSponsorEntry {
  imgId: string;
  ext: string;
}

export interface ISponsorEntry {
  id: string;
  type: ESponsorContentType;
  createdAt: string;
  imageUrl: string;
  ext: string;
}

export interface ICustomModule {
  _id?: ObjectId;
  moduleId: string;
  settings: {
    limit: number;
    random: boolean;
    gTitle: string;
    gDesc: string;
    url: string;
    music: boolean;
    isRandomNames?: boolean;
    font?: string;
    backgroundMusic?: string;
    language?: string;
    gameSpeed?: number;
    gameFont?: string;
    primaryColor?: string;
    secColor?: string;
    loginLvl?: number;
    gameLoginLvl?: number;
  };
  sponsors: IDBSponsorEntry[];
  // Properties accessed directly on ICustomModule in game platform
  primaryColor?: string;
  secColor?: string;
  gTitle?: string;
  gDesc?: string;
  limit?: number;
  gameLoginLvl?: number;
  music?: boolean;
  avatars?: string[];
  name?: string;
  subject?: string;
  qs?: IDbQuestion[];
  createdOn?: number;
  updatedOn?: number;
  selectedDodge?: string[];
  selectedJump?: string[];
  selectedSlide?: string[];
  scenes?: any[];
  isDeleted?: boolean;
  uid?: string;
  coin?: string;
  answerColors?: IAnswerColors;
  public?: boolean;
  verified?: boolean;
  imgId?: string;
  tags?: string[];
  primaryCat?: string;
  secondaryCats?: string[];
  orgId?: string;
  actionId?: string[];
}

export interface ICustomModuleFromDb extends ICustomModule {
  _id: ObjectId;
}

export interface IGlb {
  glb?: GLTF | null;
  glbType?: GLBType;
  type: string;
  fName?: string;
  url?: string;
  name: string;
  title?: string;
  description?: string;
  objId: string;
  objExt?: string;
  uid: string;
  uploadedAt: string;
  lstMod: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  s3Url?: String;
  recUse?: string;
  funFacts?: Array<{
    fact: string;
  }>;
  tags?: string[];
  category?: string;
  subCategory?: string;
  visibility?: string;
  fileType?: string;
  fileSize?: number;
  res?: any;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };

  performance?: {
    polygonCount?: number;
    vertexCount?: number;
    lodLevels?: number;
  };

  animations?: any[];

  physics?: {
    hasCollision?: boolean;
    collisionBounds?: { x: number; y: number; z: number } | null;
  };

  materials?: string[];
  textures?: string[];
  downloadCount?: number;
  rating?: {
    average?: number;
    count?: number;
  };
  comments?: {
    userId: string;
    comment: string;
    timestamp: string;
  }[];

  relatedObjects?: string[];
  parentObject?: string;
  isPublic?: boolean;
  sourceId?: string;
  isFeatured?: boolean;

  licenseType?: string;
  licenseDetails?: string;
  viewsCount?: number;
  favoritedBy?: string[];

  customAttributes?: {
    attributeName: string;
    attributeValue: string;
  }[];

  uploadedBy?: {
    name: string;
    profileUrl: string;
  };

  lastDownloaded?: string;
  compatiblePlatforms?: string[];
  versionHistory?: {
    version: string;
    modificationDate: string;
    changes: string;
  }[];

  additionalInfo?: {
    materialCount?: number;
    textureCount?: number;
    compressionType?: string;
    sourcePlatform?: string;
    license?: string;
    isMobileOptimized?: boolean;
    supportedEngines?: string[];
  };
}

export enum IGlbObjectKey {
  duck = 'slideOb',
  jump = 'jumpOb',
  avatar = 'avatars',
}

export const scaleToUniformSize = (glb: GLTF) => {
  const box = new THREE.Box3().setFromObject(glb.scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  const scale = 2.0 / maxDimension;
  glb.scene.scale.set(scale, scale, scale);
};

export interface IDragItem {
  id: string;
  fileType: string;
  index: number;
  ext: string;
  alt: string;
  fname: string;
  objExt: string;
}

export interface ITriviaAssetModel {
  fileType: 'png' | 'jpg' | 'jpeg' | '';
  aId: string;
  fileName: string;
}

export const ItemTypes = {
  THUMBNAIL: 'thumbnail',
};

export interface ISingleQuestionModel {
  question: string;
  answer: string;
  detailPreview: string | null;
  id: string;
  currentEditState: ISliderState;
  initExpandAll?: boolean;
  show?: () => void;
}

export interface IAnswer {
  txt: string;
  color: string;
}

export interface IHint {
  title: string;
  xformedH: string;
}

export const defaultHints = (): IHint[] => [
  {
    title: '',
    xformedH: blankEditorStr,
  },
];

export enum ICurrQType {
  single = 'Single Answer',
  trueFalse = 'True/False',
}

export interface IDbQuestion {
  id: string;
  uid: string;
  CurrQType: ICurrQType;
  xformedQ: string;
  hints: IHint[];
  answers: IAnswer[];
  correctAnswerIdx: number;
  xformedExp: string;
  xformedS: string;
  qAsset?: ITriviaAssetModel;
  version: number;
  parent_id: string | null;
  orgId?: string;
  createdAt: string;
  isDeleted?: boolean;
  isTutorial?: boolean;
}

export interface IDBPlayedQuestion extends IDbQuestion {
  tries: number;
}

export interface IPlayedQuestionMap {
  [id: string]: IDBPlayedQuestion;
}

export const getDefaultAnswers = (questionType: ICurrQType): IAnswer[] => {
  switch (questionType) {
    case ICurrQType.trueFalse:
      return [
        { txt: 'True', color: 'black' },
        { txt: 'False', color: 'black' },
      ];
    case ICurrQType.single:
      return [
        { txt: '', color: 'black' },
        { txt: '', color: 'black' },
        { txt: '', color: 'black' },
        { txt: '', color: 'black' },
      ];
    default:
      return [];
  }
};

export interface ITriviaPanel {
  questionIdx: number;
}

export interface IImage {
  title: string;
  desc: string;
  id: string;
  uid: string;
  uploadedAt: string;
  lstMod: string;
  ext: string;
  alt: string;
  fname: string;
  size: number;
  height: number;
  width: number;
  s3Url?: string;
}

export interface IHeroTemplate {
  id: string;
  title: string;
  tags: string[];
  description: string;
  heroArr: string[];
  jumpArr: string[];
  duckArr: string[];
  dodgeArr: string[];
  type: string;
  thumbnail: {
    id: string;
    ext: string;
    alt: string;
    fname: string;
  };
}

export interface IFile {
  id: string;
  txtId: string;
  uid: string;
  uploadedAt: string;
  fname: string;
  ext: string;
  size: number;
  tokens: number;
  isDeleted?: boolean;
}

export interface FunFact {
  id: string;
  title: string;
  text: string;
  seenCount: number;
  idx: number;
  modelData: {
    res?: any;
    title?: string;
    objId: string;
    obstacleType?: string;
  };
}
export interface ObstacleFunFacts {
  [obstacleType: string]: FunFact[];
}

export interface ITheme {
  name: string;
  description: string;
  default: boolean;
  road: {
    textures: {
      baseColor: string;
    };
    properties: {
      reflectivity: number;
    };
    tiles: {
      x: number;
      y: number;
    };
  };
  background: {
    textures: {
      baseColor: string;
    };
  };
  createdAt: string;
  themeId: string;
  uid: string;
}

export interface TriviaGenDetails {
  sourceType: string;
  fileIds?: string[];
  wikiPage?: string;
  wikiUrl?: string;
  userPrompt?: string;
  numQuestions: number;
  triviaId: string;
  questionIds: string[];
}

export interface ImageGenDetails {
  userPrompt: string;
  imageId: string;
}

export interface QuickCreateDetails {
  sourceType: string;
  fileIds?: string[];
  wikiPage?: string;
  wikiUrl?: string;
  gameTitle: string;
  gameDescription: string;
  numQuestions: number;
  imageSelect: boolean;
  triviaId: string;
  questionIds: string[];
  templateId: string;
}

export interface threeDGenDetails {
  userPrompt: string;
  objId: string;
}

export interface IAIGen {
  id: string;
  uid: string;
  uploadedAt: string;
  moduleId: string;
  useCase: 'trivia' | 'image' | 'quick' | 'threeD';
  creditsUsed: number;
  genDetails:
    | TriviaGenDetails
    | ImageGenDetails
    | QuickCreateDetails
    | threeDGenDetails;
}

export type ActionType =
  | 'code'
  | 'selfVerify'
  | 'hiddenCode'
  | 'qr'
  | 'video'
  | 'poll'
  | 'rating'
  | 'scratchOff'
  | string;
export type ActionStatus = 'draft' | 'active' | 'archived';

export interface IActions {
  actionId: string;
  name: string;
  description?: string;
  type: ActionType;
  points: number;
  bonusMultiplier?: number;
  showConfetti?: boolean;
  isRequired?: boolean;
  startDate?: Date;
  expiryDate?: Date;
  maxRedemptions?: number;
  currentRedemptions?: number;
  config: Record<string, any>;
  status: ActionStatus;
  ownerOrg: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt: Date;
  metrics?: {
    impressions: number;
    completions: number;
    lastUsedAt?: Date;
  };
}

export interface IModuleQuestAction {
  actionId: string;
  order: number;
  isRequired: boolean;
}

export interface IModuleQuest {
  actions: IModuleQuestAction[];
  currentIndex: number;
}

export interface ActionFormDialogProps {
  open: boolean;
  onClose: () => void;
  actionId?: string;
  moduleId?: string;
}

export interface CreateActionBtnProps {
  moduleId?: string;
}

export interface ActionFormValues {
  name: string;
  description?: string;
  type: ActionType;
  points: number;
  bonusMultiplier?: number;
  showConfetti?: boolean;
  isRequired?: boolean;
  startDate?: Date | null;
  expiryDate?: Date | null;
  maxRedemptions?: number | null;
  status: ActionStatus;
  config: Record<string, any>;
}

export interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  action: IActions;
  isRequired: boolean;
  onComplete: () => void;
  onSkip?: () => void;
}

export interface ActionComponentProps {
  action: IActions;
  onComplete: () => void;
  onSkip?: () => void;
}

export interface IModule {
  _id: string;
  title: string;
  quest?: IModuleQuest;
}

export interface ActionFilterOptions {
  search?: string;
  type?: ActionType;
  status?: ActionStatus;
}

export interface ActionTypeOption {
  value: ActionType;
  label: string;
  icon?: React.ReactNode;
}

export interface ActionLibraryFilterBarProps {
  filters: ActionFilterOptions;
  onFilterChange: (filters: ActionFilterOptions) => void;
  onCreateNewAction: () => void;
}

export interface PollOption {
  id: string;
  text: string;
  correct?: boolean;
}

export interface PollConfig {
  question: string;
  options: PollOption[];
  allowMultipleAnswers: boolean;
  showResultsAfterSubmission: boolean;
}

export interface CodeConfig {
  code: string;
  caseSensitive: boolean;
  rotatingCode?: boolean;
  cronPattern?: string;
  fallbackMessage?: string;
  hint?: string;
}

export interface QrConfig {
  qrContent: string;
  qrImageUrl?: string;
  fallbackCode?: string;
  description?: string;
}

export interface VideoConfig {
  videoUrl: string;
  requiredWatchTimePercent: number;
  skipAfter?: number;
  videoLength?: number;
  title?: string;
}

export interface SelfVerifyConfig {
  ctaText: string;
  targetUrl?: string;
  confirmationMessage?: string;
  evidenceRequired?: boolean;
  description?: string;
}

export interface HiddenCodeConfig {
  code: string;
  ctaText: string;
  targetUrl?: string;
  hint?: string;
  triggerMethod: 'timer' | 'location' | 'manual';
}

export interface RatingConfig {
  promptText: string;
  scale: 5 | 10;
}

export interface ScratchOffConfig {
  hiddenTextOrCode: string;
  brushSize?: number;
}
