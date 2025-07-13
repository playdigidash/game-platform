import { Modules } from 'i18next';
import { Instance, types } from 'mobx-state-tree';
import { ProviderType } from 'realm-web';
import {
  teamPlayer1Award,
  teamPlayer2,
  teamPlayer3,
  theScanner100,
  theScanner25,
  theScanner500,
  weekendScanner100,
  weekendScanner25,
  weekendScanner500,
  weekendWarrior144,
  weekendWarrior24,
  weekendWarrior72,
} from './AwardEvents';
import { ResponseType } from './Constants';
import { ICurrentMaterial } from './MaterialModel';
import { ICustomModule } from './Module';
import { ObjectId } from 'bson';

export const AwardLevel = [
  0, 500, 1000, 5000, 7500, 10000, 12500, 15000, 18500, 25000, 30000, 35000,
  45000, 50000, 65000, 75000, 80000, 90000, 100000, 115000,
];

export interface ScannedResTypeModel {
  recycle: {
    count: number;
  };
  trash: {
    count: number;
  };
  dropoff: {
    count: number;
  };
}

export interface ScannedMatSingleModel {
  responseType: ScannedResTypeModel | null;
}

export enum ScannerMaterialOptions {
  cardboard = 'cardboard',
  metal = 'metal',
  paper = 'paper',
  plastic = 'plastic',
  biohazardMedWaste = 'biohazardMedWaste',
  electronic = 'electronic',
}

export interface ScannedMaterialsModel {
  [key: string]: ScannedMatSingleModel;
}
//   .actions((self) => ({
//     setResponseCount: (itm: any, type: ResponseType, obj: ICurrentMaterial) => {
//       const scannedItm = itm.get(obj.item);
//       if (
//         scannedItm &&
//         scannedItm.responseType &&
//         scannedItm.responseType[type]
//       ) {
//         const resType = scannedItm.responseType[type];
//         resType.setCount(resType.count + 1);
//       } else {
//         const responseType = ScannedResTypeModel.create({});
//         responseType[type].setCount(1);

//         itm.set(obj.item, {
//           responseType,
//         });
//       }
//     },
//   }))
//   .actions((self) => ({
//     addCardBoardCnt: (obj: ICurrentMaterial, type: ResponseType) => {
//       self.setResponseCount(self.cardboard, type, obj);
//     },
//     addPlasticCnt: (obj: ICurrentMaterial, type: ResponseType) => {
//       self.setResponseCount(self.plastic, type, obj);
//     },
//   }))
//   .actions((self) => ({
//     addScanCnt: (obj: ICurrentMaterial, type: ResponseType) => {
//       switch (obj.type.toLowerCase()) {
//         case 'cardboard':
//           self.addCardBoardCnt(obj, type);
//           break;
//         case 'metal':
//           break;
//         case 'paper':
//           break;
//         case 'electronic':
//           break;
//         case 'plastic':
//           self.addPlasticCnt(obj, type);
//           break;
//         default:
//           break;
//       }
//     },

//     addMaterial: (mat: ScannerMaterialOptions) => {
//       if (mat === ScannerMaterialOptions.cardboard) {
//         return;
//       }
//       //  else if(mat === ScannerMaterialOptions.biohazardMedWaste){
//       //     newMats.setBiohazardMedWaste(cnt)
//       // } else if(mat === ScannerMaterialOptions.electronic){
//       //     newMats.setElectronic(cnt)
//       // } else if(mat === ScannerMaterialOptions.metal){
//       //     newMats.setMetalItem(cnt)
//       // } else if(mat === ScannerMaterialOptions.paper){
//       //     newMats.setPaper(cnt)
//       // } else if(mat === ScannerMaterialOptions.plastic){
//       //     newMats.setPlastic(cnt)
//       // }
//     },
//     responseTypeRollup: (responseType: any) => {
//       let recycleCnt = 0;
//       let trashCnt = 0;
//       let dropoffCnt = 0;

//       for (const res in responseType) {
//         if (responseType[res].responseType) {
//           const recycle = responseType[res].responseType.recycle;
//           const trash = responseType[res].responseType.trash;
//           const dropoff = responseType[res].responseType.dropoff;

//           if (recycle && recycle.count && recycle.count['$numberInt']) {
//             recycleCnt += parseInt(recycle.count['$numberInt']);
//           }

//           if (trash && trash.count && trash.count['$numberInt']) {
//             trashCnt += parseInt(trash.count['$numberInt']);
//           }

