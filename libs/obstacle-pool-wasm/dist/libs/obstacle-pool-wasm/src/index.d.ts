import * as THREE from 'three';
export declare enum EObstacleModelType {
    dodge = 0,
    jump = 1,
    slide = 2,
    sponsor = 3,
    question = 4,
    hint = 5,
    coin = 6
}
export declare class RustObstaclePool {
    private wasmPool;
    private instanceMap;
    private initialized;
    private instanceCounter;
    private readyPromise;
    constructor();
    private initialize;
    ready(): Promise<void>;
    private convertObstacleType;
    addToPool(threeJSInstance: THREE.Group, type: EObstacleModelType, id: string, isCustom: boolean): void;
    getInstance(type: EObstacleModelType): {
        id: number;
        instance: THREE.Group | null;
    } | null;
    returnToPool(id: number, instance: THREE.Group): boolean;
    updatePosition(id: number, position: THREE.Vector3): boolean;
    updateRotation(id: number, rotation: THREE.Euler): boolean;
    getPoolSize(type: EObstacleModelType): number;
    clearPool(): void;
}
declare const rustObstaclePool: RustObstaclePool;
export { rustObstaclePool };
export default rustObstaclePool;
