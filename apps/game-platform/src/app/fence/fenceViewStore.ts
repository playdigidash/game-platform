import { IPosition } from '../Common';
import { GameBox } from '../GameBox';
import { RootStore } from '../RootStore/RootStore';

export class FenceViewStore {
  root: RootStore;
  fences: GameBox[] = [];

  constructor(root: RootStore) {
    this.root = root;
  }

  getFenceName = (fenceIdx: number) => {
    let name = '';
    if (fenceIdx === 0) {
      name = 'a';
    } else if (fenceIdx === 1) {
      name = 'b';
    } else if (fenceIdx === 2) {
      name = 'c';
    } else if (fenceIdx === 3) {
      name = 'd';
    }

    return name;
  };

  createFences = (pos: IPosition) => {
    // const arr: GameBox[] = [];

    // this.root.answerViewStore.answers.forEach((answer, idx) => {
    //   const width =
    //     this.root.mainSceneViewStore.ground.width /
    //     this.root.answerViewStore.answers.length;
    //   const left = this.root.mainSceneViewStore.ground.left || 0;
    //   const fence = new GameBox({
    //     width,
    //     height: this.root.mainSceneViewStore.boxHeights.nonPassable,
    //     depth: 0.2,
    //     isGravity: true,
    //     position: {
    //       x: idx === 0 ? left + width / 2 : arr[idx - 1].position.x + width,
    //       y: pos.y || 0,
    //       z: pos.z || 0,
    //     },
    //     velocity: {
    //       x: 0,
    //       y: 0,
    //       z: 0.005,
    //     },
    //     color: answer.color,
    //     zAcceleration: true,
    //     root: this.root,
    //   });

    //   fence.name = this.getFenceName(idx);
    //   fence.isCorrect = answer.isCorrect;
    //   arr.push(fence);
    // });

    // this.fences = arr;
    // return arr;
  };

  cleanupFences = () => {
    this.fences.forEach((fence) => {
      this.root.mainSceneViewStore.scene.remove(fence);
      fence.geometry.dispose();
      //@ts-ignore
      fence.material.dispose();
    });
    this.fences = [];
  }

  checkFenceCollision = () => {
    // this.fences.forEach((fence) => {
    //   if (
    //     this.root.mainSceneViewStore.boxCollision({
    //       box1: this.root.mainSceneViewStore.hero,
    //       box2: fence,
    //     })
    //   ) {
    //     this.root.stageViewStore.handleNextStage();
    //     this.cleanupFences()
    //   }
    // });
  };
}
