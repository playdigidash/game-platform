import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { RootStore } from './RootStore/RootStore';
import { Font } from 'three/examples/jsm/loaders/FontLoader';

export interface IGameText {
  root: RootStore;
  text: string;
  gravity?: number;
  zAcceleration?: boolean;
  velocity?: {
    x: number;
    y: number;
    z: number;
  };
  isGravity?: boolean;
  color?: string;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  font: Font;
}

//TODO:create overall object for generic game objects
export class GameText extends THREE.Mesh {
  root: RootStore;
  gravity?: number;
  zAcceleration: boolean;
  velocity: {
    x: number;
    y: number;
    z: number;
  };
  isGravity: boolean;
  text: string;
  font: Font;
  color?: string;

  constructor({
    isGravity = true,
    color = '#00ff00',
    velocity = {
      x: 0,
      y: 0,
      z: 0,
    },
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
    zAcceleration = false,
    text,
    font,
    root,
  }: IGameText) {
    super(
      new TextGeometry(text, {
        font,
        size: 0.5,
        height: 0,
      })
    );

    this.root = root;
    this.isGravity = isGravity;
    this.velocity = velocity;
    this.gravity = -0.002;
    this.text = text;
    this.font = font;
    this.zAcceleration = zAcceleration;
    this.position.set(position.x, position.y, position.z);
  }

  update = ()=> {
    if (this.zAcceleration) {
      this.velocity.z += 0.0003
    }

    this.position.x += this.velocity.x
    this.position.z += this.velocity.z
  }
}
