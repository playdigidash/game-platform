import { Button, alpha } from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { pulse } from '../../Common';

export const SaveScoreBtn: React.FC = observer(() => {
  const { isNameValid, handleSaveScore } = useGameStore().scoreViewStore;

  return (
    <Button
      variant="contained"
      onClick={() => {
        handleSaveScore();
      }}
      disabled={!isNameValid}
      sx={(theme) => ({
        minWidth: '180px',
        fontSize: '1.25rem',
        padding: '0.75rem 2rem',
        backgroundColor: theme.palette.primary.main,
        transition: 'all 0.3s ease',
        animation: isNameValid ? `${pulse} 1.5s infinite` : 'none',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.85),
          transform: 'scale(1.05)',
        },
        '&:disabled': {
          backgroundColor: theme.palette.grey[600],
          color: theme.palette.grey[400],
        },
      })}
    >
      Save Score
    </Button>
  );
});
