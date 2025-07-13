import React from 'react';
import { useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LockIcon from '@mui/icons-material/Lock';
import { IQuestNodeProps } from './QuestLineProps';
import { TrophyIcon } from './TrophyIcon';
import stylesCssModule from './QuestLine.module.css';
import { useGameStore } from '../RootStore/RootStoreProvider';

const styles = stylesCssModule as Record<string, string>;

const startButtonStyles = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '0.375rem 0.75rem',
  borderRadius: '1rem',
  fontSize: '0.875rem',
  fontWeight: 'bold',
  marginBottom: '0.25rem',
  boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  whiteSpace: 'nowrap',
} as const;

export const QuestNode: React.FC<IQuestNodeProps> = ({
  id,
  status,
  onClick,
  isLast,
}) => {
  const theme = useTheme();
  const { retryQuestLabel } = useGameStore().gameViewStore;

  const handleClick = () => {
    if (status === 'available' || status === 'retry') {
      onClick(id);
    }
  };

  const nodeClasses = [
    styles['questNode'],
    styles[`questNode${status.charAt(0).toUpperCase() + status.slice(1)}`],
    isLast ? styles['questNodeTrophy'] : '',
  ].filter(Boolean).join(' ');

  const nodeStyles = {
    '--quest-primary': theme.palette.primary.main,
    '--quest-secondary': theme.palette.secondary.main,
    '--quest-primary-glow': `${theme.palette.primary.main}B3`,
    '--quest-secondary-glow': `${theme.palette.secondary.main}B3`,
  } as React.CSSProperties;

  const debugInfo = {
    id,
    status,
    isLast,
  };

  const renderIcon = () => {
    if (isLast) {
      return <TrophyIcon isLocked={status === 'locked'} />;
    }
    if (status === 'locked') {
      return <LockIcon />;
    }
    // Always show checkmark for completed, available, and retry parts
    return <CheckIcon />;
  };

  const showStartHelper = (status === 'available' || status === 'retry') && !isLast;
  const helperText = status === 'retry' ? retryQuestLabel : 'Start';

  return (
    <div className={styles['questNodeWrapper']}>
      {/* Helper text for current available part */}
      {showStartHelper && (
        <div className={styles['questHelperContainer']}>
          <div className={styles['questStartButton']}>
            {helperText}
          </div>
          <div className={styles['questHelperArrow']} />
        </div>
      )}
      
      <div 
        className={nodeClasses}
        onClick={handleClick}
        style={nodeStyles}
        data-debug={JSON.stringify(debugInfo)}
      >
        <div className={styles['questIconContainer']}>
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}; 