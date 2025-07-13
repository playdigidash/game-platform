import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import { useNavigate, useLocation } from 'react-router-dom';
import { QrCodeModal } from '../mainscreen/QrCodeModal';
import { useState, useEffect } from 'react';

// Import new components
import { SmokeBackground } from '../mainscreen/SmokeBackground';
import { TopNavigationBar } from '../mainscreen/TopNavigationBar';
import { MainScreenContent } from '../mainscreen/MainScreenContent';

export const MainScreen = observer(() => {
  const {
    setShowMenuScreen,
    logoSrc,
    bannerSrc,
    hasBanner,
    settings,
    showMenuScreen,
    playedQuestions,
    getApiQuestions,
    setQuestAttempt,
    questData,
    questReset,
    totalQuestParts,
    gameSession,
  } = useGameStore().gameViewStore;
  const { setPlayGame } = useGameStore().gamePlayViewStore;
  const { translatedGameData } = useGameStore().translateViewStore;
  const navigate = useNavigate();
  const location = useLocation();
  const { shouldShowQrCodeModal, setShowQrCodeModal } =
    useGameStore().gamePlayViewStore;
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleDescriptionClick = (
    event: React.MouseEvent<HTMLDivElement>,
    description: string | undefined
  ) => {
    if (!description) return;

    const target = event.currentTarget;
    const popover = document.createElement('div');
    popover.style.position = 'fixed';
    popover.style.left = `${target.getBoundingClientRect().left}px`;
    popover.style.top = `${target.getBoundingClientRect().bottom + 8}px`;
    popover.style.padding = '1rem';
    popover.style.background = 'rgba(0, 0, 0, 0.9)';
    popover.style.borderRadius = '0.5rem';
    popover.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.2)';
    popover.style.maxWidth = '80vw';
    popover.style.zIndex = '1000';
    popover.style.fontFamily = "'Orbitron', sans-serif";
    popover.style.color = '#fff';
    popover.innerText = description;

    const closePopover = () => {
      if (document.body.contains(popover)) {
        document.body.removeChild(popover);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!popover.contains(e.target as Node)) {
        closePopover();
      }
    };

    document.body.appendChild(popover);
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
  };

  return showMenuScreen ? (
    <SmokeBackground>
      <TopNavigationBar />

      <MainScreenContent
        hasBanner={hasBanner}
        bannerSrc={bannerSrc}
        title={translatedGameData?.title}
        description={translatedGameData?.desc || settings.gDesc}
        logoSrc={logoSrc}
        totalQuestParts={totalQuestParts}
        onDescriptionClick={handleDescriptionClick}
        currentQuestPart={gameSession.questPart}
      />

      {shouldShowQrCodeModal && (
        <QrCodeModal
          url={currentUrl}
          open={true}
          onClose={() => setShowQrCodeModal(false)}
        />
      )}
    </SmokeBackground>
  ) : null;
});
