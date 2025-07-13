import { Canvas } from '@react-three/fiber';
import { observer } from 'mobx-react';
import { Base } from '../FiberComponents/Base';
import { Physics } from '@react-three/rapier';
import { Suspense, useEffect, useRef, useState } from 'react';
import { AvatarSelectionScene } from '../FiberComponents/AvatarSelectionScene';
import Ground from '../FiberComponents/Ground';
import { ObstaclesHandler } from '../obstacles/ObstaclesHandler';
import Player from '../FiberComponents/Player';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { IDirection } from '@lidvizion/commonlib';

export const MainGameCanvas: React.FC = observer(() => {
  const { herosData, laneSize } = useGameStore().gameViewStore;
  const { resetGame } = useGameStore().mainSceneViewStore;
  const { audioRef } = useGameStore().settingsViewStore;
  const {
    setGestureMovementKey,
    isMobile,
    resetGamePlay,
    setIsTutorialCompleted,
    setAchievement,
    selectedHero,
    isTutorial,
    cameraSlider,
    isTutorialCompleted,
    laneSelected,
    showScoreBoard,
  } = useGameStore().gamePlayViewStore;
  const { reset } = useGameStore().scoreViewStore;
  const { resetCollectables } = useGameStore().collectableViewStore;
  const countRef = useRef(0);
  const { translatedGameData } = useGameStore().translateViewStore;
  const wellDoneLabel =
    translatedGameData?.wellDoneLabel || 'Well Done! Keep Going!';

  useEffect(() => {
    // Store original styles to restore them later
    const originalStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      height: document.body.style.height,
      width: document.body.style.width,
    };

    // Disable scrollbars
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Restore original styles when component unmounts
    return () => {
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.position = originalStyle.position;
      document.body.style.width = originalStyle.width;
      document.body.style.height = originalStyle.height;
    };
  }, []);

  useEffect(() => {
    resetGame();
    resetGamePlay();
    setAchievement(undefined);
  }, []);

  const [gestureEvents, setGestureEvents] = useState<any>({});

  const handleTouchStart = (event: any) => {
    // Prevent default browser behavior if in gameplay mode
    if (selectedHero !== -1 || isMobile) {
      event.preventDefault();
    }

    const touchStartX = event.touches[0].clientX;
    const touchStartY = event.touches[0].clientY;

    setGestureEvents({ touchStartX, touchStartY });
  };

  const handleTouchEnd = (event: any) => {
    // Prevent default browser behavior if in gameplay mode
    if (selectedHero !== -1 || isMobile) {
      event.preventDefault();
    }

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    setGestureEvents((prev: any) => {
      return { ...prev, touchEndX, touchEndY };
    });
  };

  useEffect(() => {
    if (gestureEvents && gestureEvents.touchStartX && gestureEvents.touchEndX) {
      if (selectedHero !== -1 || isMobile) {
        handleSwipe();
      }
    }
  }, [gestureEvents]);

  const handleSwipe = () => {
    const screenWidth = window.innerWidth * 0.5;
    const horizontalSwipeDistance = Math.abs(
      gestureEvents.touchEndX - gestureEvents.touchStartX
    );

    const horizontalForce = Math.min(horizontalSwipeDistance / screenWidth, 1);
    const verticalForce = 1;

    if (gestureEvents.touchEndX < gestureEvents.touchStartX) {
      setGestureMovementKey(
        IDirection.left,
        ++countRef.current,
        horizontalForce
      );
    }

    if (gestureEvents.touchEndX > gestureEvents.touchStartX) {
      setGestureMovementKey(
        IDirection.right,
        ++countRef.current,
        horizontalForce
      );
    }

    if (gestureEvents.touchStartY - gestureEvents.touchEndY > 100) {
      setGestureMovementKey(IDirection.up, ++countRef.current, verticalForce);
    }

    if (gestureEvents.touchEndY - gestureEvents.touchStartY > 100) {
      setGestureMovementKey(IDirection.down, ++countRef.current, verticalForce);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
      }
    };
  }, [audioRef]);

  useEffect(() => {
    if (isTutorial) {
      reset();
      resetCollectables();
      resetGame();
    } else if (!isTutorialCompleted) {
      setAchievement({
        text: '🏆 Well Done! Keep Going! 🏃',
        translatedText: wellDoneLabel,
        style: {
          color: '#4CAF50',
          fontSize: '2rem',
          fontFamily: 'Orbitron, sans-serif',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'fadeInOut 3s forwards',
          zIndex: 1500,
        },
        customStyle: `
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          }
        `,
      });

      // Set tutorial as completed and reset game state
      setIsTutorialCompleted(true);

      // Reset game state with a delay to allow achievement animation
      setTimeout(() => {
        reset();
        resetCollectables();
        resetGame();
      }, 3000);
    }
  }, [isTutorial]);

  // Add console log to track selectedHero changes
  useEffect(() => {
    // Hero selection tracking logic if needed can go here
  }, [selectedHero, herosData]);

  return (
    <Canvas
      className="main-game-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        width: '100%',
        height: '100%',
        touchAction: 'none', // Disable browser handling of all touch gestures
      }}
      shadows
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={(event) =>
        selectedHero !== -1 || isMobile ? event.preventDefault() : null
      }
    >
      <Base
        heroCount={herosData.length}
        cameraSlider={laneSelected === 'Three Lane' ? cameraSlider : 0}
      />

      {selectedHero !== -1 && laneSelected !== null && !showScoreBoard && (
        <Suspense>
          <Physics>
            <Player laneSize={laneSize} selectedAva={herosData[selectedHero]} />
            <Ground />
            <ObstaclesHandler />
          </Physics>
        </Suspense>
      )}

      {selectedHero === -1 && <AvatarSelectionScene />}
    </Canvas>
  );
});
