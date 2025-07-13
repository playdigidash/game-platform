import React from 'react';
import { QuestLine } from '../quest/QuestLine';

interface QuestSectionProps {
  totalQuestParts: { parts: number };
  currentQuestPart: number;
}

export const QuestSection: React.FC<QuestSectionProps> = ({
  totalQuestParts,
  currentQuestPart,
}) => {
  if (totalQuestParts.parts <= 0) return null;

  return <QuestLine currentQuestPart={currentQuestPart} />;
};
