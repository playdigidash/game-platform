// Import the Rust WASM module types
import * as wasmModule from '../pkg/obstacle_pool_wasm';
import { ObstaclePool, ObstacleType } from '../pkg/obstacle_pool_wasm';

// Define the EObstacleModelType object
export const EObstacleModelType: {
  dodge: number;
  jump: number;
  slide: number;
  sponsor: number;
  question: number;
  hint: number;
  coin: number;
};

// Export the ObstaclePool class as RustObstaclePool
export {
  ObstaclePool as RustObstaclePool,
  js_enum_to_obstacle_type,
} from '../pkg/obstacle_pool_wasm';

// Define the rustObstaclePool object
export const rustObstaclePool: ObstaclePool & {
  ready: () => Promise<ObstaclePool>;
};

// Re-export everything else from the WASM module
export * from '../pkg/obstacle_pool_wasm';
export default wasmModule;
