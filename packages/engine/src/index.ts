// Main App Component
export { DigiDashApp, useGameStore } from './DigiDashApp';
export type { DigiDashAppProps } from './DigiDashApp';

// Core Store
export { RootStore } from './store/RootStore';

// Re-export data types for convenience
export type {
  IGameModule,
  IGameDataProvider,
  ITrivia,
  IGameSession,
  IGameSettings,
  IObstacle,
  IAvatar
} from '@digidash/data';

// Data providers
export { LocalStorageDataProvider, JSONFileDataProvider } from '@digidash/data';

// Version
export const VERSION = '1.0.0';
