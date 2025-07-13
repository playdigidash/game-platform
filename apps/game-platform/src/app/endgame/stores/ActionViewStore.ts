import { makeAutoObservable, action, runInAction } from 'mobx';
import { RootStore } from '../../RootStore/RootStore';
import { IActions } from '@lidvizion/commonlib';
import { updateGameSession } from '@lidvizion/commonlib';
import { observable } from 'mobx';

export interface RedirectActionType extends IActions {
  redirectUrl: string;
  description?: string;
}

// Define the store interface
export interface IActionViewStore {
  // Observable properties
  isModalOpen: boolean;
  actionId: string | null;
  currentAction: IActions | null;
  isStarted: boolean;
  isCompleted: boolean;
  isClosing: boolean;
  pendingRedirects: Map<string, number>;
  root: RootStore;
  error: string | null;

  // Methods
  setIsModalOpen(isOpen: boolean): void;
  setActionId(id: string | null): void;
  setCurrentAction(action: IActions | null): void;
  startAction(actionId: string): void;
  addPendingRedirect(actionId: string, points: number): void;
  complete(actionId: string): Promise<void>;
  abort(actionId: string): void;
  cleanup(actionId: string): void;
  fetchAction(): Promise<void>;
}

export class ActionViewStore implements IActionViewStore {
  // Observable properties
  isModalOpen = false;
  actionId: string | null = null;
  currentAction: IActions | null = null;
  isStarted = false;
  isCompleted = false;
  isClosing = false;
  error: string | null = null;
  pendingRedirects = observable.map<string, number>();

  constructor(public root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setIsModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen && this.isClosing) {
      this.resetState();
    }
  }

  setActionId(id: string | null) {
    if (id !== this.actionId) {
      this.actionId = id;
      if (id === null) {
        this.currentAction = null;
        this.isStarted = false;
        this.isCompleted = false;
      }
    }
  }

  setCurrentAction(action: IActions | null) {
    this.currentAction = action;
  }

  private resetState() {
    this.actionId = null;
    this.currentAction = null;
    this.isStarted = false;
    this.isCompleted = false;
    this.isClosing = false;
    this.error = null;
  }

  startAction(actionId: string) {
    if (this.isStarted || this.isClosing) return;
    this.isStarted = true;
  }

  addPendingRedirect(actionId: string, points: number) {
    this.pendingRedirects.set(actionId, points);
  }

  async complete(actionId: string) {
    if (this.isCompleted || this.isClosing) return;
    
    try {
      runInAction(() => {
        this.isClosing = true;
      });

      const points = this.pendingRedirects.get(actionId) || 0;
      
      // Add points to score
      this.root.scoreViewStore.addScore(points);

      // Get current game session
      const currentSession = this.root.gameViewStore.gameSession;
      if (!currentSession?.sessionId || !actionId || !this.root.db) {
        throw new Error('Missing required data for completion');
      }

      // Create new action record
      const newAction = {
        actionId,
        completed: true,
        completedAt: new Date(),
        pointsEarned: points,
        type: this.currentAction?.type
      };

      // Create updated session with new action
      const updatedSession = {
        ...currentSession,
        actions: [...(currentSession.actions || []), newAction]
      };

      // Update the game session
      await updateGameSession({
        db: this.root.db,
        sessionId: currentSession.sessionId,
        gameSession: updatedSession
      });

      // Update local state
      this.root.gameViewStore.setGameSession(updatedSession);

      // Update action metrics
      await this.root.db.collection('actions').updateOne(
        { actionId: actionId },
        { 
          $inc: { 'metrics.completions': 1 },
          $set: { 'metrics.lastUsedAt': new Date() }
        }
      );

      runInAction(() => {
        this.isCompleted = true;
        this.pendingRedirects.delete(actionId);
      });

    } catch (error) {
      console.error('Error completing action:', error);
      runInAction(() => {
        this.isClosing = false;
      });
      throw error;
    }
  }

  abort(actionId: string) {
    if (this.isClosing) return;
    
    runInAction(() => {
      this.isClosing = true;
      this.isStarted = false;
      this.pendingRedirects.delete(actionId);
      this.isClosing = false;
    });
  }

  cleanup(actionId: string) {
    if (this.isStarted && !this.isCompleted && !this.isClosing) {
      this.abort(actionId);
    }
  }

  async fetchAction() {
    if (!this.actionId || !this.root.db) {
      return;
    }

    try {
      const action = await this.root.db.collection('actions').findOne({ actionId: this.actionId });
      if (action) {
        runInAction(() => {
          this.currentAction = action;
        });
      } else {
        this.setError('Action not found');
      }
    } catch (error) {
      console.error('Error fetching action:', error);
      this.setError('Failed to fetch action');
    }
  }

  setError = action((error: string | null) => {
    this.error = error;
  });
} 