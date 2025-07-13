import React from 'react';
import { useTheme } from '@mui/material';
import { QuestNode } from './QuestNode';
import { IQuestStepProps } from './QuestStepProps';
import stylesCssModule from './QuestLine.module.css';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { useNavigate } from 'react-router-dom';

const styles = stylesCssModule as Record<string, string>;

export const QuestStep: React.FC<IQuestStepProps> = ({
  part,
  status,
  isFirst,
  isLast,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { handleQuestPartClick } = useGameStore().gameViewStore;
  const connectorClasses = `${styles['questConnector']} ${
    status === 'locked' ? styles['questConnectorLocked'] : ''
  }`;

  const connectorStyles = {
    '--quest-primary': theme.palette.primary.main,
    '--quest-secondary': theme.palette.secondary.main,
  } as React.CSSProperties;

  return (
    <div className={styles['questStepContainer']}>
      <QuestNode
        id={part.id}
        status={status}
        label={part.label}
        onClick={() => {
          handleQuestPartClick(part.id);
          navigate(
            `${window.location.pathname}${
              window.location.pathname.endsWith('/') ? '' : '/'
            }dash`
          );
        }}
        isFirst={isFirst}
        isLast={isLast}
        isOnlyOne={false}
      />
      {!isLast && <div className={connectorClasses} style={connectorStyles} />}
    </div>
  );
};
