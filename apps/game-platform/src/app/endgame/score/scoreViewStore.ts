import { action, makeAutoObservable, toJS, reaction } from 'mobx';
import { RootStore } from '../../RootStore/RootStore';
import moment from 'moment';
import {
  // getUserScores,
  // getTop3UserScores,
  IDbQuestion,
  IGameProfile,
  ILeaderboardProfileType,
  nameGenerator,
  removeBadWords,
  updateGameSession,
  updateGameUser,
} from '@lidvizion/commonlib';
import { CurrentEndGameStep } from '../../Common';
import { isArray } from 'lodash';

export enum ScoreAdditions {
  distanceScore = 50,
  questionCorrect = 1000,
  coinCollected = 100,
}

export enum ScoreSubtractions {
  obstacleHit = 100,
}

export class ScoreViewStore {
  root: RootStore;
  score = 0;
  sessionTime = moment().valueOf();
  startTime = moment().valueOf();
  // todayProfiles: IGameProfile[] = [];
  // allTimeProfiles: IGameProfile[] = [];
  // topProfiles: IGameProfile[] = [];
  showSignUpModal = false;
  scorePerQuestion = 0;
  triesPerQuestion = 0;
  showScoreGrp = true;
  namePlaceHolder = 'Generate a name to upload score';
  // isProfilesLoading = false;
  currQScore = 300;
  showPenaltyBubble = false;
  scoreTimeDisplay = '';
  displayName = '';


  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }


  get showLeaderboardBtn() {
    let show = false;

    if (
      this.root.gameLoginViewStore.currUser?.displayName &&
      this.root.gameLoginViewStore.currUser.displayName.length > 0
    ) {
      show = true;
    }

    return show;
  }

  get showManualBtnGrp() {
    let show = true;

    if (this.showLeaderboardBtn) {
      show = false;
    } else if (this.root.gameLoginViewStore.isAnonLogin) {
      show = false;
    } else if (
      this.root.moduleViewStore.currentModule?.settings.isRandomNames
    ) {
      show = false;
    }

    return show;
  }

  get showGenerateBtnGrp() {
    return !this.showManualBtnGrp && !this.showLeaderboardBtn;
  }

  get currentUserRank() {
    const uid = this.root.gameLoginViewStore.currUser?.uid;

    const rank =
      this.root.leaderboardViewStore.allTimeProfiles.findIndex((profile: IGameProfile) => uid && profile.uid === uid) + 1;
    return rank > 0 ? rank : null;
  }

  get firstTryQs() {
    const arr: IDbQuestion[] = [];
    const seshQs = this.root.gameViewStore.gameSession.questions;

    if (seshQs) {
      Object.keys(seshQs).forEach((key) => {
        if (seshQs[key].tries === 1) {
          const found = this.root.questionViewStore.dbQuestionArr.find(
            (dbq) => {
              return dbq.id === key;
            }
          );

          if (found) {
            arr.push(found);
          }
        }
      });
    }

    return arr;
  }

  get isNameValid() {
    return (
      this.displayName !== this.namePlaceHolder &&
      this.displayName.trim().length > 3
    );
  }

  get firstTryQsCount() {
    return this.firstTryQs.length;
  }

  setScoreTimeDisplay = action((t: string) => {
    this.scoreTimeDisplay = t;
  });



  setCurrQScore = action((num: number) => {
    this.currQScore = num;
  });

  setDisplayName = action((name: string) => {
    this.displayName = removeBadWords(name);
  });

  setShowScoreGrp = action((bool: boolean) => {
    this.showScoreGrp = bool;
  });



  setSessionTime = action((time: number) => {
    this.sessionTime = time;
  });

  setShowSignUpModal = action((bool: boolean) => {
    this.showSignUpModal = bool;
  });

  handleNameGenerate = action(() => {
    const genName = nameGenerator();
    this.setDisplayName(genName);
    return genName;
  });

  handleDisplayNameChange = action((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 13) {
      this.setDisplayName(e.target.value);
    } else {
      this.setDisplayName(e.target.value.slice(0, 12));
    }
  });

  handleSaveScore = action(async () => {
    this.root.gameLoginViewStore.setShowLoginModal(true);
  });

  
  saveDisplayName = action(async () => {
    try {
      if (
        this.root.gameLoginViewStore.currUser &&
        this.root.gameViewStore.gameSession
      ) {
        this.root.gameLoginViewStore.currUser.displayName = this.displayName;

        await updateGameSession({
          db: this.root.db,
          keyValPair: {
            uid: this.root.gameLoginViewStore.currUser.uid,
            displayName: this.displayName,
          },
          sessionId: this.root.gameViewStore.gameSession.sessionId,
        });

        if (
          this.root.gameLoginViewStore.currUser.uid &&
          !this.root.gameLoginViewStore.isAnonLogin
        ) {
          await updateGameUser(
            this.root.db,
            this.root.gameLoginViewStore.currUser.uid,
            { displayName: this.displayName }
          );

          this.setShowScoreGrp(false);
        }
      }
    } catch (error) {
      // Error handling without console.error
    }
  });

  addScore = action((scoreAddition: ScoreAdditions) => {
    this.score += scoreAddition;
  });

  addCoinScore = action((coinCount: number) => {
    this.score += coinCount * ScoreAdditions.coinCollected;
  });

  subtractScore = action((scoreSubtraction: ScoreSubtractions) => {
    if (this.score - scoreSubtraction > 0) {
      this.score -= scoreSubtraction;
    } else {
      this.score = 0;
    }
  });

  reset = action(() => {
    this.score = 0;
    this.sessionTime = moment().valueOf();
    this.startTime = moment().valueOf();
  });

  checkDisplayName = action(async (currName: string) => {
    let displayName =
      this.root.gameLoginViewStore.currUser?.displayName || this.displayName;
    if (!displayName) {
      displayName = this.handleNameGenerate();
      await this.saveDisplayName();
    }

    return displayName;
  });

  handlePartChg = action((num: number) => {
    this.root.endGameViewStore.setSelectedLeaderboardPart(num);
  });

  addUsrScoreToLeaderboard = action((profiles: IGameProfile[]) => {
    profiles.forEach(async (prof) => {
      if (prof.uid === this.root.gameLoginViewStore.currUser?.uid) {
        prof.displayName = await this.checkDisplayName(prof.displayName);
      } else if (!prof.displayName) {
        prof.displayName = nameGenerator();
      }
    });

    // Return sorted profiles (highest score to lowest)
    return profiles.sort((a, b) => b.score - a.score);
  });


  

  setScorePerQuestion = action(
    (newScore: number) => (this.scorePerQuestion = newScore)
  );
  setTriesPerQuestion = action(
    (tries: number) => (this.triesPerQuestion = tries)
  );

  setShowPenaltyBubble = action((show: boolean) => {
    this.showPenaltyBubble = show;
  });
}
