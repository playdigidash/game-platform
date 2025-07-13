import React from 'react';
import { Canvas, Vector3 } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '../RootStore/RootStoreProvider';
import * as THREE from 'three';

interface IStage {
  position: Vector3;
  isCurrent: boolean;
  isNext: boolean;
}

interface IHero {
  position: Vector3;
}

const Stage: React.FC<IStage> = ({ position, isCurrent, isNext }) => {
  const color = isCurrent ? 'green' : isNext ? 'blue' : 'gray';
  const glowColor = isCurrent || isNext ? color : 'transparent';

  return (
    <mesh position={position}>
      <cylinderGeometry args={[1, 1, 0.5, 32]} />
      <meshStandardMaterial color={color} />
      <mesh position={[0, 0.25, 0]}>
        <ringGeometry args={[1.1, 1.3, 32]} />
        <meshBasicMaterial color={glowColor} side={THREE.DoubleSide} />
      </mesh>
    </mesh>
  );
};

const Hero: React.FC<IHero> = ({ position }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export const Quest3dView: React.FC = () => {
  const { selectedHero, partsArr } = useGameStore().gamePlayViewStore;

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      {partsArr.map((part, index) => (
        <Stage
          key={index}
          position={[index * 2, 0, 0]}
          isCurrent={part.isCurrent}
          isNext={part.isNext}
        />
      ))}
      <Hero position={[partsArr.findIndex((p) => p.isCurrent) * 2, 0.75, 0]} />
    </Canvas>
  );
};
