import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export interface IGenericGameObject {
    gravity?: number;
    zAcceleration?: boolean;
    velocity?: {
      x: number;
      y: number;
      z: number;
    };
    color?:string
    isGravity?: boolean
    gameGeo: THREE.BoxGeometry | TextGeometry
}

export class GenericGameObject extends THREE.Mesh {
    gravity?: number;
    zAcceleration?: boolean;
    velocity?: {
      x: number;
      y: number;
      z: number;
    };
    color?:string
    isGravity?: boolean
    gameGeo: THREE.BoxGeometry | TextGeometry

    constructor({
        gameGeo,
        color
    }:IGenericGameObject){
        super(
            gameGeo,
            new THREE.MeshStandardMaterial({ color })
        )
        this.gameGeo = gameGeo
        this.color = color
    }
}