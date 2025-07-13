import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

export function Droid() {
  const modelRef = useRef<any>();
  const { nodes, materials } = useGLTF('../../assets/models/droid.glb') as any;

  return (
    <group ref={modelRef}>
      <group
        position={[0, 0.8, 0]}
        scale={0.8}
        rotation={[0.008, Math.PI, -0.02]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube037.geometry}
          material={materials.Grey}
          position={[0.281, -0.555, -0.253]}
          rotation={[0, 1.571, 0]}
          scale={[0.225, 0.225, 0.137]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube039.geometry}
          material={materials.Grey}
          position={[0.281, -0.525, -0.63]}
          rotation={[0, 1.571, 0]}
          scale={[0.603, 0.603, 0.34]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube040.geometry}
          material={materials.Yellow}
          position={[-0.001, -0.588, -0.034]}
          scale={[0.12, 0.109, 0.331]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube041.geometry}
          material={materials.Blue}
          position={[0, 0.005, 0]}
          scale={[0.374, 0.304, 0.374]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube042.geometry}
          material={materials.Yellow}
          position={[-0.001, 0.005, -0.034]}
          scale={[0.374, 0.304, 0.374]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube043.geometry}
          material={materials.Yellow}
          position={[-0.001, 0.005, -0.034]}
          scale={[0.374, 0.304, 0.374]}
        />
        <group
          position={[0.281, -0.604, 0.168]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          scale={0.603}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder014_1.geometry}
            material={materials.White}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder014_2.geometry}
            material={materials.Black}
          />
        </group>
        <group
          position={[0.281, -0.554, -0.248]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          scale={[0.74, 0.603, 0.74]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder014_1.geometry}
            material={materials.White}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder014_2.geometry}
            material={materials.Black}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder014.geometry}
          material={materials.White}
          position={[-0.001, 0.005, 0.425]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.163}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder015.geometry}
          material={materials.Black}
          position={[-0.001, 0.005, 0.425]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.163}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder016.geometry}
          material={materials.Blue}
          position={[-0.012, -1.175, -0.452]}
          scale={0.603}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder017.geometry}
          material={materials.White}
          position={[-0.226, 0.183, 0.346]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.014}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder018.geometry}
          material={materials.Yellow}
          position={[-0.001, 0.41, -0.034]}
          scale={0.603}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder019.geometry}
          material={materials.White}
          position={[-0.486, 0.092, -0.155]}
          rotation={[Math.PI / 2, 0, 1.583]}
          scale={0.014}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder020.geometry}
          material={materials.Blue}
          position={[-0.012, -1.175, -0.372]}
          scale={0.603}
        />
      </group>
    </group>
  );
}

useGLTF.preload('../../assets/models/droid.glb');
