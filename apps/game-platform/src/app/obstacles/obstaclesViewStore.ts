import * as THREE from 'three';
import { RootStore } from '../RootStore/RootStore';
import { action, makeAutoObservable, computed, reaction } from 'mobx';
import {
  IGlb,
  ICustomModule,
  IObstacleLayer,
  IObstacleInstance,
  getModItms,
  getPreSignedUrl,
  EObstacleLayerType,
  IObstacleSizeMap,
  IDBObsInstance,
  getCustomAvs,
} from '@lidvizion/commonlib';
import { Vector3 } from 'three';
import { IDirection, ObstacleType } from '@lidvizion/commonlib';
import { AvatarType } from '../Common';
import { MutableRefObject } from 'react';
// Import the Rust WASM object pool and methods
// Import enum from commonlib to maintain compatibility with rest of codebase
import {
  EObstacleModelType,
  EObstaclePlacementOptions,
} from '@lidvizion/commonlib';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { getObstaclePlacementOption } from '../Constants';
import { PostAdd } from '@mui/icons-material';

export class ObstaclesViewStore {
  root: RootStore;
  readonly POOL_SIZE = 4;
  groundY = 0; // Ground level Y position
  zPos = -30;
  jumpableObstacleDepth = 0.25;
  jumpableObstacleHeight = 0.65; // 1.5 times hero height (0.5 * 1.5)
  unjumpableObstacleHeight = this.jumpableObstacleHeight * 1.6;
  obstaclesMap: Record<number, ObstacleType> = {};
  currentHitObstacle: ObstacleType | null = null;
  funFactShownThisQuestion = false;
  obsCounter = 0;
  // Flag to indicate if we're using Rust or JS pooling
  useRustPool = false;
  instancePool: Record<EObstacleModelType, IObstacleInstance[]> = {
    [EObstacleModelType.oneLaneJumpable]: [],
    [EObstacleModelType.oneLaneUnjumpable]: [],
    [EObstacleModelType.twoLaneJumpable]: [],
    [EObstacleModelType.twoLaneUnjumpable]: [],
    [EObstacleModelType.threeLaneJumpable]: [],
    [EObstacleModelType.unavoidable]: [],
    [EObstacleModelType.sponsor]: [],
    [EObstacleModelType.question]: [],
    [EObstacleModelType.hint]: [],
    [EObstacleModelType.coin]: [],
    [EObstacleModelType.tutorial]: [],
  };
  rustPoolInitialized = false;
  private wasmModule: any = null;
  private obstaclePool: any = null;
  private instanceCounter = 0;
  private instanceMap = new Map<number, IObstacleInstance>();
  hasLayerBeenAdded = false;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
    // this.initRustPool();
  }

  get obstaclePlacementOptions(): Record<EObstaclePlacementOptions, Vector3> {
    return {
      leftGround: new Vector3(this.leftLaneCenter, this.groundY, this.zPos),
      middleGround: new Vector3(this.middleLaneCenter, this.groundY, this.zPos),
      rightGround: new Vector3(this.rightLaneCenter, this.groundY, this.zPos),
      leftAir: new Vector3(this.leftLaneCenter, this.airY, this.zPos),
      rightAir: new Vector3(this.rightLaneCenter, this.airY, this.zPos),
      middleAir: new Vector3(this.middleLaneCenter, this.airY, this.zPos),
    };
  }

  get airY() {
    // Position air obstacles just above hero height with small clearance margin
    const clearanceMargin = 0.2; // Small margin for comfortable clearance
    return (
      this.groundY + this.root.gamePlayViewStore.heroHeight + clearanceMargin
    );
  }

  get leftLaneCenter() {
    return -this.root.gameViewStore.laneSize;
  }

  get rightLaneCenter() {
    return this.root.gameViewStore.laneSize;
  }

  get middleLaneCenter() {
    return 0;
  }

  get obstacleSizeMap() {
    const { laneSize } = this.root.gameViewStore;
    return {
      [EObstacleModelType.oneLaneJumpable]: {
        size: new Vector3(
          laneSize * 0.9,
          this.jumpableObstacleHeight,
          this.jumpableObstacleDepth
        ),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
        ],
      },
      [EObstacleModelType.oneLaneUnjumpable]: {
        size: new Vector3(laneSize * 0.9, this.unjumpableObstacleHeight, 1),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
        ],
      },
      [EObstacleModelType.twoLaneJumpable]: {
        size: new Vector3(
          laneSize * 2,
          this.jumpableObstacleHeight,
          this.jumpableObstacleDepth
        ),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
        ],
      },
      [EObstacleModelType.twoLaneUnjumpable]: {
        size: new Vector3(laneSize * 2, this.unjumpableObstacleHeight, 1),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
        ],
      },
      [EObstacleModelType.threeLaneJumpable]: {
        size: new Vector3(
          laneSize * 3,
          this.jumpableObstacleHeight,
          this.jumpableObstacleDepth
        ),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
        ],
      },
      [EObstacleModelType.unavoidable]: {
        size: new Vector3(laneSize * 3, this.unjumpableObstacleHeight, 1),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
        ],
      },
      [EObstacleModelType.sponsor]: {
        size: new Vector3(laneSize * 3, laneSize * 3 * (9 / 16), 1),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
        ],
      },
      [EObstacleModelType.question]: {
        size: new Vector3(laneSize * 3, laneSize * 3, 1),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
        ],
      },
      [EObstacleModelType.hint]: {
        size: new Vector3(2, 2, 2),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftAir],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightAir],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleAir],
        ],
      },
      [EObstacleModelType.coin]: {
        size: new Vector3(0.5, 0.5, 0.5),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
        ],
      },
      [EObstacleModelType.tutorial]: {
        size: new Vector3(
          laneSize * 0.9,
          this.jumpableObstacleHeight,
          this.jumpableObstacleDepth
        ),
        placementOptions: [
          this.obstaclePlacementOptions[EObstaclePlacementOptions.leftGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround],
          this.obstaclePlacementOptions[EObstaclePlacementOptions.rightGround],
        ],
      },
    };
  }

  get hintLayers(): IObstacleLayer[] {
    const pos =
      this.obstaclePlacementOptions[EObstaclePlacementOptions.middleGround];

    return [
      {
        obstacles: [
          {
            position: pos,
            boxArg: this.getSpecifiedObsPos(
              pos,
              this.obstacleSizeMap[EObstacleModelType.hint].size
            ),
            type: EObstacleModelType.hint,
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.hint,
      },
    ];
  }

  get tutorialLayers(): IObstacleLayer[] {
    return [
      {
        obstacles: [
          {
            position: getObstaclePlacementOption(
              this.obstacleSizeMap[EObstacleModelType.tutorial].placementOptions
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.tutorial].size,
            type: EObstacleModelType.tutorial,
            glowColor: 'red',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.tutorial,
      },
      {
        obstacles: [
          {
            position: getObstaclePlacementOption(
              this.obstacleSizeMap[EObstacleModelType.tutorial].placementOptions
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.tutorial].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.tutorial,
      },
      {
        obstacles: [
          {
            position: getObstaclePlacementOption(
              this.obstacleSizeMap[EObstacleModelType.tutorial].placementOptions
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.tutorial].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.tutorial,
      },
      {
        obstacles: [
          {
            position: getObstaclePlacementOption(
              this.obstacleSizeMap[EObstacleModelType.tutorial].placementOptions
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.tutorial].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'green',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.tutorial,
      },
      {
        obstacles: [
          {
            position: getObstaclePlacementOption(
              this.obstacleSizeMap[EObstacleModelType.coin].placementOptions
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.coin].size,
            type: EObstacleModelType.coin,
            glowColor: 'green',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.tutorial,
      },
    ];
  }

  get sponsorLayers(): IObstacleLayer[] {
    return [
      {
        obstacles: [
          {
            position:
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.middleGround
              ],
            boxArg: this.obstacleSizeMap[EObstacleModelType.sponsor].size,
            type: EObstacleModelType.sponsor,
            glowColor: 'green',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.sponsor,
      },
    ];
  }

  get testObstacleLayers(): IObstacleLayer[] {
    return [
      {
        obstacles: [
          {
            position: new Vector3(0, 0, 0),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneUnjumpable].size,
            type: EObstacleModelType.oneLaneUnjumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.regular,
      },
    ];
  }
  get obstacleLayers(): IObstacleLayer[] {
    return [
      {
        obstacles: [
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.leftGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneUnjumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneUnjumpable].size,
            type: EObstacleModelType.oneLaneUnjumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.rightGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneUnjumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneUnjumpable].size,
            type: EObstacleModelType.oneLaneUnjumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.middleGround
              ],
              this.obstacleSizeMap[EObstacleModelType.coin].size
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.coin].size,
            type: EObstacleModelType.coin,
            glowColor: 'green',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.regular,
      },
      {
        obstacles: [
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.leftGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.rightGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          // {
          //   position: this.getSpecifiedObsPos(
          //     this.obstaclePlacementOptions[
          //       EObstaclePlacementOptions.middleGround
          //     ],
          //     this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
          //   ),
          //   boxArg:
          //     this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
          //   type: EObstacleModelType.oneLaneJumpable,
          //   glowColor: 'red',
          //   id: null,
          //   instance: null,
          // },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.middleGround
              ],
              this.obstacleSizeMap[EObstacleModelType.coin].size
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.coin].size,
            type: EObstacleModelType.coin,
            glowColor: 'green',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.regular,
      },
      {
        obstacles: [
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.leftGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.rightGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          // {
          //   position: this.getSpecifiedObsPos(
          //     this.obstaclePlacementOptions[
          //       EObstaclePlacementOptions.middleAir
          //     ],
          //     this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
          //   ),
          //   boxArg:
          //     this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
          //   type: EObstacleModelType.oneLaneJumpable,
          //   glowColor: 'red',
          //   id: null,
          //   instance: null,
          // },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.middleGround
              ],
              this.obstacleSizeMap[EObstacleModelType.coin].size
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.coin].size,
            type: EObstacleModelType.coin,
            glowColor: 'green',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.regular,
      },
      {
        obstacles: [
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.middleGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.rightGround
              ],
              this.obstacleSizeMap[EObstacleModelType.coin].size
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.coin].size,
            type: EObstacleModelType.coin,
            glowColor: 'green',
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.regular,
      },
      {
        obstacles: [
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.leftGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.middleGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.rightGround
              ],
              this.obstacleSizeMap[EObstacleModelType.coin].size
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.coin].size,
            type: EObstacleModelType.coin,
            glowColor: 'green',
            id: null,
            instance: null,
          },
        ],

        layerUsed: false,
        layerType: EObstacleLayerType.regular,
      },
      {
        obstacles: [
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.leftGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.middleGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.rightGround
              ],
              this.obstacleSizeMap[EObstacleModelType.coin].size
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.coin].size,
            type: EObstacleModelType.coin,
            glowColor: 'green',
            id: null,
            instance: null,
          },
        ],

        layerUsed: false,
        layerType: EObstacleLayerType.regular,
      },
      {
        obstacles: [
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.leftGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.middleGround
              ],
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size
            ),
            boxArg:
              this.obstacleSizeMap[EObstacleModelType.oneLaneJumpable].size,
            type: EObstacleModelType.oneLaneJumpable,
            glowColor: 'red',
            id: null,
            instance: null,
          },
          {
            position: this.getSpecifiedObsPos(
              this.obstaclePlacementOptions[
                EObstaclePlacementOptions.rightGround
              ],
              this.obstacleSizeMap[EObstacleModelType.coin].size
            ),
            boxArg: this.obstacleSizeMap[EObstacleModelType.coin].size,
            type: EObstacleModelType.coin,
            glowColor: 'green',
            id: null,
            instance: null,
          },
        ],

        layerUsed: false,
        layerType: EObstacleLayerType.regular,
      },
    ];
  }
  get questionLayers(): IObstacleLayer[] {
    return [
      {
        obstacles: [
          {
            position: new Vector3(0, 0.5, -30),
            boxArg: this.obstacleSizeMap[EObstacleModelType.question].size,
            type: EObstacleModelType.question,
            id: null,
            instance: null,
          },
        ],
        layerUsed: false,
        layerType: EObstacleLayerType.regular,
      },
    ];
  }

  get obstaclesList() {
    return Object.values(this.obstaclesMap);
  }

  get shouldShowFunFact() {
    return !this.funFactShownThisQuestion;
  }

  // Initialize the Rust object pool
  initRustPool = async () => {
    try {
      // Initialize the WASM module
      this.wasmModule = await import(
        '@lidvizion/obstacle-pool-wasm/dist/obstacle_pool_wasm'
      );
      const wasmResponse = await fetch('/wasm/obstacle_pool_wasm_bg.wasm');
      const wasmBinary = await wasmResponse.arrayBuffer();
      await this.wasmModule.initSync(wasmBinary);

      // Create a new instance of the pool
      this.obstaclePool = new this.wasmModule.ObstaclePool();
      this.rustPoolInitialized = true;
    } catch (error) {
      this.useRustPool = false;
    }
  };

  setObsCounter = action((num: number) => {
    this.obsCounter = num;
  });

  setHasLayerBeenAdded = action((bool: boolean) => {
    this.hasLayerBeenAdded = bool;
  });

  setCurrentHitObstacle = action((obstacle: ObstacleType) => {
    this.currentHitObstacle = obstacle;
  });

  setObstacles = action((newMap: Record<number, ObstacleType>) => {
    this.obstaclesMap = newMap;
  });

  setFunFactShownThisQuestion = action((val: boolean) => {
    this.funFactShownThisQuestion = val;
  });

  shouldShowGlowEffect = (type: EObstacleModelType) => {
    return (
      type !== EObstacleModelType.sponsor &&
      type !== EObstacleModelType.question &&
      type !== EObstacleModelType.hint &&
      type !== EObstacleModelType.coin
    );
  };

  getObsPos = (direction: IDirection, laneSize: number): Vector3 => {
    const vector = new Vector3();

    switch (direction) {
      case IDirection.left:
        vector.set(laneSize / 2, 0.5, -30); // Center the wide obstacle between middle and right
        break;
      case IDirection.right:
        vector.set(0, 0.5, -30);
        break; // Obstacle in middle
      case IDirection.hint:
        vector.set(0, 0.5, -30); // Hint box in middle
        break;
      case IDirection.coin:
        vector.set(laneSize, 0.5, -30); // Coin on far right
        break;
      default:
        vector.set(0, 0.5, -30);
        break;
    }

    return vector;
  };

  handleSponsorObstacleHit = action(
    (hitRef: MutableRefObject<boolean>, item: ObstacleType) => {
      item.alreadyUsed = true;

      // Create confetti explosion effect
      this.createConfettiExplosion(item.position);

      // Optional: Add sound effect for the explosion
      // this.root.gamePlayViewStore.playSoundEffect('confetti');
    }
  );

  // New method to create confetti explosion
  createConfettiExplosion = (position: Vector3) => {
    const confettiCount = 100; // Number of confetti particles
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff]; // Rainbow colors

    // Create confetti particles
    for (let i = 0; i < confettiCount; i++) {
      // Create a small geometry for each confetti piece
      const geometry = new THREE.PlaneGeometry(0.1, 0.1);
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide,
      });

      const confetti = new THREE.Mesh(geometry, material);

      // Position confetti at obstacle position
      confetti.position.copy(position);

      // Add random velocity in all directions
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        Math.random() * 5 + 2, // Mostly upward
        (Math.random() - 0.5) * 5
      );

      // Add confetti to scene
      this.root.mainSceneViewStore.scene.add(confetti);

      // Animate the confetti
      const animate = () => {
        // Update position based on velocity
        confetti.position.add(velocity);

        // Apply gravity
        velocity.y -= 0.1;

        // Add some rotation for realism
        confetti.rotation.x += 0.1;
        confetti.rotation.y += 0.08;
        confetti.rotation.z += 0.12;

        // Remove confetti after some time
        if (confetti.position.y < -5) {
          this.root.mainSceneViewStore.scene.remove(confetti);
          return;
        }

        requestAnimationFrame(animate);
      };

      // Start animation
      animate();
    }
  };

  getSpecifiedObsPos = (pos: Vector3, size: Vector3) => {
    // if (pos.y > 0) {
    //   pos.y = this.airY + size.y / 2;
    // } else {
    pos.y = this.jumpableObstacleHeight / 2;
    // }
    return pos;
  };

  handleObstacleHit = action(
    (hitRef: MutableRefObject<boolean>, item: ObstacleType) => {
      this.root.gamePlayViewStore.setHurt(true);
      hitRef.current = true;

      // First show the -50 penalty directly
      this.root.gamePlayViewStore.showObstaclePenalty();

      if (this.shouldShowFunFact) {
        this.root.gamePlayViewStore.showFunFactForObstacle(
          `${item.type}_obstacle`
        );
      }

      this.setCurrentHitObstacle(item);
    }
  );

  getItms = action(async (objIds: string[], isUrl: boolean) => {
    if (!objIds || objIds.length === 0) {
      return [];
    }

    try {
      // Batch query all objects at once instead of individual queries
      const collection = this.root.db.collection('3d_library');

      const allObjData = await collection.find({ objId: { $in: objIds } });

      if (!allObjData || allObjData.length === 0) {
        return [];
      }

      // Transform all objects to IGlb format
      const avatars = allObjData
        .filter((obj) => obj.uid && obj.objExt) // Only include valid objects
        .map((obj) => ({
          objId: obj.objId,
          objExt: obj.objExt,
          type: obj.type || 'custom',
          glbType: obj.glbType || 'standard',
          uid: obj.uid,
          name: obj.name || obj.fName || obj.objId,
          uploadedAt: obj.uploadedAt || new Date().toISOString(),
          lstMod: obj.lstMod || new Date().toISOString(),
        }));

      if (avatars.length === 0) {
        return [];
      }

      // Use the first object's uid as the path (assuming all objects belong to the same user)
      const path = avatars[0].uid;

      if (isUrl) {
        return avatars.map((ava) => ({
          id: ava.objId,
          res: null,
          url: `${path}/${ava.objId}.${ava.objExt}`,
          type: ava.type,
          glbType: ava.glbType,
          uid: ava.uid,
          ext: ava.objExt,
        }));
      } else {
        const loadedModels = await getCustomAvs(avatars, path);
        return loadedModels.filter((model) => model !== null);
      }
    } catch (error) {
      return [];
    }
  });

  // Helper function to convert string enum to numeric value for WASM
  convertToWasmType = (type: EObstacleModelType): number => {
    switch (type) {
      case EObstacleModelType.sponsor:
        return 0; // Sponsor
      case EObstacleModelType.question:
        return 1; // Question
      case EObstacleModelType.hint:
        return 2; // Hint
      case EObstacleModelType.coin:
        return 3; // Coin
      case EObstacleModelType.oneLaneJumpable:
        return 4; // One Lane Jumpable
      case EObstacleModelType.oneLaneUnjumpable:
        return 5; // One Lane Unjumpable
      case EObstacleModelType.twoLaneJumpable:
        return 6; // Two Lane Jumpable
      case EObstacleModelType.twoLaneUnjumpable:
        return 7; // Two Lane Unjumpable
      case EObstacleModelType.threeLaneJumpable:
        return 8; // Three Lane Jumpable
      case EObstacleModelType.unavoidable:
        return 9; // Unavoidable
      case EObstacleModelType.tutorial:
        return 10; // Tutorial
      default:
        return 4; // Default to one lane jumpable
    }
  };

  // Helper function to process obstacle arrays
  private processObstacleArray = async (
    objIds: string[],
    obsType: EObstacleModelType
  ) => {
    if (!objIds || objIds.length === 0) return [];

    try {
      const models = await this.getItms(objIds, false);
      return models.map((model) => ({
        ...model,
        obsType,
        isCustom: true,
      }));
    } catch (error) {
      return [];
    }
  };

  // New method to handle avatar fetching similar to obstacles
  fetchAvatars = async (avatarIds: string[]) => {
    if (!avatarIds || avatarIds.length === 0) {
      return [];
    }

    try {
      const avatarModels = await this.getItms(avatarIds, false);

      // Process avatars into the format expected by GameViewStore
      const processedAvatars = avatarModels.map((model, index) => {
        // Add to heroSelGLTFMap with the correct structure
        this.root.gameViewStore.addModelToMap({
          idx: index,
          model: { scene: model.res, animations: model.animations || [] },
        });

        return {
          ...model,
          objId: model.id, // Ensure objId is available for GamePlayViewStore
          type: 'custom',
          glbType: 'avatar',
        };
      });

      // Set the avatars in the GameViewStore
      this.root.gameViewStore.setAvatars(processedAvatars);

      return processedAvatars;
    } catch (error) {
      return [];
    }
  };

  fetchObstacles = async (data: ICustomModule) => {
    const promises: Promise<any>[] = [];

    // Add built-in obstacles (question, hint, coin)
    promises.push(this.createQuestionObstacle());
    promises.push(this.createHintObstacle());
    promises.push(this.createCoinObstacle());

    // Add custom obstacles from database
    if (data.selectedDodge?.length) {
      promises.push(
        this.processObstacleArray(
          data.selectedDodge,
          EObstacleModelType.oneLaneUnjumpable
        )
      );
    }

    if (data.selectedJump?.length) {
      promises.push(
        this.processObstacleArray(
          data.selectedJump,
          EObstacleModelType.oneLaneJumpable
        )
      );
    }

    // Add sponsor obstacles
    if (data.sponsors?.length) {
      promises.push(this.createSponsorObstacle(data.sponsors[0]));
    }

    try {
      // Wait for all promises to resolve and flatten results
      const results = await Promise.all(promises);
      const validObstacles = results.flat().filter((result) => result !== null);

      // Process obstacles for the pool
      this.processObstaclesForPool(validObstacles);

      return {};
    } catch (error) {
      return {};
    }
  };

  // Helper functions for creating built-in obstacles
  private createQuestionObstacle = async () => {
    try {
      const objLoader = new OBJLoader();
      const questionObj = new THREE.Group();

      const object = await new Promise<THREE.Group>((resolve, reject) => {
        objLoader.load(
          '/assets/questionmark/Question Symbol.obj',
          (obj) => resolve(obj),
          undefined,
          (error) => reject(error)
        );
      });

      // Apply materials (simplified)
      object.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          const materials: Record<string, THREE.MeshStandardMaterial> = {
            'Material.002': new THREE.MeshStandardMaterial({
              color: 0x4caf50,
              metalness: 0.7,
              roughness: 0.2,
            }),
            'Material.001': new THREE.MeshStandardMaterial({
              color: 0xf44336,
              metalness: 0.8,
              roughness: 0.1,
            }),
            Material: new THREE.MeshStandardMaterial({
              color: 0x9e9e9e,
              metalness: 0.4,
              roughness: 0.3,
            }),
          };

          const currentMaterial = node.material as THREE.MeshStandardMaterial;
          if (currentMaterial?.name && materials[currentMaterial.name]) {
            node.material = materials[currentMaterial.name];
          }
        }
      });

      questionObj.add(object);

      // Add basic lighting
      const pointLight = new THREE.PointLight(0xffffff, 2);
      pointLight.position.set(10, 10, 10);

      questionObj.add(new THREE.AmbientLight(0xffffff, 1.5), pointLight);

      return {
        id: 'question_mark',
        res: { scene: questionObj },
        obsType: EObstacleModelType.question,
        isCustom: true,
      };
    } catch (error) {
      return null;
    }
  };

  private createHintObstacle = async () => {
    try {
      const hintObj = new THREE.Group();
      const textureLoader = new THREE.TextureLoader();

      const texture = await new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          '/assets/textures/hint.jpeg',
          resolve,
          undefined,
          reject
        );
      });

      const hintBox = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          opacity: 0.8,
        })
      );

      hintObj.add(hintBox);

      return {
        id: 'hint',
        res: { scene: hintObj },
        obsType: EObstacleModelType.hint,
        isCustom: true,
      };
    } catch (error) {
      return null;
    }
  };

  private createCoinObstacle = async () => {
    try {
      const coinObj = new THREE.Group();
      const coinMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 32, 32),
        new THREE.MeshStandardMaterial({ color: 'gold' })
      );
      coinObj.add(coinMesh);

      return {
        id: 'coin',
        res: { scene: coinObj },
        obsType: EObstacleModelType.coin,
        isCustom: true,
      };
    } catch (error) {
      return null;
    }
  };

  private createSponsorObstacle = async (sponsor: any) => {
    try {
      const sponsorObj = new THREE.Group();

      if (sponsor.imgId) {
        const imageUrl = await getPreSignedUrl(
          `sponsors/${sponsor.imgId}.${sponsor.ext}`
        );
        const textureLoader = new THREE.TextureLoader();

        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(imageUrl.body, resolve, undefined, reject);
        });

        const imageAspect = texture.image
          ? texture.image.width / texture.image.height
          : 1;
        const planeWidth = 4;
        const planeHeight = planeWidth / imageAspect;

        const imagePlane = new THREE.Mesh(
          new THREE.PlaneGeometry(planeWidth, planeHeight),
          new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
          })
        );

        imagePlane.position.set(0, planeHeight / 2, 0);
        sponsorObj.add(imagePlane);
      }

      return {
        id: sponsor.imgId,
        res: { scene: sponsorObj },
        obsType: EObstacleModelType.sponsor,
        isCustom: true,
      };
    } catch (error) {
      return null;
    }
  };

  // Process obstacles for the pool
  private processObstaclesForPool = (validObstacles: any[]) => {
    validObstacles.forEach((obstacle) => {
      const sceneObject = obstacle?.res?.scene || obstacle?.res;

      if (obstacle && sceneObject && sceneObject.type && obstacle.obsType) {
        const obsType = obstacle.obsType as EObstacleModelType;

        for (let i = 0; i < this.getPoolSizeByType(obsType); i++) {
          const instance: IObstacleInstance =
            sceneObject.clone() as IObstacleInstance;
          instance.userData = {
            id: obstacle.id,
            type: obsType,
            isCustom: obstacle.isCustom,
          };
          this.instancePool[obsType].push(instance);
        }
      }
    });
  };

  getPoolSizeByType = (type: EObstacleModelType) => {
    if (type === EObstacleModelType.sponsor) {
      return 1;
    } else if (type === EObstacleModelType.question) {
      return 1;
    } else if (type === EObstacleModelType.hint) {
      return 2;
    } else if (type === EObstacleModelType.coin) {
      return 10;
    } else if (type === EObstacleModelType.tutorial) {
      return 1;
    } else if (type === EObstacleModelType.unavoidable) {
      return 1;
    } else if (type === EObstacleModelType.threeLaneJumpable) {
      return 1;
    } else if (type === EObstacleModelType.twoLaneJumpable) {
      return 1;
    } else if (type === EObstacleModelType.twoLaneUnjumpable) {
      return 1;
    } else if (type === EObstacleModelType.oneLaneJumpable) {
      return 8;
    } else if (type === EObstacleModelType.oneLaneUnjumpable) {
      return 8;
    }
    return this.POOL_SIZE;
  };

  // Helper function to check if instances of a certain type are available in the pool
  // without actually removing one from the pool
  checkInstanceAvailability = (type: EObstacleModelType) => {
    if (
      this.useRustPool &&
      this.rustPoolInitialized &&
      this.wasmModule &&
      this.obstaclePool
    ) {
      try {
        // First check if the method exists in the Rust module
        if (
          typeof this.obstaclePool.check_instance_availability === 'function'
        ) {
          // Use Rust-powered object pool checking method
          return this.obstaclePool.check_instance_availability(
            this.wasmModule.js_enum_to_obstacle_type(
              this.convertToWasmType(type)
            )
          );
        } else {
          // Fallback to checking the pool size
          return (
            this.obstaclePool.get_pool_size(
              this.wasmModule.js_enum_to_obstacle_type(
                this.convertToWasmType(type)
              )
            ) > 0
          );
        }
      } catch (error) {
        return false;
      }
    }
  };

  getObsInstance = (type: EObstacleModelType) => {
    return this.instancePool[type].pop();
  };

  // New method to apply proper scaling to an obstacle instance
  applyScalingToInstance = (
    instance: IObstacleInstance,
    type: EObstacleModelType
  ) => {
    // First reset the scale to get original dimensions
    instance.scale.set(1, 1, 1);

    // Calculate the bounding box to get original size
    const box = new THREE.Box3().setFromObject(instance);
    const size = new THREE.Vector3();
    box.getSize(size);

    const boxArg = this.obstacleSizeMap[type];

    // Only apply scaling if we have valid dimensions
    if (size.x > 0 && size.y > 0 && size.z > 0) {
      // For wide obstacles, ensure height constraint is respected
      // while maintaining proportional scaling for width and depth
      if (boxArg.size.y < boxArg.size.x && boxArg.size.y < boxArg.size.z) {
        // This is likely a wide obstacle with height constraint
        // Find the smallest scale factor that ensures proportional scaling
        // while respecting the height constraint
        const xScale = boxArg.size.x / size.x;
        const yScale = boxArg.size.y / size.y;
        const zScale = boxArg.size.z / size.z;

        // Find the smallest scale to maintain proportions
        const minScale = Math.min(xScale, yScale, zScale);

        // Apply uniform scaling to maintain proportions
        instance.scale.set(minScale, minScale, minScale);
      } else {
        // For other obstacles, maintain proportional scaling based on the largest dimension
        const maxDimension = Math.max(size.x, size.y, size.z);
        const maxTargetDimension = Math.max(
          boxArg.size.x,
          boxArg.size.y,
          boxArg.size.z
        );

        // Calculate the scale factor based on the largest dimension
        const scaleFactor = maxTargetDimension / maxDimension;

        // Apply proportional scaling
        instance.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }
    } else {
      // Fallback to direct scaling if we can't calculate proportions
      instance.scale.set(boxArg.size.x, boxArg.size.y, boxArg.size.z);
    }
  };

  returnToPool = (obstacle: IObstacleInstance, type: EObstacleModelType) => {
    if (!obstacle) return;

    // Use Rust-powered object pool
    // Find the ID from the active obstacles list
    const activeObstacle = this.obstaclesMap[obstacle.id];

    if (activeObstacle) {
      this.instancePool[type].push(obstacle);
      this.instanceMap.delete(obstacle.id);
    }

    // else {
    //   // Fallback to original JavaScript pooling system
    //   if (this.pool[type]) {
    //     // Reset the object's properties
    //     obstacle.position.set(0, 0, 0);
    //     obstacle.rotation.set(0, 0, 0);
    //     obstacle.visible = false;

    //     // Add it back to the pool
    //     this.pool[type].push(obstacle);
    //   }
    // }
  };

  removeObstacle = action(({ item }: { item: ObstacleType }) => {
    if (item.instance?.id) {
      const obstacle = this.obstaclesMap[item.instance.id];
      if (obstacle?.instance) {
        // Return the instance to the pool
        this.returnToPool(obstacle.instance, obstacle.type);

        // Remove the obstacle from the map
        delete this.obstaclesMap[item.instance.id];

        if (obstacle.type === EObstacleModelType.sponsor) {
          this.root.gamePlayViewStore.setIsSponsorLayerOnScreen(false);
          this.root.gamePlayViewStore.setGameSpeed(
            this.root.gamePlayViewStore.gameSpeeds.normal
          );
        }

        if (obstacle.type === EObstacleModelType.question) {
          this.root.questionViewStore.setIsQuestionLayerActive(false);
        }
      }
    }
  });

  // Add public method to check for available instances
  hasAvailableInstances = (type: EObstacleModelType): boolean => {
    if (this.useRustPool && this.rustPoolInitialized && this.obstaclePool) {
      // Check if the pool size for the given type is greater than 0
      return (
        this.obstaclePool.get_pool_size(
          this.wasmModule.js_enum_to_obstacle_type(this.convertToWasmType(type))
        ) > 0
      );
    }
    return false;
  };
}
