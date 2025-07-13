import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { useTheme } from '@mui/material';

export const SelectAvaDescription = observer(() => {
  const theme = useTheme();
  const { selectedIndex, herosData } = useGameStore().gameViewStore;
  const { translatedGameData } = useGameStore().translateViewStore;

  return (
    <div>
      {herosData.length === 0 ? (
        <div
          style={{
            padding: '2vh 3vw',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '0.5rem',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '40vw',
          }}
        >
          <h3 style={{ fontSize: 'clamp(1.25rem, 2vw, 2rem)' }}>
            Loading Heroes...
          </h3>
          <p style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.25rem)' }}>
            Please wait while we fetch the available heroes.
          </p>
          <p style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.25rem)' }}>
            If nothing appears, open in a browser or refresh your browser.
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 'clamp(1.25rem, 2vw, 2rem)',
              fontWeight: 'bold',
              textShadow: '0.1rem 0.1rem 0.2rem rgba(0,0,0,0.5)',
              color: theme.palette.text.primary,
            }}
          >
            {translatedGameData?.heroes[selectedIndex].title}
          </div>
          <div
            style={{
              fontSize: 'clamp(0.875rem, 1.5vw, 1.5rem)',
              color: theme.palette.text.primary,
            }}
          >
            {translatedGameData?.heroes[selectedIndex]?.description || ''}
          </div>
        </>
      )}
    </div>
  );
});
