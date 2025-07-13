import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { observer } from 'mobx-react';
import { IGameDataProvider, IGameModule } from '@digidash/data';
import { RootStore } from './store/RootStore';
import { defaultTheme } from './theme/defaultTheme';

// Context for the data provider and store
const GameStoreContext = createContext<RootStore | null>(null);

export const useGameStore = (): RootStore => {
  const store = useContext(GameStoreContext);
  if (!store) {
    throw new Error('useGameStore must be used within a DigiDashApp');
  }
  return store;
};

// Props for the main app
export interface DigiDashAppProps {
  gameData?: IGameModule;
  gameId?: string;
  dataProvider: IGameDataProvider;
  theme?: any;
  onGameComplete?: (session: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Main DigiDash App Component - Open Source Version
 * Simplified without MongoDB/AWS dependencies
 */
export const DigiDashApp: React.FC<DigiDashAppProps> = observer(({
  gameData,
  gameId,
  dataProvider,
  theme = defaultTheme,
  onGameComplete,
  onError
}) => {
  const [store] = useState(() => new RootStore(dataProvider));
  const [currentGame, setCurrentGame] = useState<IGameModule | null>(gameData || null);
  const [loading, setLoading] = useState(!gameData && !!gameId);
  const [error, setError] = useState<string | null>(null);

  // Load game data if gameId is provided but gameData is not
  useEffect(() => {
    const loadGame = async () => {
      if (gameId && !gameData) {
        try {
          setLoading(true);
          const game = await store.loadGame(gameId);
          setCurrentGame(game);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load game';
          setError(errorMessage);
          onError?.(new Error(errorMessage));
        } finally {
          setLoading(false);
        }
      }
    };

    loadGame();
  }, [gameId, gameData, store, onError]);

  // Initialize game when data is available
  useEffect(() => {
    if (currentGame) {
      store.gameViewStore.setSettings(currentGame);
      store.gameViewStore.setQuestionsData(currentGame.trivia || []);

      // Initialize game session
      store.createSession(currentGame.moduleId).then(session => {
        store.gameViewStore.setGameSession(session);
      });
    }
  }, [currentGame, store]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        Loading game...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        color: '#ff4444'
      }}>
        <h2>Error Loading Game</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        No game data provided
      </div>
    );
  }

  return (
    <GameStoreContext.Provider value={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {/* 3D Game Canvas */}
            <Canvas
              camera={{
                position: [0, 2, 5],
                fov: 75
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1
              }}
            >
              <Physics gravity={[0, -9.82, 0]}>
                <GameScene />
              </Physics>
            </Canvas>

            {/* UI Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 2,
              pointerEvents: 'none'
            }}>
              <GameUI />
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </GameStoreContext.Provider>
  );
});

// 3D Scene Component
const GameScene: React.FC = observer(() => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Game components will go here */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  );
});

// UI Overlay Component
const GameUI: React.FC = observer(() => {
  const store = useGameStore();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      pointerEvents: 'auto'
    }}>
      {/* Top HUD */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        color: 'white',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)'
      }}>
        <div>Score: {store.scoreViewStore.score}</div>
        <div>{store.gameViewStore.settings.gTitle}</div>
        <div>Questions: {store.scoreViewStore.questionsAnswered}</div>
      </div>

      {/* Question overlay (when active) */}
      {store.questionViewStore.showQuestion && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '80%',
          textAlign: 'center'
        }}>
          <QuestionDisplay />
        </div>
      )}
    </div>
  );
});

// Question Display Component
const QuestionDisplay: React.FC = observer(() => {
  const store = useGameStore();
  const question = store.questionViewStore.currentQuestion;

  if (!question) return null;

  return (
    <div>
      <h3>{question.question}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => store.questionViewStore.selectAnswer(index)}
            style={{
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              background: '#4CAF50',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
});

export default DigiDashApp;
