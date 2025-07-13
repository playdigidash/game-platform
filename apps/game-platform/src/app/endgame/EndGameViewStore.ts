import { makeAutoObservable, action, reaction } from 'mobx';
import { HeroGLTFData } from './score/ScoreboardContentProps';
import {
  splitIndexes,
  updateGameSession,
  updateGameUser,
  IGameSession,
  IGameSessionQuestions,
} from '@lidvizion/commonlib';
import moment from 'moment';
import { RootStore } from '../RootStore/RootStore';
import { CurrentEndGameStep, EndGameQuestTxt } from '../Common';
import { v4 as uuidv4 } from 'uuid';
export class EndGameViewStore {
  root: RootStore;
  currentStep: CurrentEndGameStep = CurrentEndGameStep.scoreboard;
  animatedProgress = 0;
  animationFrame: number | null = null;
  isEndGameModalOpen = false;
  wantsToTrackProgress = false;
  isPrizeModalOpen = false;
  heroGLTF: HeroGLTFData | null = null;
  endTime = moment().valueOf();
  selectedLeaderboardPart = 1;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);

    reaction(
      () => this.isEndGameModalOpen,
      (isOpen) => {
        if (isOpen) {
          this.setEndTime(moment().valueOf());
          this.updateGameSessionFunc();
          this.setSelectedLeaderboardPart(
            this.root.gameViewStore.gameSession.questPart
          );
        }
      }
    );
  }

  get targetProgress() {
    const target =
      (this.root.gameViewStore.gameSession.questPart /
        this.totalQuestPart.parts) *
      100;
    return target;
  }

  get endGameQuestTxt() {
    let txt = '';
    if (
      Object.keys(this.root.gameViewStore.playedQuestions).length ===
      this.root.gameViewStore.getApiQuestions().length
    ) {
      txt = EndGameQuestTxt.complete;
    } else {
      txt = EndGameQuestTxt.next;
    }
    return txt;
  }

  get totalQuestPart() {
    const { parts, questionsInParts } = splitIndexes(
      this.root.gameViewStore.getApiQuestions().length
    );
    return { parts, questionsInParts };
  }

  setCurrentStep = action((step: CurrentEndGameStep) => {
    this.currentStep = step;
  });

  setSelectedLeaderboardPart = action((num: number) => {
    this.selectedLeaderboardPart = num;
  });

  setIsEndGameModalOpen = action((isOpen: boolean) => {
    this.isEndGameModalOpen = isOpen;
  });

  setWantsToTrackProgress = action((wants: boolean) => {
    this.wantsToTrackProgress = wants;
  });

  setIsPrizeModalOpen = action((isOpen: boolean) => {
    this.isPrizeModalOpen = isOpen;
  });

  setHeroGLTF = action((data: HeroGLTFData | null) => {
    this.heroGLTF = data;
  });

  setAnimatedProgress = action((value: number) => {
    this.animatedProgress = value;
  });

  setEndTime = action((time: number) => {
    this.endTime = time;
  });

  private stopProgressAnimation(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  cleanup(): void {
    this.stopProgressAnimation();
    this.animatedProgress = 0;
    this.heroGLTF = null;
  }

  get isGameComplete(): boolean {
    return (
      this.root.gameViewStore.gameSession.questPart ===
        this.totalQuestPart.parts &&
      Object.keys(this.root.gameViewStore.playedQuestions).length ===
        this.root.gameViewStore.getApiQuestions().length
    );
  }

  async updateGameSessionFunc(): Promise<void> {
    const currentSession = this.root.gameViewStore.gameSession;
    if (currentSession) {
      // Retrieve data from MobX stores
      const score = this.root.scoreViewStore.score;
      const coinCnt = this.root.collectableViewStore.coinCnt;
      const { questionCounter, firstTimeAnswers } = this.root.gamePlayViewStore;
      const { playedQuestions, currGamePlayedQuestions } =
        this.root.gameViewStore;
      const sessionQs: IGameSessionQuestions = {};
      currGamePlayedQuestions.forEach((q) => {
        sessionQs[q.id] = {
          id: q.id,
          tries: q.tries,
          played: true,
        };
      });
      // Update the currentSession object with new data
      const updatedSession: IGameSession = {
        ...currentSession,
        score,
        coins: coinCnt,
        questionsAnswered: questionCounter,
        correctAnswers: firstTimeAnswers,
        questions: sessionQs,
        endTime: this.endTime,
      };

      if (this.root.gameLoginViewStore.currUser?.uid) {
        updatedSession.uid = this.root.gameLoginViewStore.currUser.uid;
      }

      try {
        await updateGameSession({
          db: this.root.db,
          sessionId: updatedSession.sessionId,
          gameSession: updatedSession,
        });

        const currModuleId = this.root.moduleViewStore.currentModule?.moduleId;
        const currUser = this.root.gameLoginViewStore.currUser;

        if (currModuleId && currUser?.uid && currUser.playedQuestions) {
          await updateGameUser(this.root.db, currUser.uid, {
            playedQuestions: {
              ...currUser.playedQuestions,
              [`${currModuleId}`]: Object.keys(playedQuestions),
            },
          });
        }

        this.root.gameViewStore.setGameSession(updatedSession);
      } catch (error) {
        console.error('Error updating game session:', error);
      }
    }
  }

  handleNextGameClick = action(async () => {
    if (!this.root.gameLoginViewStore.isAnonLogin) {
      if (
        Object.keys(this.root.gameViewStore.playedQuestions).length ===
        this.root.gameViewStore.getApiQuestions().length
      ) {
        await updateGameSession({
          db: this.root.db,
          sessionId: uuidv4(),
          gameSession: {
            ...this.root.gameViewStore.gameSession,
            questAttempt: this.root.gameViewStore.gameSession.questAttempt + 1,
            questPart: 1,
            questions: {},
            questionsAnswered: 0,
            correctAnswers: 0,
            score: 0,
            coins: 0,
          },
        });
      }

      window.location.reload();
    } else {
      this.root.gameLoginViewStore.setShowLoginModal(true);
    }
  });

  currentProgress = action(() => {
    const progress = Object.keys(
      this.root.gameViewStore.playedQuestions
    ).length;
    const totalQuestions =
      this.root.gameViewStore.getApiQuestions().length || 1;
    const normalized = progress / totalQuestions;
    return normalized;
  });
}
