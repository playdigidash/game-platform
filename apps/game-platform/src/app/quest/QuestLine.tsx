import React from 'react';
import { QuestStep } from './QuestStep';
import { IQuestLineProps, QuestStatus } from './QuestLineProps';
import stylesCssModule from './QuestLine.module.css';
import { useGameStore } from '../RootStore/RootStoreProvider';

const styles = stylesCssModule as Record<string, string>;

export const QuestLine: React.FC<IQuestLineProps> = ({ currentQuestPart }) => {
  const { totalQuestParts, playedQuestions, apiQuestions } =
    useGameStore().gameViewStore;

  const getQuestNodeStatus = (partNumber: number): QuestStatus => {
    // If current quest part is beyond the total parts, all parts are completed
    // Show the first part as 'retry' so user can restart the quest
    if (Object.keys(playedQuestions).length === apiQuestions.length) {
      return 'retry';
    }

    // All other parts when quest is completed should be 'complete'
    if (currentQuestPart > totalQuestParts.parts) {
      return 'complete';
    }

    // Normal quest progression logic
    if (partNumber < currentQuestPart) return 'complete';
    if (partNumber === currentQuestPart) return 'available';
    return 'locked';
  };

  return totalQuestParts.parts > 0 ? (
    <div className={styles['questLineMainContainer']}>
      <div className={styles['questLineContainer']}>
        {totalQuestParts.questionsInParts.map((part, index) => (
          <QuestStep
            key={part}
            part={{
              id: part,
              label: part.toString(),
              partNumber: index,
            }}
            status={getQuestNodeStatus(index + 1)}
            isFirst={index === 0}
            isLast={index === totalQuestParts.questionsInParts.length - 1}
          />
        ))}
      </div>
    </div>
  ) : null;
};
