import * as THREE from 'three';

export interface IGameBoxProps {
    width: number;
    height: number;
    depth: number;
    right?: number;
    left?: number;
    top?: number;
    bottom?: number;
    front?: number;
    back?: number;
    gravity?: number;
    zAcceleration?: boolean;
    velocity?: {
      x: number;
      y: number;
      z: number;
    };
    color?:string
    position?: {
        x: number,
        y: number,
        z: number,
      }
      isGravity?: boolean
      isCorrect?: boolean
}

export class GameBox extends THREE.Mesh {
  width: number;
  height: number;
  depth: number;
  right?: number;
  left?: number;
  top?: number;
  bottom?: number;
  front?: number;
  back?: number;
  gravity: number;
  zAcceleration: boolean;
  isCorrect?: boolean;
  velocity: {
    x: number;
    y: number;
    z: number;
  };
  isGravity:boolean;
  gameBoxId?: string;

  constructor({
    width = 0,
    height = 0,
    depth = 0,
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
    isCorrect
  }:IGameBoxProps) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color })
    );
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.isGravity = isGravity
    this.isCorrect = isCorrect

    this.position.set(position.x, position.y, position.z);

    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;

    this.velocity = velocity;
    this.gravity = -0.002;

    this.zAcceleration = zAcceleration;
  }

  updateSides = () => {
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  };
}

