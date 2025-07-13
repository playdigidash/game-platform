import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { SaveScoreBtn } from './SaveScoreBtn';
import { GenNameBtn } from './GenNameBtn';

export const GenerateBtnGrp: React.FC = observer(() => {
  const { displayName, namePlaceHolder } = useGameStore().scoreViewStore;

  return (
    <Box
      component={'div'}
      alignItems={'center'}
      display={'flex'}
      flexDirection={'column'}
      gap={'1em'}
    >
      <Box
        component={'div'}
        display={'flex'}
        alignItems={'center'}
        gap={'0.5rem'}
      >
        <Typography>{displayName || namePlaceHolder}</Typography>
        <GenNameBtn />
      </Box>
      <SaveScoreBtn />
    </Box>
  );
});
