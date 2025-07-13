import { Vector3 } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export interface ScoreboardContentProps {
  onNextStep: () => void;
}

export interface ScoreData {
  icon: JSX.Element;
  value: string | number;
  label: string;
  color: string;
}

export interface HeroGLTFData {
  scene: GLTF['scene'];
  animations: GLTF['animations'];
}

export interface HeroModelProps {
  maxSize: number;
  selectedIndex: boolean;
  faceCamera: boolean;
  playAnim: {
    name: string;
    counter: number;
  };
  animations: GLTF['animations'];
  heroScene: GLTF['scene'];
}

export interface CanvasProps {
  style: React.CSSProperties;
  children: React.ReactNode;
}

export interface StyledProps {
  isTutorial?: boolean;
  showExpandIcon?: boolean;
} 