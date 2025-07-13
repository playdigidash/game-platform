import { observer } from 'mobx-react';
import {
  CurrEnvironment,
  MongoDB,
  RealmApp,
  createCustomTheme,
  darkModeTheme,
  environmentConfig,
} from '@lidvizion/commonlib';
import { environment } from '../environments/environment';
import { RootStoreProvider, useGameStore } from './RootStore/RootStoreProvider';
import { Box, CssBaseline, Theme, ThemeProvider } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { AppEntry } from './AppEntry';
import { useEffect, useState } from 'react';
import { deepmerge } from '@mui/utils';
import gameTheme from './theme/gameTheme';
import { ObstacleTest } from './obstacles/ObstacleTest';

// Create a base theme that only includes typography settings from gameTheme
const baseThemeWithGameTypography = {
  typography: gameTheme.typography,
  components: {
    MuiCssBaseline: gameTheme.components?.MuiCssBaseline,
  },
};

const defaultTheme = deepmerge(darkModeTheme, baseThemeWithGameTypography);

export const App: React.FC = observer(() => {
  return (
    <RealmApp
      env={
        environment.production
          ? CurrEnvironment.Production
          : CurrEnvironment.Development
      }
    >
      <MongoDB>
        <RootStoreProvider>
          <GoogleOAuthProvider
            clientId={environmentConfig.getGoogleConfig()?.clientId || ''}
          >
            <InnerApp />
          </GoogleOAuthProvider>
        </RootStoreProvider>
      </MongoDB>
    </RealmApp>
  );
});

export default App;

const InnerApp = observer(() => {
  const { settings } = useGameStore().gameViewStore;
  const [customTheme, setCustomTheme] = useState<Theme>();

  useEffect(() => {
    if (settings && !customTheme) {
      if (settings.primaryColor && settings.secColor) {
        const baseTheme = createCustomTheme(
          'dark',
          settings.primaryColor,
          settings.secColor
        );
        // Merge custom theme with typography settings
        const mergedTheme = deepmerge(baseTheme, baseThemeWithGameTypography);
        setCustomTheme(mergedTheme);
      }
    }
  }, [customTheme, settings]);

  return (
    <ThemeProvider theme={customTheme || defaultTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          component="div"
          className="App"
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <AppEntry />
          {/* <ObstacleTest /> */}
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
});
