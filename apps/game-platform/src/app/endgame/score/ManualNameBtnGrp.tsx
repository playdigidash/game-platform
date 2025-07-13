import { Box, TextField } from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { SaveScoreBtn } from './SaveScoreBtn';
import { GenNameBtn } from './GenNameBtn';
import { CurrentEndGameStep } from '../../Common';

export const ManualNameBtnGrp: React.FC = observer(() => {
  const { isNameValid, displayName, handleDisplayNameChange } =
    useGameStore().scoreViewStore;
  const { setCurrentStep } = useGameStore().endGameViewStore;

  return (
    <Box
      component={'div'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={'1em'}
      width={'100%'}
    >
      <Box 
        component={'div'} 
        display={'flex'} 
        alignItems={'center'}
        gap={'0.5rem'}
        width={'100%'}
      >
        <TextField
          label="Add Display Name (No Spaces or Symbols)"
          variant="outlined"
          value={displayName}
          onChange={handleDisplayNameChange}
          error={displayName.length > 0 && !isNameValid}
          helperText={
            displayName.length > 0 && !isNameValid
              ? 'Display name must be at least 3 characters long'
              : ''
          }
          onKeyPress={(e) => {
            if (e.key === 'Enter' && isNameValid) {
              setCurrentStep(CurrentEndGameStep.leaderboard);
            }
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            flex: 1,
            color: 'white',
            input: { color: 'white' },
            minWidth: 280,
          }}
        />
        <GenNameBtn />
      </Box>
      <SaveScoreBtn />
    </Box>
  );
});
