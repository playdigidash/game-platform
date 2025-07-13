import { RootStore } from '../RootStore/RootStore';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { keyframes } from '@emotion/react';

export const readingProgressBarAnimation = keyframes`
  0% { width: 100%; }
  100% { width: 0%; }
`;

export const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

export const tapAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

export const speedIconAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

export const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const shakeKeyframes = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

export class AnimationViewStore {
  root: RootStore;
  animatedWallConfig = {
    width: 4,
    height: 3,
    depth: 0.3,
    positionX: 0,
    positionY: 1.5,
    positionZ: 0,
    openingDuration: 2.5, // seconds
    openingAngle: Math.PI / 2, // 90 degrees in radians
    easing: 'power2.inOut',
    brickColor: 0xa53e3e,
    mortarColor: 0xd9d9d9,
    brickScale: { x: 0.8, y: 0.3, z: 0.2 },
  };

  wallPivot: THREE.Object3D | null = null;

  constructor(root: RootStore) {
    this.root = root;
  }

  setWallPivot = (wallPivot: THREE.Object3D | null) => {
    this.wallPivot = wallPivot;
  };

  animateWallOpening = () => {
    if (!this.wallPivot) return;
    gsap.to(this.wallPivot?.rotation, {
      y: this.animatedWallConfig.openingAngle,
      duration: this.animatedWallConfig.openingDuration,
      ease: this.animatedWallConfig.easing,
      onComplete: () => {
        console.log('Wall door animation completed');
      },
    });
  };

  createWallPivot = () => {
    const wallPivot = new THREE.Object3D();
    wallPivot.position.set(
      this.animatedWallConfig.positionX - this.animatedWallConfig.width / 2,
      this.animatedWallConfig.positionY - this.animatedWallConfig.height / 2,
      this.animatedWallConfig.positionZ
    );
    return wallPivot;
  };
}
