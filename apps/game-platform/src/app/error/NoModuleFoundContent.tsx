import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import DigiDashLogo from './assets/Logos/Digi-Dash.IOLogo.svg';

export const NoModuleFoundContent: React.FC = observer(() => {
  const { handleGameIdChg, gameId } = useGameStore().gameViewStore;
  const theme = useTheme()
  
  return (
    <Box
      component={'div'}
      display={'flex'}
      flexDirection={'column'}
      gap={'1em'}
    >
      <Typography variant="h6">{'Game id missing from url. Enter game id below'}</Typography>
      {
        <Box
          component={'div'}
          gap={'1em'}
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
        >
          <TextField
            fullWidth
            variant="outlined"
            value={gameId}
            onChange={(v) => handleGameIdChg(v.target.value)}
            inputProps={{
              style: {
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.default,
                borderRadius: '1rem',
                padding: '1rem',
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.dark,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() =>
              (window.location.href = `${window.location.origin}/${gameId}`)
            }
          >
            Dash
          </Button>
        </Box>
      }
      {/* <Box mt={3} component={'div'}>
        <img
          src={DigiDashLogo}
          alt="Digi-Dash.IO Logo"
          width="150px"
          height="auto"
        />
      </Box> */}
    </Box>
  );
});
