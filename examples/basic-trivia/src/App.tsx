import React from 'react';
import { DigiDashApp, JSONFileDataProvider } from '@digidash/core';

/**
 * Basic Trivia Example - Shows how to use DigiDash Core
 * This example loads games from static JSON files
 */
export const App: React.FC = () => {
  // Initialize the data provider for JSON files
  const dataProvider = new JSONFileDataProvider('/games/');

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DigiDashApp
        gameId="sustainability-dash"
        dataProvider={dataProvider}
        onGameComplete={(session) => {
          console.log('Game completed!', session);
          alert(`Game completed! Score: ${session.score}`);
        }}
        onError={(error) => {
          console.error('Game error:', error);
          alert('Failed to load game: ' + error.message);
        }}
      />
    </div>
  );
};

export default App;
