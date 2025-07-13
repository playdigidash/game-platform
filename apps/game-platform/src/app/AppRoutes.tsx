import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  AppRoute,
  DefaultErrorHandleModal,
  IUserProfileType,
  LoginLvl,
} from '@lidvizion/commonlib';
import { useGameStore } from './RootStore/RootStoreProvider';
import { Dashboard } from './Dashboard';
import './gameStyles.css';
// import OrgProfilePage from './pages/OrgProfilePage';
import { Box } from '@mui/material';
import { PlatformLoginContentEntry } from '@lidvizion/login';
import PlayerProfile from './playerprofile/PlayerProfile';
import PastGames from './playerprofile/PastGames';
import GameSummary from './playerprofile/GameSummary';
import { NoModuleFoundContent } from './error/NoModuleFoundContent';
import { GameplayScreen } from './screens/GameplayScreen';
import { MainGameCanvas } from './mainscene/MainGameCanvas';
import { CarouselPage } from './carousel/CarouselPage';
import { GameLibraryPage } from './gamelibrary/GameLibraryPage';
import { Pages } from './pages/Pages';
// import { SubscriptionPage } from './pages/SubscriptionPage';

export const AppRoutes: React.FC = observer(() => {
  const { settings } = useGameStore().gameViewStore;
  const {
    handleAfterLogin,
    isAnonLogin,
    showVerifyTokenModal,
    tokenVerifyMsg,
    handleAfterLoginFail,
  } = useGameStore().gameLoginViewStore;

  return (
    <Box component={'div'}>
      {settings.gameLoginLvl === LoginLvl.high && isAnonLogin ? (
        <Routes>
          <Route
            path="*"
            element={
              <PlatformLoginContentEntry
                handleAfterLogin={handleAfterLogin}
                userType={IUserProfileType.game}
                showVerifyToken={showVerifyTokenModal}
                tokenVerifyMsg={tokenVerifyMsg}
                handleAfterLoginFail={handleAfterLoginFail}
                emailAllowed={false}
                phoneAllowed={true}
              />
            }
          />
        </Routes>
      ) : (
        <Routes>
          <Route path={AppRoute.dashWithModule} element={<Dashboard />} />
          {/* <Route path={AppRoute.dashWithOrg} element={<OrgProfilePage />} /> */}
          <Route path={AppRoute.dashWithPlayer} element={<PlayerProfile />} />
          <Route path={AppRoute.playerPastGames} element={<PastGames />} />
          <Route path={AppRoute.playerGameSummary} element={<GameSummary />} />
          <Route path={AppRoute.games} element={<GameLibraryPage />} />
          <Route path="pages" element={<Pages />} />
          <Route path="pages/:pageHandle" element={<Pages />} />
          {/* <Route path={AppRoute.subscription} element={<SubscriptionPage />} /> */}

          <Route
            path={AppRoute.gameplayScreen}
            element={
              <>
                <MainGameCanvas />
                <GameplayScreen />
              </>
            }
          />
          <Route path={AppRoute.carousel} element={<CarouselPage />} />
          <Route
            path={AppRoute.verifyMagicLink}
            element={
              <PlatformLoginContentEntry
                handleAfterLogin={handleAfterLogin}
                userType={IUserProfileType.game}
                showVerifyToken={showVerifyTokenModal}
                tokenVerifyMsg={tokenVerifyMsg}
                handleAfterLoginFail={handleAfterLoginFail}
                emailAllowed={false}
                phoneAllowed={true}
              />
            }
          />
          <Route
            path="*"
            element={
              <DefaultErrorHandleModal content={<NoModuleFoundContent />} />
            }
          />
        </Routes>
      )}
    </Box>
  );
});
