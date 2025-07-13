import { makeAutoObservable } from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import { QuestStatus } from './QuestLineProps';

export class QuestViewStore {
  root: RootStore;
  isQuestTransitioning = false;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  getStartHelperText = (status: QuestStatus) => {
    if (status === 'available') {
      return 'Start';
    } else if (status === 'complete') {
      return 'End';
    }
    return 'Start';
  };

  setIsQuestTransitioning = (value: boolean) => {
    this.isQuestTransitioning = value;
  };
}
