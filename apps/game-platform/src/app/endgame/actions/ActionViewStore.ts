import { action, makeAutoObservable, observable } from 'mobx';
import { RootStore } from '../../RootStore/RootStore';
import { IActions } from '@lidvizion/commonlib';

interface MongoAction extends IActions {
  _id: string;
  redirectUrl?: string;
}

export class ActionViewStore {
  root: RootStore;
  currentAction: IActions | null = null;
  isLoading = false;
  error: string | null = null;
  isModalOpen = false;
  actionId: string | null = null;
  redirectPending = observable.map<string, number>();

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  setCurrentAction = action((action: IActions | null) => {
    this.currentAction = action;
  });

  setIsLoading = action((loading: boolean) => {
    this.isLoading = loading;
  });

  setError = action((error: string | null) => {
    this.error = error;
  });

  setIsModalOpen = action((isOpen: boolean) => {
    this.isModalOpen = isOpen;
    if (!isOpen) {
      // Reset state when modal is closed
      this.currentAction = null;
      this.isLoading = false;
      this.error = null;
      this.actionId = null;
    }
  });

  setActionId = action((id: string | null) => {
    this.actionId = id;
  });

  addPendingRedirect = action((actionId: string, points: number) => {
    this.redirectPending.set(actionId, points);
  });

  complete = action(async (actionId: string) => {
    const points = this.redirectPending.get(actionId);
    if (!points) return;

    try {
      this.root.scoreViewStore.addScore(points);

      const currentSession = this.root.gameViewStore.gameSession;
      if (!currentSession?.sessionId || !this.root.db) {
        return;
      }

      const newAction = {
        actionId,
        completed: true,
        completedAt: new Date(),
        pointsEarned: points,
        type: 'redirect'
      };

      const updatedSession = {
        ...currentSession,
        actions: [...(currentSession.actions || []), newAction]
      };

      await this.root.db.collection('actions').updateOne(
        { actionId },
        { 
          $inc: { 'metrics.completions': 1 },
          $set: { 'metrics.lastUsedAt': new Date() }
        }
      );

      this.root.gameViewStore.setGameSession(updatedSession);
      this.redirectPending.delete(actionId);
    } catch (error) {
      console.error('Error completing redirect action:', error);
    }
  });

  abort = action((actionId: string) => {
    this.redirectPending.delete(actionId);
  });

  fetchAction = action(async () => {
    if (!this.actionId || !this.root.db) {
      return;
    }

    this.setIsLoading(true);
    this.setError(null);
    this.setCurrentAction(null);

    try {
      const actionCollection = this.root.db.collection<MongoAction>('actions');
      const action = await actionCollection.findOne({ actionId: this.actionId });
      
      if (action) {
        const { _id, ...actionWithoutId } = action;
        this.setCurrentAction(actionWithoutId);
      } else {
        this.setError('Action not found.');
      }
    } catch (err) {
      this.setError('Failed to load action details.');
    } finally {
      this.setIsLoading(false);
    }
  });
} 