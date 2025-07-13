import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useGameStore } from './RootStore/RootStoreProvider';
import { observer } from 'mobx-react';
import { LoadingModal } from './mainscene/LoadingModal';
import { MainScreen } from './mainscreen/MainScreen';

export const Dashboard: React.FC = observer(() => {
  const { selectedHero, setPlayGame } = useGameStore().gamePlayViewStore;
  const { isGameLoading } = useGameStore().mainSceneViewStore;
  const { herosData, obstaclesData, showMenuScreen } =
    useGameStore().gameViewStore;
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    if (
      herosData &&
      herosData.length > 0 &&
      obstaclesData &&
      (obstaclesData.dodgeObs.length > 0 ||
        obstaclesData.jumpObs.length > 0 ||
        obstaclesData.slideObs.length > 0)
    ) {
      setAssetsLoaded(true);
    }
  }, [herosData, obstaclesData]);

  useEffect(() => {
    if (selectedHero !== -1) {
      setPlayGame(true);
    }
  }, [selectedHero, setPlayGame]);

  return (
    <Box
      className="main-screen-container"
      component="div"
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: '0',
        background: '#222222',
      }}
    >
      <LoadingModal />
      {showMenuScreen && <MainScreen />}
    </Box>
  );
});
