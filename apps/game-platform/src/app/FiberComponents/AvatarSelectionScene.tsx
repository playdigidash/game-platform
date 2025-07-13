import React, { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import {
  Circle,
  Cylinder,
  OrbitControls,
  Environment,
  Float,
  Html,
  Cone,
  View,
  CameraControls,
  Plane,
} from '@react-three/drei';
import { HeroModel, AVA_ANIM } from './HeroModel';
import gsap from 'gsap';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import { fetch3DObjects, useMongoDB } from '@lidvizion/commonlib';
import { useTheme, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Group } from 'three';
import { IGlb } from '@lidvizion/commonlib';
import VolumeControl from '../volume/VolumeControl';
import LoadingOverlay from 'react-loading-overlay-ts';
import styled from '@emotion/styled';
import { Spotlight } from './Spotlight';
import * as THREE from 'three';
import { HeroCarousel } from '../movement/avaselect/HeroCarousel';

// Apply custom styling to LoadingOverlay

// Create a separate component for Volume Control UI

export const AvatarSelectionScene: React.FC = observer(() => {
  const {
    selectedIndex,
    heroSelGLTFMap,
    herosData,
    setSelectedIndex,
    showCarousel,
    getHeroGLTF,
    handleAvatarKeyDown,
    handleAvatarKeyUp,
    handleAvatarGesture,
    setAvaSelectisplayData,
    handleHeroSelection,
  } = useGameStore().gameViewStore;

  const { fetchReqData, setAchievement, createHeroAchievement, gestureKey } =
    useGameStore().gamePlayViewStore;

  const { translatedGameData } = useGameStore().translateViewStore;
  const selectYourHeroLabel =
    translatedGameData?.selectYourHeroLabel || 'Select Your Hero!';

  const { scene, gl, camera } = useThree();

  const { audioRef, isMusicChecked } = useGameStore().settingsViewStore;

  const theme = useTheme();
  const triggerRef = useRef(0);
  const fullListRef = useRef<IGlb[]>([]);
  const pressedKeys = useRef(new Set<string>());
  const len = herosData.length;
  const carouselRef = useRef<any>();
  const radius = 1.5;
  const angleStep =
    herosData.length > 0 ? (2 * Math.PI) / herosData.length : Math.PI;
  const modelsRef = useRef<Array<Group | null>>([]);

  // Loading state for the scene

  // Control audio playback based on component lifecycle
  useEffect(() => {
    // Play music when component mounts if music is enabled
    if (audioRef && isMusicChecked) {
      audioRef.play().catch(() => {
        // Silently handle autoplay restrictions
        return;
      });
    }

    // Pause music when component unmounts
    return () => {
      if (audioRef) {
        audioRef.pause();
      }
    };
  }, [audioRef, isMusicChecked]);

  useEffect(() => {
    return () => {
      gl.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      triggerRef.current = handleAvatarKeyDown(
        e.code,
        pressedKeys.current,
        triggerRef.current
      );
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      handleAvatarKeyUp(e.code, pressedKeys.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleAvatarKeyDown, handleAvatarKeyUp]);

  useEffect(() => {
    // Clean up logging
    if (herosData.length > 0) {
      getHeroGLTF();

      // Set initial selected avatar if none is selected
      if (selectedIndex === -1) {
        setSelectedIndex(0);
      }
    } else {
      console.warn('No hero data available to load GLTF models');
    }
  }, [herosData]);

  useEffect(() => {
    // Remove this entire logging effect
  }, [heroSelGLTFMap]);

  useEffect(() => {
    const adjustDisplayData = async () => {
      const data = await fetchReqData(fullListRef);
      setAvaSelectisplayData(data ? [...data] : []);
    };

    const heroStyle = {
      fontSize: '3rem',
      fontWeight: 'bold',
      padding: '1.5rem 2.5rem',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '1.2rem',
      color: '#fff',
      textShadow: '0 0.2rem 0.4rem rgba(0, 0, 0, 0.5)',
      boxShadow: '0 0.2rem 1rem rgba(0, 0, 0, 0.3)',
      letterSpacing: '0.1em',
    };

    setAchievement(createHeroAchievement(selectYourHeroLabel, heroStyle, 3.5));
    adjustDisplayData();
  }, [herosData]);

  useEffect(() => {
    triggerRef.current = handleAvatarGesture(gestureKey, triggerRef.current);
  }, [gestureKey]);

  // Reset modelsRef when herosData changes
  useEffect(() => {
    // Initialize the models array with the current heroes length
    modelsRef.current = new Array(herosData.length).fill(null);
  }, [herosData.length]);

  // Add useFrame hook to center the carousel
  useFrame(() => {
    if (carouselRef.current) {
      // Get camera's forward direction
      const cameraDirection = new THREE.Vector3(0, 0, -1);
      cameraDirection.applyQuaternion(camera.quaternion);

      // Position the carousel in front of the camera
      const distance = 5; // Adjust this value to control how far the carousel is from the camera
      carouselRef.current.position
        .copy(camera.position)
        .add(cameraDirection.multiplyScalar(distance));

      // Make carousel face the camera
      carouselRef.current.lookAt(camera.position);
    }
  });

  return (
    <>
      {/* Only render carousel when heroes are available */}
      {showCarousel && (
        <group ref={carouselRef}>
          {/* <Spotlight /> */}
          <HeroCarousel />
        </group>
      )}
      <Plane
        position={[0, -1, 0]}
        args={[len * 3, len * 3, len * 6, len * 6]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.5}
          color={theme.palette.primary.main}
        />
      </Plane>
      <Plane
        position={[0, -2.2, 0]}
        args={[len * 6, len * 6]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial
          transparent
          opacity={0.2}
          color={theme.palette.primary.main}
        />
      </Plane>
    </>
  );
});
