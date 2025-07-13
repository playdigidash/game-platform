import * as CANNON from 'cannon-es';
import { RootStore } from '../RootStore/RootStore';
import * as THREE from 'three';
import { init } from 'i18next';
import { makeAutoObservable, action, reaction } from 'mobx';
import { Vector3 } from 'three';
import { ScoreAdditions } from '../endgame/score/scoreViewStore';
import { ObstacleType } from '@lidvizion/commonlib';
import gsap from 'gsap';

export interface CollectableType {
  id: number;
  position: Vector3;
}

export enum ECollectableType {
  coin = 'coin',
}

export class CollectableViewStore {
  root: RootStore;
  collectables: CANNON.Body[] = [];
  coinCnt = 0;
  totalCnt = 0;
  scoreFlash = false;
  private audioRef: HTMLAudioElement | null = null;
  private targetPositionRef = { current: new Vector3() };

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
    this.initializeAudio();

    reaction(
      () => this.root.settingsViewStore.isSoundEffectsChecked,
      () => {
        if (this.root.settingsViewStore.isSoundEffectsChecked) {
          this.initializeAudio();
        } else {
          this.cleanupAudio();
        }
      }
    );
  }

  initializeAudio = action(() => {
    if (this.root.settingsViewStore.isSoundEffectsChecked) {
      this.audioRef = new Audio('/assets/audio/soundeffects/Coin.wav');
      if (this.audioRef) {
        this.audioRef.volume = 0.5;
      }
    }
  });

  cleanupAudio = action(() => {
    if (this.audioRef) {
      this.audioRef.pause();
      this.audioRef = null;
    }
  });

  playHintSound = action(() => {
    if (this.root.settingsViewStore.isSoundEffectsChecked) {
      const soundEffect = new Audio('/assets/audio/soundeffects/hint.wav');
      soundEffect.volume = 0.5;
      return soundEffect.play();
    }
    return Promise.resolve();
  });

  playCoinSound = action(() => {
    try {
      if (this.audioRef && this.root.settingsViewStore.isSoundEffectsChecked) {
        this.audioRef.currentTime = 0;
        return this.audioRef.play();
      }
      return Promise.resolve();
    } catch (error) {
      // Ignore any audio play errors
      return Promise.resolve();
    }
  });

  setScoreFlash = action((bool: boolean) => {
    this.scoreFlash = bool;
  });

  addCollectedHint = action((itm: ObstacleType) => {
    this.playHintSound();
    this.root.obstacleViewStore.removeObstacle({ item: itm });
  });

  addCollectedCoin = action((itm: ObstacleType) => {
    this.playCoinSound();
    this.root.obstacleViewStore.removeObstacle({ item: itm });
    // this.coinCollectionAnimation(itm);
    this.coinCnt += 1;
    this.root.scoreViewStore.addCoinScore(1);
    this.triggerScoreFlash();
    this.showCoinReward();
  });

  triggerScoreFlash = action(() => {
    this.scoreFlash = true;
    setTimeout(() => {
      this.setScoreFlash(false);
    }, 850); // FLASH DURATION 500ms
  });

  resetCollectables = action(() => {
    this.collectables.forEach((collectable) => {
      if (collectable instanceof THREE.Object3D) {
        this.root.mainSceneViewStore.scene.remove(collectable);
      }
    });
    this.collectables = [];
    this.coinCnt = 0;
  });

  resetCoins = action(() => {
    this.totalCnt = 0;
    this.coinCnt = 0;
    this.setScoreFlash(false);
  });

  showCoinReward = action(() => {
    this.root.gamePlayViewStore.createCoinAchievement('+100');

    this.root.scoreViewStore.addScore(ScoreAdditions.coinCollected);
  });

  coinCollectionAnimation = (itm: ObstacleType) => {
    const topLeftCorner = new Vector3(-50, 30, 0).unproject(
      this.root.mainSceneViewStore.camera
    );
    // Preserve the depth
    topLeftCorner.z = itm.position.z;
    this.targetPositionRef.current = topLeftCorner;

    // Create a temporary object to animate
    const tempObject = new THREE.Object3D();
    tempObject.position.copy(itm.position);
    this.root.mainSceneViewStore.scene.add(tempObject);

    // Animate the coin to the top left corner
    gsap.to(tempObject.position, {
      x: topLeftCorner.x,
      y: topLeftCorner.y,
      z: topLeftCorner.z,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        // Remove the temporary object after animation
        this.root.mainSceneViewStore.scene.remove(tempObject);
      },
    });
  };
}
