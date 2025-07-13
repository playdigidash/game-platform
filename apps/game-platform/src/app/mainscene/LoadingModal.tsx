import { observer } from 'mobx-react-lite';
import { useGameStore } from '../RootStore/RootStoreProvider';
import DDLogo from '../../../../../libs/commonlib/src/lib/commonmodels/assets/digidashlogos/dd-logo-white500x500.svg';
import React, { useEffect } from 'react';
import './LoadingModal.css';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Toll, Quiz } from '@mui/icons-material';

export const LoadingModal = observer(() => {
  const { loadingAnimationState, startLoadingAnimation } = useGameStore().mainSceneViewStore;
  const { setMobile } = useGameStore().gamePlayViewStore;

  useEffect(() => {
    const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    setMobile(mobile);
  }, [setMobile]);

  useEffect(() => {
    startLoadingAnimation();
  }, [startLoadingAnimation]);

  if (!loadingAnimationState.isModalVisible) {
    return null;
  }

  return (
    <div className="loading-modal">
      <div className="title-container">
        <h1 className="title">DIGI DASH</h1>
      </div>
      <div className="logo-container">
        <div className="trail" />
        <img 
          src={DDLogo} 
          alt="Digi Dash Loading Logo" 
          className="logo"
        />
      </div>
      <div className="tips-container">
        <div className={`tip ${loadingAnimationState.showDodge ? 'show' : ''}`}>
          <DirectionsRunIcon sx={{ fontSize: 24, marginRight: '0.5em' }} />
          Dodge Obstacles
        </div>
        <div className={`tip ${loadingAnimationState.showCollect ? 'show' : ''}`}>
          <Toll sx={{ fontSize: 24, marginRight: '0.5em' }} />
          Collect Coins
        </div>
        <div className={`tip ${loadingAnimationState.showTrivia ? 'show' : ''}`}>
          <Quiz sx={{ fontSize: 24, marginRight: '0.5em' }} />
          Answer Trivia & Win!
        </div>
      </div>
    </div>
  );
});

export default LoadingModal;