//           if (dropoff && dropoff.count && dropoff.count['$numberInt']) {
//             dropoffCnt += parseInt(dropoff.count['$numberInt']);
//           }
//         }
//       }

//       return ScannedResTypeModel.create({
//         recycle: {
//           count: recycleCnt,
//         },
//         trash: {
//           count: trashCnt,
//         },
//         dropoff: {
//           count: dropoffCnt,
//         },
//       });
//     },
//   }))
// }

export interface BadgeModel {
  title: string;
  date: string;
}

export interface StatsModel {
  count?: number;
  level?: number;
  badges?: BadgeModel;
  totalPoints?: number;
  scannedMaterials?: ScannedMaterialsModel | null;
  feedbackCount?: number;
  weekendScanCnt?: number;
  scanCnt?: number;
  weekendMinCnt?: number;
}
// .actions((self) => ({
//   checkWeekendScanBadge: () => {
//     if (self.weekendScanCnt >= 25) {
//       weekendScanner25.setHasUserEarned(true);
//     }

//     if (self.weekendScanCnt >= 100) {
//       weekendScanner100.setHasUserEarned(true);
//     }

//     if (self.weekendScanCnt >= 500) {
//       weekendScanner500.setHasUserEarned(true);
//     }

//     return;
//   },
//   checkOverallScanBadge: () => {
//     if (self.scanCnt >= 25) {
//       theScanner25.setHasUserEarned(true);
//     }

//     if (self.scanCnt >= 100) {
//       theScanner100.setHasUserEarned(true);
//     }

//     if (self.scanCnt >= 500) {
//       theScanner500.setHasUserEarned(true);
//     }

//     return;
//   },
//   checkFeedbackBadge: () => {
//     if (self.feedbackCount >= 5) {
//       teamPlayer1Award.setHasUserEarned(true);
//     }

//     if (self.feedbackCount >= 10) {
//       teamPlayer2.setHasUserEarned(true);
//     }

//     if (self.feedbackCount >= 25) {
//       teamPlayer3.setHasUserEarned(true);
//     }
//   },
//   checkWeekendMinBadge: () => {
//     if (self.weekendMinCnt >= 60 * 1000 * 60 * 24) {
//       weekendWarrior24.setHasUserEarned(true);
//     }

//     if (self.weekendMinCnt >= 60 * 1000 * 60 * 72) {
//       weekendWarrior72.setHasUserEarned(true);
//     }

//     if (self.weekendMinCnt >= 60 * 1000 * 60 * 144) {
//       weekendWarrior144.setHasUserEarned(true);
//     }
//   },
// }))
// .actions((self) => ({
//   addWeekendScanCnt: () => {
//     self.weekendScanCnt += 1;
//     self.checkWeekendScanBadge();
//   },
//   addScanCnt: () => {
//     self.scanCnt += 1;
//     self.checkOverallScanBadge();
//   },
//   addWekeendMinCnt: () => {
//     self.weekendMinCnt += 60 * 1000 * 5;
//     self.checkWeekendMinBadge();
//   },
//   addFeedbackCnt: () => {
//     self.feedbackCount += 1;
//     self.checkFeedbackBadge();
//   },
//   setWeekendMinCnt: (num: number) => {
//     self.weekendMinCnt = num;
//     self.checkWeekendMinBadge();
//   },
//   setFeedbackCount: (cnt: number) => {
//     self.feedbackCount = cnt;
//     self.checkFeedbackBadge();
//   },
//   setWeekendScanCnt: (cnt: number) => {
//     self.weekendScanCnt = cnt;
//     self.checkWeekendScanBadge();
//   },
//   setScanCnt: (cnt: number) => {
//     self.scanCnt = cnt;
//     self.checkOverallScanBadge();
//   },
//   setScannedMaterials: (scannedMaterials: IScannedMaterialsModel) => {
//     const newMats = ScannedMaterialsModel.create({});

