import { IconButton, alpha, useTheme, Tooltip } from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import AutoModeIcon from '@mui/icons-material/AutoMode';

export const GenNameBtn: React.FC = observer(() => {
  const { handleNameGenerate } = useGameStore().scoreViewStore;
  const theme = useTheme();

  return (
    <Tooltip title="Generate Random Name" placement="top">
      <IconButton
        onClick={handleNameGenerate}
        sx={(theme) => ({
          color: theme.palette.primary.main,
          transition: 'all 0.3s ease',
          padding: '0.5rem',
          '&:hover': {
            color: alpha(theme.palette.primary.main, 0.85),
            transform: 'scale(1.05)',
          },
        })}
      >
        <AutoModeIcon sx={{ fontSize: '1.5rem' }} />
      </IconButton>
    </Tooltip>
  );
});
