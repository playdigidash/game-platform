import { Canvas } from '@react-three/fiber';
import { observer } from 'mobx-react';
import Ground from '../FiberComponents/Ground';
import { Physics } from '@react-three/rapier';
import { Suspense, useEffect } from 'react';
import { Base } from '../FiberComponents/Base';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { OrbitControls } from '@react-three/drei';
import { ObstacleItem } from './ObstacleItem';
import { Vector3 } from 'three';

export const ObstacleTest = observer(() => {
  const { cameraSlider, laneSelected, setTestMode } =
    useGameStore().gamePlayViewStore;
  const { groundWidth } = useGameStore().gameViewStore;
  const { obstacleLayers } = useGameStore().obstacleViewStore;

  useEffect(() => {
    setTestMode(true);
  }, []);

  return (
    <Canvas
      shadows
      className="main-game-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        width: '100%',
        height: '100%',
        touchAction: 'none', // Disable browser handling of all touch gestures
      }}
    >
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Base heroCount={0} cameraSlider={cameraSlider} />
      <Suspense>
        <Physics>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Ground position={new Vector3(0, -0, -13)} />
          <mesh position={[0, 0.3, -3]}>
            <boxGeometry args={[groundWidth / 3, 0.5, 0.25]} />
            <meshStandardMaterial color="red" />
          </mesh>
          {/* <ObstacleItem item={obstacleLayers[0].obstacles[0]} /> */}
        </Physics>
      </Suspense>
    </Canvas>
  );
});