//     for (const mat in scannedMaterials) {
//       //@ts-ignore
//       const matObject = scannedMaterials[mat];
//       for (const matItem in matObject) {
//         const cnt = parseInt(matObject[matItem]['$numberInt']);
//         if (mat === ScannerMaterialOptions.cardboard) {
//           newMats.setCardboardItem(cnt, matObject);
//         } else if (mat === ScannerMaterialOptions.biohazardMedWaste) {
//           newMats.setBiohazardMedWaste(cnt);
//         } else if (mat === ScannerMaterialOptions.electronic) {
//           newMats.setElectronic(cnt);
//         } else if (mat === ScannerMaterialOptions.metal) {
//           newMats.setMetalItem(cnt);
//         } else if (mat === ScannerMaterialOptions.paper) {
//           newMats.setPaper(cnt);
//         } else if (mat === ScannerMaterialOptions.plastic) {
//           newMats.setPlastic(cnt);
//         }
//         //   scannedMaterials.determineType(mat, matType, parseInt(matObject[matType]['$numberInt']))
//       }
//     }

//     self.scannedMaterials = newMats;
//   },

//   get currentProgress() {
//     let points = 0;
//     const currentLevel = AwardLevel.findIndex((lvl: number) => {
//       return self.totalPoints < lvl;
//     });

//     if (currentLevel > -1) {
//       points = self.totalPoints / AwardLevel[currentLevel];
//       self.setLevel(currentLevel + 1);
//     } else {
//       points = 100;
//       self.setLevel(AwardLevel.length);
//     }
//     return points;
//   }
// }

export interface Settings {
  showAccessibility: boolean;
  shouldOptInNotifications: boolean;
}

export enum IUserType {
  normal = 'normal',
  dashboardAdmin = 'dashboardAdmin',
  fullAdmin = 'fullAdmin',
  creator = 'creator',
  owner = 'owner',
  gameUser = 'gameUser',
}

export enum IUserProfileType {
  dashboard = 'dashboard',
  game = 'game',
}

export interface ICustomerOrg {
  orgId: string;
  userType: IUserType;
  moduleIds: string[];
}

export interface IDBOrgModel {
  name: string;
  id: string;
  moduleIds: string[];
}

export interface IUserIdentity {
  id: string;
  providerType: ProviderType;
}

export const LoginLvl = {
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

export interface IGameUserModel {
  _id?: ObjectId;
  uid: string;
  email: string;
  phone?: string;
  displayName?: string;
  metadata: {
    createdAt: number | null;
    updatedAt: number | null;
    lastLogin: number | null;
  };
  username: string;
  providerType: ProviderType;
  identities?: IUserIdentity[];
  playedQuestions?: { [key: string]: [] };
}

export interface IGameUserModelFromDb extends IGameUserModel {
  _id: ObjectId;
}

export interface IDashboardUserModel {
  _id?: ObjectId;
  uid: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  providerType: ProviderType;
  modules: string[];
  metadata: {
    createdAt: number | null;
    updatedAt: number | null;
    lastLogin: number | null;
  };
  identities?: IUserIdentity[];
  username: string;
  plan?: {
    planId?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    subId?: string;
    subStatus?: string;
    subStart?: Date | null;
    subEnd?: Date | null;
    currentSubMonth?: Date;
  };
}

export interface IUserOrgRelation {
  orgId: string;
  roles: IUserType[];
  uid: string;
  relId: string;
}

export enum UserClassification {
  Prospective = 'Prospective/Applicant',
  Freshman = 'Freshman (1st Year)',
  Sophomore = 'Sophomore (2nd Year)',
  Junior = 'Junior (3rd Year)',
  Senior = 'Senior (4th Year)',
  FifthYear = 'Fifth-Year Undergraduate / Extended Undergrad',
  NonDegree = 'Non-Degree / Visiting Undergrad',
  GraduateMasters = "Graduate Student (Master's)",
  GraduatePhD = 'Graduate Student (Doctoral/Ph.D.)',
  PostGradCert = 'Post-Graduate Certificate / Specialist',
  PostDoc = 'Postdoctoral Fellow / Research Scholar',
  ProfLaw = 'Professional Student - Law (J.D.)',
  ProfMedicine = 'Professional Student - Medicine (M.D.)',
  ProfDental = 'Professional Student - Dental (D.D.S. / D.M.D.)',
  ProfPharmacy = 'Professional Student - Pharmacy (Pharm.D.)',
  ProfVet = 'Professional Student - Veterinary (D.V.M.)',
  ProfPT = 'Professional Student - Physical Therapy (D.P.T.)',
  ProfOT = 'Professional Student - Occupational Therapy (O.T.D.)',
  ProfOther = 'Professional Student - Other',
  ContinuingEd = 'Continuing Education / Extension Student',
  Alumni = 'Alumni',
  FacultyStaff = 'Faculty / Staff',
  Other = 'Other / Not Applicable',
}

// Adding Gender enum from ProfileTypes.ts
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NonBinary = 'Non-binary',
  TransMale = 'Transgender Male',
  TransFemale = 'Transgender Female',
  Agender = 'Agender',
  Bigender = 'Bigender',
  Genderfluid = 'Genderfluid',
  Genderqueer = 'Genderqueer',
  TwoSpirit = 'Two-Spirit',
  DemiBoy = 'Demi-boy',
  DemiGirl = 'Demi-girl',
  Androgynous = 'Androgynous',
  Neutrois = 'Neutrois',
  Polygender = 'Polygender',
  ThirdGender = 'Third Gender',
  Questioning = 'Questioning',
  PreferNotToSay = 'Prefer not to say',
  SelfDescribe = 'Prefer to self-describe',
}

