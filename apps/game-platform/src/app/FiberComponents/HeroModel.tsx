import React, { useEffect, useRef } from 'react';
import { useAnimations } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, Vector3 } from 'three';
import { Group } from 'three';
import { useGameStore } from '../RootStore/RootStoreProvider';

interface IHeroModelProps {
  maxSize?: number;
  horizontalPosition?: number;
  selectedIndex?: boolean;
  faceCamera?: boolean;
  customRotationY?: number;
  playAnim?: { name: AVA_ANIM; counter: number };
  animations: any[];
  heroScene: any;
}

export enum AVA_ANIM {
  SELECTED = 'victory',
  IDLE = 'idle',
  RUN = 'run',
  RUN_LEFT = 'runleft',
  RUN_RIGHT = 'runright',
  JUMP = 'jump',
}

export const HeroModel: React.FC<IHeroModelProps> = ({
  maxSize = 1,
  horizontalPosition = 0,
  selectedIndex = true,
  faceCamera = false,
  customRotationY,
  playAnim = { name: AVA_ANIM.IDLE, counter: 0 },
  animations = [],
  heroScene,
}) => {
  // Remove verbose logging for normal operation
  const { scene, gl } = useThree();
  const { setHeroHeight } = useGameStore().gamePlayViewStore;
  const { actions, mixer } = useAnimations(
    animations || [],
    heroScene || new Group()
  );

  // Setup shadow properties
  useEffect(() => {
    if (!heroScene) {
      return;
    }

    heroScene.traverse((child: any) => {
      if (child && (child.isMesh || child.isSkinnedMesh)) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [heroScene]);

  // Cleanup GL resources
  useEffect(() => {
    return () => {
      gl.dispose();
    };
  }, [gl, scene]);

  // Scale the model to fit maxSize
  useEffect(() => {
    if (!heroScene) {
      return;
    }

    try {
      const clonedScene = heroScene.clone();
      clonedScene.scale.set(1, 1, 1);

      const box = new Box3().setFromObject(clonedScene);
      const size = new Vector3();
      box.getSize(size);

      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = maxDimension > 0 ? maxSize / maxDimension : 1;

      // Apply scale to the original scene

      heroScene.scale.set(scale, scale, scale);
      setHeroHeight(heroScene.scale.y);
    } catch (error) {
      console.error('Error scaling model:', error);
    }
  }, [heroScene, maxSize]);

  // // Update position when props change
  useEffect(() => {
    const animationsArray = animations || [];

    const newPosition: [number, number, number] = [
      horizontalPosition,
      selectedIndex ? (animationsArray.length > 0 ? 0.2 : 0.7) : 2,
      0,
    ];

    heroScene.position.set(newPosition[0], newPosition[1], newPosition[2]);
  }, [animations, heroScene.position, horizontalPosition, selectedIndex]);

  // Update rotation when props change
  useEffect(() => {
    let yRotation = 0;

    if (customRotationY) {
      yRotation = customRotationY;
    } else if (faceCamera) {
      if (animations.length > 0) {
        yRotation = selectedIndex ? -Math.PI / 2 : Math.PI / 2;
      } else {
        yRotation = Math.PI;
      }
    } else if (!faceCamera) {
      yRotation = Math.PI;
    }

    heroScene.rotation.set(0, yRotation, 0);
  }, [
    faceCamera,
    customRotationY,
    selectedIndex,
    animations,
    heroScene?.rotation,
  ]);

  // Handle animations
  useEffect(() => {
    const animationsArray = animations || [];
    const animActions = actions || {};

    if (!animActions || animationsArray.length === 0 || !playAnim) {
      return;
    }

    try {
      // Stop all animations
      Object.values(animActions).forEach((action: any) => {
        if (action && typeof action.stop === 'function') {
          action.stop();
        }
      });

      if (animActions[playAnim.name]) {
        const action = animActions[playAnim.name];
        if (action && typeof action.play === 'function') {
          action.play();
        }
      } else if (Object.keys(animActions).length > 0) {
        // Try to play any available animation as fallback
        const availableAnimations = Object.keys(animActions);
        const action = animActions[availableAnimations[0]];
        if (action && typeof action.play === 'function') {
          action.play();
        }
      }
    } catch (error) {
      console.error('Error setting up animations:', error);
    }
  }, [actions, animations, playAnim]);

  // Update the animation mixer
  useFrame((state) => {
    if (mixer) {
      mixer.update(state.clock.getDelta());
    }
  });

  return heroScene && <primitive object={heroScene} />;
};
