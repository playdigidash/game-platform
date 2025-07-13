import React from 'react';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { EarthLayersOverview } from './EarthLayersOverview';
import { EarthLayer } from './EarthLayer';
import { PresenterQuestionModal } from './PresenterQuestionModal';
import { Box, Button, styled } from '@mui/material';
import { GameMode } from '../../RootStore/GameModeStore';
import '../styles/presenter.css';

const NavigationBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(10px)',
  zIndex: 1000,
}));

export const PresenterView: React.FC = observer(() => {
  const { gameModeStore, presenterViewStore } = useGameStore();

  // If not in presenter mode, don't render anything
  if (!gameModeStore.isPresenterMode) {
    return null;
  }

  return (
    <>
      <NavigationBar>
        <Button 
          variant="contained" 
          onClick={() => presenterViewStore.navigateToOverview()}
        >
          Back to Overview
        </Button>
        {presenterViewStore.currentLayerIndex !== -1 && (
          <Button 
            variant="contained" 
            onClick={() => presenterViewStore.navigateToQuestions()}
          >
            Practice Questions
          </Button>
        )}
        <Button 
          variant="contained" 
          onClick={() => gameModeStore.setGameMode(GameMode.RUNNER)}
        >
          Exit Presenter Mode
        </Button>
      </NavigationBar>

      {/* Show overview if no layer is selected */}
      {presenterViewStore.currentLayerIndex === -1 && (
        <EarthLayersOverview />
      )}

      {/* Show specific layer details */}
      {presenterViewStore.currentLayerIndex !== -1 && !presenterViewStore.isQuestionMode && (
        <EarthLayer />
      )}

      {/* Question Modal */}
      <PresenterQuestionModal />
    </>
  );
}); 