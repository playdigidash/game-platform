import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { useTheme } from '@mui/material/styles';
import * as THREE from 'three';

export function Arrow({ turnAngle, position }: any) {
  const { nodes, materials } = useGLTF(
    '../../assets/models/direction_arrow.glb'
  );
  const modelRef = useRef<any>();
  const theme = useTheme(); // Use the theme hook

  const geo: any = nodes['Arrow_Material001_0'];

  useEffect(() => {
    const material = materials['Material.001'];
    if (material && material instanceof THREE.MeshBasicMaterial) {
      material.color.set(theme.palette.primary.main);
    } else {
      console.warn(
        "Material does not have a color property or is not of type 'MeshStandardMaterial'"
      );
    }
  }, [materials, theme]);

  useEffect(() => {
    if (modelRef && modelRef.current) {
      gsap.fromTo(
        modelRef.current.scale,
        {
          x: 1,
          y: 1,
          z: 1,
        },
        {
          x: 0.8,
          y: 0.8,
          z: 0.8,
          duration: 0.75,
          repeat: -1,
        }
      );
    }
  }, []);

  return (
    <group
      ref={modelRef}
      position={position}
      rotation={[-Math.PI / 2, turnAngle, 0]}
    >
      <group rotation={[-Math.PI / 2, 0, -0.015]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh
            geometry={geo.geometry}
            material={materials['Material.001']}
            position={[11.483, 8.663, 11.398]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('../../assets/models/direction_arrow.glb');
