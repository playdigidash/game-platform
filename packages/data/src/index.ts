// Core interfaces
export * from './interfaces/IGameDataProvider';

// Data providers
export { LocalStorageDataProvider } from './providers/LocalStorageDataProvider';
export { JSONFileDataProvider } from './providers/JSONFileDataProvider';

// Version
export const VERSION = '1.0.0';
