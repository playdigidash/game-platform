import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';
import { CameraHelper, Vector3 } from 'three';
import TexturedCube from './TexturedCube';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react';

type BaseProps = {
  heroCount: number;
  cameraSlider: number;
};

export const Base = observer(({ heroCount, cameraSlider }: BaseProps) => {
  const camRef = useRef<any>();
  const directionalLightRef = useRef<any>();
  const { scene, gl } = useThree();
  const origin = new Vector3();
  const camFocus = useRef(origin);
  const {
    isMobile,
    questionMode,
    selectedHero,
    laneSelected,
    questionCounter,
    gameStarted,
  } = useGameStore().gamePlayViewStore;
  const { isPaused } = useGameStore().pauseMenuViewStore;
  const { questionsData } = useGameStore().gameViewStore;
  const { setCurrentQuestionData } = useGameStore().questionViewStore;
  const { audioRef, isMusicChecked } = useGameStore().settingsViewStore;
  const { executeFrameCallbacks, handleLayerSpawning } =
    useGameStore().gameViewStore;

  // Universal useFrame setup that other components can use
  useFrame((_state, delta) => {
    executeFrameCallbacks(delta);
    handleLayerSpawning();
  });

  const cameraPositions = {
    initial: {
      camera: {
        x: 0,
        y: 1.5,
        z: (heroCount: number) => -heroCount * 1.5,
      },
      focus: {
        x: 0,
        y: 0,
        z: -5,
      },
    },
    gameplay: {
      camera: {
        x: (slider: number) => slider,
        y: (isMobile: boolean) =>
          isMobile ? (laneSelected === 'Three Lane' ? 1.75 : 1.75) : 1.75,
        z: (isMobile: boolean) =>
          isMobile ? (laneSelected === 'Three Lane' ? 5.25 : 6) : 5,
      },
      focus: {
        x: (slider: number) => slider,
        y: 1.25, // gameCenter.y
        z: -4.75, // gameCenter.z
      },
    },
    questionMode: {
      camera: {
        x: 2.55,
        y: (isMobile: boolean) => (isMobile ? 16 : 12),
        z: -5,
      },
      focus: {
        x: 0,
        y: 0,
        z: -5, // gameCenter.z
      },
    },
  };

  useEffect(() => {
    if (directionalLightRef.current) {
      //directionalLightRef.current.parent?.add(helper); // Add to the scene
    }
  }, [directionalLightRef]);

  useEffect(() => {
    return () => {
      gl.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    if (audioRef && isMusicChecked) {
      // Always ensure audio is playing unless explicitly paused
      if (!isPaused && audioRef.paused) {
        audioRef.play().catch(() => {
          // Silently handle user interaction requirement
          return;
        });
      }
    }
  }, [audioRef, isMusicChecked, isPaused]);

  useEffect(() => {
    if (gameStarted) {
      const tl = gsap.timeline();
      tl.to(camRef.current.position, {
        x: cameraPositions.gameplay.camera.x(cameraSlider),
        y: cameraPositions.gameplay.camera.y(isMobile),
        z: cameraPositions.gameplay.camera.z(isMobile),
        duration: 2,
        delay: 1,
      });
      tl.to(
        camFocus.current,
        {
          x: cameraPositions.gameplay.focus.x(cameraSlider),
          y: cameraPositions.gameplay.focus.y,
          z: cameraPositions.gameplay.focus.z,
          duration: 2,
        },
        '<'
      );

      if (audioRef && isMusicChecked) {
        // Only try to play if audio is paused
        if (audioRef.paused) {
          audioRef.play().catch(() => {
            // Silently handle user interaction requirement
            return;
          });
        }
      }
    }
  }, [gameStarted]);

  useEffect(() => {
    if (questionMode && selectedHero !== -1) {
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentQuestionData(questionsData[questionCounter]);
        },
      });
      tl.to(camRef.current.position, {
        x: cameraPositions.questionMode.camera.x,
        y: cameraPositions.questionMode.camera.y(isMobile),
        z: cameraPositions.questionMode.camera.z,
        duration: 2,
        delay: 0.5,
      });
      tl.to(
        camFocus.current,
        {
          x: cameraPositions.questionMode.focus.x,
          y: cameraPositions.questionMode.focus.y,
          z: cameraPositions.questionMode.focus.z,
          duration: 2,
        },
        '<'
      );
    } else if (selectedHero !== -1) {
      const tl = gsap.timeline();
      tl.to(camRef.current.position, {
        x: cameraPositions.gameplay.camera.x(cameraSlider),
        y: cameraPositions.gameplay.camera.y(isMobile),
        z: cameraPositions.gameplay.camera.z(isMobile),
        duration: 2,
        delay: 0.5,
      });
      tl.to(
        camFocus.current,
        {
          x: cameraPositions.gameplay.focus.x(cameraSlider),
          y: cameraPositions.gameplay.focus.y,
          z: cameraPositions.gameplay.focus.z,
          duration: 1.5,
        },
        '<'
      );
    }
  }, [questionMode]);

  useEffect(() => {
    // For Horizontal Slider Based on player movement
    if (!questionMode && gameStarted) {
      const tl = gsap.timeline();
      tl.to(camRef.current.position, {
        x: cameraPositions.gameplay.camera.x(cameraSlider),
        duration: 0.35,
      });
      tl.to(
        camFocus.current,
        {
          x: cameraPositions.gameplay.focus.x(cameraSlider),
          y: cameraPositions.gameplay.focus.y,
          z: cameraPositions.gameplay.focus.z,
          duration: 0.35,
        },
        '<'
      );
    }
  }, [cameraSlider]);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        ref={camRef}
        fov={60}
        position={[
          cameraPositions.initial.camera.x,
          cameraPositions.initial.camera.y,
          cameraPositions.initial.camera.z(heroCount),
        ]}
      />
      <TexturedCube />
      <ambientLight intensity={0.6} />
      <directionalLight
        ref={directionalLightRef}
        intensity={1.5}
        castShadow
        position={[-10, 12, -15]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-40}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
      />
      <directionalLight intensity={0.6} position={[4, 2, 3]} />
    </>
  );
});
