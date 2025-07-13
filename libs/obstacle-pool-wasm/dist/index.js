// Import the Rust WASM module
import * as wasmModule from '../pkg/obstacle_pool_wasm.js';
import { ObstaclePool, ObstacleType, js_enum_to_obstacle_type } from '../pkg/obstacle_pool_wasm.js';

// Re-export the ObstacleType enum as EObstacleModelType to match the current codebase
export const EObstacleModelType = {
  dodge: ObstacleType.Dodge,
  jump: ObstacleType.Jump,
  slide: ObstacleType.Slide,
  sponsor: ObstacleType.Sponsor,
  question: ObstacleType.Question,
  hint: ObstacleType.Hint,
  coin: ObstacleType.Coin,
};

// Export the ObstaclePool class as RustObstaclePool
export { ObstaclePool as RustObstaclePool, js_enum_to_obstacle_type };

// Create and initialize the obstacle pool instance
let poolInstance = null;

// Initialize the WASM module and create the pool instance
const initialize = async () => {
  await wasmModule.default();
  poolInstance = new ObstaclePool();
  return poolInstance;
};

// Create a proxy object that will initialize the pool when needed
export const rustObstaclePool = new Proxy(
  {},
  {
    get: (target, prop) => {
      // Handle the 'ready' method specially
      if (prop === 'ready') {
        return initialize;
      }

      // For other methods, ensure the pool is initialized before use
      return function(...args) {
        if (!poolInstance) {
          throw new Error('Obstacle pool not initialized. Call ready() first.');
        }

        return poolInstance[prop](...args);
      };
    },
  }
);

// Re-export everything else from the WASM module
export * from '../pkg/obstacle_pool_wasm.js';
export default wasmModule; 