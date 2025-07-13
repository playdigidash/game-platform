import { makeAutoObservable } from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import * as TWEEN from '@tweenjs/tween.js';

export class MovementViewStore {
  root: RootStore;
  isDucking = false;
  isJumping = false;
  jumpStartTime = 0;
  jumpDuration = 50000; // 600ms for a complete jump (up and down)
  gravity = 9.8; // Standard gravity constant (Rapier uses this by default)

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  // Calculate the required jump force based on obstacle height and game speed
  get jumpHeight() {
    const obstacleHeight =
      this.root.obstacleViewStore?.jumpableObstacleHeight || 0.75;
    const gameSpeed = this.root.gamePlayViewStore?.gameSpeed || 11;

    // We want to jump high enough to clear the obstacle with some margin
    const targetHeight = obstacleHeight * 1.8; // 30% margin above obstacle

    // Physics equation: v = sqrt(2 * g * h)
    // Where v is initial velocity, g is gravity, h is height
    const requiredVelocity = Math.sqrt(2 * this.gravity * targetHeight);

    // Apply game speed factor - higher speed means we need more force
    // because the player is moving forward faster
    const speedFactor = Math.sqrt(gameSpeed / 11); // Normalize to default speed

    const finalJumpHeight = requiredVelocity * speedFactor;
    return finalJumpHeight;
  }

  // Calculate initial jump velocity (for reference, though we use jumpHeight directly)
  get initialJumpVelocity() {
    return this.jumpHeight;
  }

  handlelCameraDuckTween = () => {
    new TWEEN.Tween(this.root.mainSceneViewStore.camera.position)
      .to({ y: 0 }, 500)
      .repeat(1)
      .yoyo(true)
      .start();
  };

  duckMovement = () => {
    // if (this.isDucking || this.root.mainSceneViewStore.hero?.isJumping) {
    //   return;
    // }
    // if (!this.root.mainSceneViewStore.hero?.heroBody?.position) {
    //   return;
    // }
    // const returnToNorm = new TWEEN.Tween(
    //   this.root.mainSceneViewStore.hero.heroBody.position
    // )
    //   .to({ y: this.root.mainSceneViewStore.hero.heroBody.position.y }, 500)
    //   .onStart(() => {
    //     this.isDucking = true;
    //   })
    //   .onComplete(() => {
    //     this.isDucking = false;
    //   });
    // new TWEEN.Tween(this.root.mainSceneViewStore.hero.heroBody.position)
    //   .to(
    //     {
    //       y: 0,
    //     },
    //     500
    //   )
    //   .onStart(() => {
    //     this.isDucking = true;
    //   })
    //   .onComplete(async () => {
    //     await new Promise((resolve) => setTimeout(resolve, 500));
    //     returnToNorm.start();
    //   })
    //   .start();
    // this.handlelCameraDuckTween();
  };
}
