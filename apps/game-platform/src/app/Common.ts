import { Moment } from 'moment';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as TWEEN from '@tweenjs/tween.js';
import axios from 'axios';
import { IDbQuestion, IGameSession, IGlb, environmentConfig } from '@lidvizion/commonlib';
import { keyframes, Theme } from '@mui/material';

export interface IPosition {
  x?: number;
  y?: number;
  z?: number;
}

export enum ObjIdentifier {
  runoff = 'runoffObs',
  hero = 'hero',
}

export interface ISingleQuestionModel {
  question: string;
  answer: string;
  detailPreview: string | null;
  id: string;
  currentEditState: ISliderState;
  initExpandAll?: boolean;
  show?: () => void;
}

export interface IAnswer {
  txt: string;
  color: string;
}

export enum ICurrQType {
  single = 'Single Answer',
  trueFalse = 'True/False',
}

export enum ISliderState {
  archive = 'archive',
  live = 'live',
  draft = 'draft',
}

export enum ModuleSubject {
  math = 'Math',
  science = 'Biology',
  computerScience = 'Computer Science',
  notselected = 'Not Selected',
}

export enum AvatarType {
  default = 'default',
  custom = 'custom',
}

export enum GLBType {
  duck = 'Duck',
  jump = 'Jump',
  dodge = 'Dodge',
  avatar = 'Avatar',
}




export enum IGlbObjectKey {
  duck = 'slideOb',
  jump = 'jumpOb',
  avatar = 'avatarsdsc',
}

export const scaleToUniformSize = (glb: GLTF) => {
  const box = new THREE.Box3().setFromObject(glb.scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  const scale = 2.0 / maxDimension;
  glb.scene.scale.set(scale, scale, scale);
};

export const rotateBy = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

export const getRandomLanePos = (numLanes: number, groundWidth: number) => {
  const randomLane = Math.floor(Math.random() * numLanes);
  const singleLaneWidth = groundWidth / numLanes;
  let xPos = 0;

  if (randomLane === 0) {
    xPos = -singleLaneWidth;
  } else if (randomLane === 2) {
    xPos = singleLaneWidth;
  }

  return xPos;
};

export const checkIsLandscape = () => {
  return window.innerWidth > window.innerHeight;
};

export const positionCamera = (
  target: GLTF,
  controls: OrbitControls,
  camera: THREE.PerspectiveCamera
) => {
  const targetObj = new THREE.Vector3(
    target.scene.position.x,
    target.scene.position.y,
    target.scene.position.z
  );

  if (controls.target) {
    new TWEEN.Tween(controls.target)
      .to(targetObj, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
  }

  const targetPosition = new THREE.Vector3(
    target.scene.position.x + 5,
    target.scene.position.y + 1,
    target.scene.position.z
  );
  new TWEEN.Tween(camera.position)
    .to(targetPosition, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  controls.update();
};

export const getPreSignedUrl = async (fileKey: string) => {
  const awsConfig = environmentConfig.getAwsConfig();
  if (!awsConfig) {
    console.warn('AWS configuration not available. File operations are only available in the cloud version.');
    return null;
  }

  try {
    const preURl = await axios.post(
      `https://${awsConfig.gatewayCode}.execute-api.us-east-1.amazonaws.com/production/get-obj-from-bucket`,
      {
        fileKey,
        bucketName: awsConfig.avatarBucket,
      }
    );

    return preURl;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getModItms = async (avas: IGlb[]) => {
  let dbcalls: any[] = [];
  const loader = new GLTFLoader();
  avas.forEach(async (ava) => {
    dbcalls.push(async () => {
      const url = await getPreSignedUrl(`${ava.objId}.${ava.objExt}`);
      return {
        res: url,
        type: ava.type,
        glbType: ava.glbType,
      };
    });
  });

  const signedUrlArr = await Promise.all(dbcalls.map((fn) => fn()));

  dbcalls = [];
  signedUrlArr.forEach((signedUrl) => {
    if (
      signedUrl?.res?.status === 200 &&
      typeof signedUrl?.res?.data?.body === 'string'
    ) {
      dbcalls.push(async () => {
        const glb = await loader.loadAsync(signedUrl.res.data.body);
        return {
          res: glb,
          type: signedUrl.type,
          glbType: signedUrl.glbType,
        };
      });
    }
  });

  const objs = await Promise.all(dbcalls.map((fn) => fn()));
  return objs;
};

export const defaultModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 250,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
};

export const pulse = (theme: Theme) => {
  return keyframes`
0% { transform: scale(1); color: inherit; }
50% { transform: scale(1.1); color: ${theme.palette.text.secondary}; }
100% { transform: scale(1); color: inherit; }
`;
};

export enum CurrentEndGameStep {
  scoreboard = 'scoreboard',
  leaderboard = 'leaderboard',
  review = 'review',
  signup = 'signup',
}

export enum EndGameQuestTxt {
  complete = 'Restart Quest',
  next = 'Next Dash',
}


