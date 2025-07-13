import { Canvas, useThree } from '@react-three/fiber';
import { observer } from 'mobx-react';
import { Suspense, useEffect } from 'react';
import { Trophy } from './Trophy';

interface ITrophyCanvas {
  modelPath: string;
  scale: number[];
}

export const TrophyCanvas: React.FC<ITrophyCanvas> = observer(
  ({ modelPath, scale }) => {
    return (
      <Canvas
        style={{ width: '4rem', height: '4rem', padding: 0 }}
        camera={{ position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          intensity={1.5}
          angle={0.3}
          penumbra={1}
          position={[0, 5, 5]}
          castShadow
        />
        <directionalLight intensity={2} position={[-2, -2, 5]} />
        <Suspense fallback={null}>
          <Trophy modelPath={modelPath} scale={scale} />
        </Suspense>
      </Canvas>
    );
  }
);