export interface IUniversity {
  id: string;
  univ: string;
  univUrl: string;
  univNum: number;
}

///IUnivOrg is applicable to any organization
export interface IUnivOrg {
  id: string;
  univNum?: number;
  Organization: string;
  Email?: string;
  Website?: string;
  Address?: string;
  City?: string;
  State?: string;
  Zip?: string;
  Country?: string;
  pendingVerification?: boolean;
  verified?: boolean;
  createdAt?: Date;
}

// User affiliation interface from ProfileTypes.ts
export enum AffiliationType {
  University = 'university',
  Organization = 'organization',
  Personal = 'personal',
}

export interface IUserAffiliation {
  // Common fields for all affiliation types
  isActive: boolean;
  orgBio?: string;
  problemToSolve?: string;
  affiliationType?: AffiliationType;
  referralSource?: string;  // How the user heard about us

  // University affiliation fields
  univId?: number;
  univName?: string;
  orgId?: string;
  orgName?: string;
  graduationDate?: Date;
  major?: string;
  minor?: string;
  classification?: UserClassification;

  // Organization affiliation fields
  companyName?: string;
  role?: string;
  companyLinkedInUrl?: string;
  personalLinkedInUrl?: string;
  industry?: string;
  industrySubcategory?: string;

  // Personal account fields
  primaryInterest?: string;
  companyUrl?: string;
}

export interface ICurrentUserModel {
  displayName?: string;
  stats?: StatsModel | null;
  seenInstruction?: boolean;
  isLoggedIn?: boolean;
  lastName?: string | null;
  firstName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  settings?: Settings | null;
  icon?: string | null;
  isAdmin?: boolean;
  uid?: string | null;
  providerType?: ProviderType;
  username?: string | null;
  userType?: IUserType;
  orgs?: string[];
  modules?: string[];
  metadata?: {
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    active?: boolean;
  };
  plan?: {
    planId?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    subId?: string;
    subStatus?: string;
    subStart?: Date | null;
    subEnd?: Date | null;
    currentSubMonth?: Date;
  };
  affiliations?: IUserAffiliation[];
  orgProfilePic?: string;
  dateOfBirth?: Date;
  gender?: Gender;
}

export interface IUserUsage {
  uid: string;
  totalStorage: number;
  questionCount: number;
  gameCount: number;
  totalPlays: number;
  playsByModule: Record<string, number>;
  imgGenCount: number;
  triviaGenCount: number;
  threeDGenCount: number;
  aiCreditsUsed: number;
  thresholdsPassed: {
    80: boolean;
    90: boolean;
    100: boolean;
  };
}

export interface IUsagePercentages {
  totalStorage: number;
  questionCount: number;
  gameCount: number;
  totalPlays: number;
  imgGenCount: number;
  triviaGenCount: number;
  threeDGenCount: number;
  aiCreditsUsed: number;
}

export enum OnboardingStepStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Completed = 'completed',
}

export enum OnboardingPhaseName {
  Initial = 'initial',
  ModProgress = 'modprogress',
}

export enum OnboardingStepName {
  CreateGame = 'create-game',
  CompleteProfile = 'complete-profile',
  NextClick = 'next-click',
}

export type IOnboardingStep = {
  id: OnboardingStepName;
  name: string;
  status: OnboardingStepStatus;
  link: string;
};

export type IOnboardingPhase = {
  id: OnboardingPhaseName;
  steps: IOnboardingStep[];
  completed: boolean;
  completionTimestamp?: string;
  dismissed?: boolean;
};

export type IOnboardingPhaseMap = {
  [key in OnboardingPhaseName]: IOnboardingPhase;
};
