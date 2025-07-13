export type QuestStatus = 'locked' | 'available' | 'complete' | 'retry';

export interface IQuestNodeProps {
  id: string | number;
  status: QuestStatus;
  label: string;
  onClick: (id: string | number) => void;
  isFirst: boolean;
  isLast: boolean;
  isOnlyOne: boolean; // True if this is the only quest part
}

export interface IQuestLineProps {
  currentQuestPart: number; // To determine which part is currently active or next
}

// Placeholder for quest progress structure, actual implementation will be in MobX store
export const initialQuestProgress: Record<number, QuestStatus> = {
  1: 'available',
  2: 'locked',
  3: 'locked',
};
