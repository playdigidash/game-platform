import { QuestStatus } from './QuestLineProps';

export interface IQuestStepProps {
  part: {
    id: string | number;
    label: string;
    partNumber: number;
  };
  status: QuestStatus;
  isFirst: boolean;
  isLast: boolean;
}
