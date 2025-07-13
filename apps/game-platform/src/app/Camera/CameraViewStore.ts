import { action, makeAutoObservable } from 'mobx';
import { Camera, PerspectiveCamera, Vector3 } from 'three';
import { RootStore } from '../RootStore/RootStore';
import { MutableRefObject } from 'react';

export class CameraViewStore {
  root: RootStore;
  fov = 60;
  cameraPositions = {
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
        y: (isMobile: boolean) => (isMobile ? 1.5 : 1.75),
        z: (isMobile: boolean) => (isMobile ? 4 : 5),
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
        y: (isMobile: boolean) => (isMobile ? 14 : 16),
        z: -5,
      },
      focus: {
        x: 0,
        y: 0,
        z: -5, // gameCenter.z
      },
    },
  };

  // We don't store the refs directly, just their values
  cameraObj: PerspectiveCamera | null = null;
  focusObj: Vector3 | null = new Vector3();

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this, {
      cameraObj: false, // Don't make these observable
      focusObj: false, // Don't make these observable
    });
  }

  setCameraRef = action((ref: MutableRefObject<PerspectiveCamera | null>) => {
    // Store just the camera object, not the ref itself
    this.cameraObj = ref.current;
  });

  setCameraFocusRef = action((ref: MutableRefObject<Vector3>) => {
    // Store just the focus object, not the ref itself
    this.focusObj = ref.current;
  });

  getPosBehindPlayer = () => {
    // Implementation can be added later
  };

  moveCameraToPos = action((pos: Vector3) => {
    if (this.cameraObj) {
      this.cameraObj.position.set(pos.x, pos.y, pos.z);
    }
  });

  lookAt = action(() => {
    if (this.cameraObj && this.focusObj) {
      this.cameraObj.lookAt(this.focusObj);
    }
  });
}
