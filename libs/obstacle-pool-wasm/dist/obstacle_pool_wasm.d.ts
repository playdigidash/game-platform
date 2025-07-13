/* tslint:disable */
/* eslint-disable */
export function js_enum_to_obstacle_type(value: number): ObstacleType;
export function start(): void;
export enum ObstacleType {
  Dodge = 0,
  Jump = 1,
  Slide = 2,
  Sponsor = 3,
  Question = 4,
  Hint = 5,
  Coin = 6,
}
export class ObstaclePool {
  free(): void;
  constructor();
  add_to_pool(type_value: ObstacleType, instance_ref: number, id: string, is_custom: boolean): void;
  get_instance(type_value: ObstacleType): any;
  return_to_pool(id: number): boolean;
  update_position(id: number, x: number, y: number, z: number): boolean;
  update_rotation(id: number, x: number, y: number, z: number): boolean;
  get_active_obstacles(): any;
  get_pool_size(type_value: ObstacleType): number;
  clear_pool(): void;
  get_obstacle_by_id(id: number): any;
}
export class Vector3 {
  free(): void;
  constructor(x: number, y: number, z: number);
  set(x: number, y: number, z: number): void;
  x: number;
  y: number;
  z: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_vector3_free: (a: number, b: number) => void;
  readonly __wbg_get_vector3_x: (a: number) => number;
  readonly __wbg_set_vector3_x: (a: number, b: number) => void;
  readonly __wbg_get_vector3_y: (a: number) => number;
  readonly __wbg_set_vector3_y: (a: number, b: number) => void;
  readonly __wbg_get_vector3_z: (a: number) => number;
  readonly __wbg_set_vector3_z: (a: number, b: number) => void;
  readonly vector3_new: (a: number, b: number, c: number) => number;
  readonly vector3_set: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_obstaclepool_free: (a: number, b: number) => void;
  readonly obstaclepool_new: () => number;
  readonly obstaclepool_add_to_pool: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly obstaclepool_get_instance: (a: number, b: number) => any;
  readonly obstaclepool_return_to_pool: (a: number, b: number) => number;
  readonly obstaclepool_update_position: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly obstaclepool_update_rotation: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly obstaclepool_get_active_obstacles: (a: number) => any;
  readonly obstaclepool_get_pool_size: (a: number, b: number) => number;
  readonly obstaclepool_clear_pool: (a: number) => void;
  readonly obstaclepool_get_obstacle_by_id: (a: number, b: number) => any;
  readonly js_enum_to_obstacle_type: (a: number) => number;
  readonly start: () => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
