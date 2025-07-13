import React, { useRef } from 'react';
import { extend, ReactThreeFiber } from '@react-three/fiber';
import { Box, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const GlowShaderMaterial = shaderMaterial(
  {
    glowColor: new THREE.Color('red'),
  },

  `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
  `,

  `
uniform vec3 glowColor;

varying vec3 vNormal;

void main() {
    // Constant glow intensity
    float intensity = 0.5;

    // Set the glow color and opacity
    vec3 glow = glowColor * intensity;
    gl_FragColor = vec4(glow, intensity);
}
  `
);

extend({ GlowShaderMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      glowShaderMaterial: ReactThreeFiber.ShaderMaterialProps & {
        glowColor?: THREE.Color | string | number;
      };
    }
  }
}

const GlowEffectBox: React.FC<{
  args: { x: number; y: number; z: number };
  glowColor?: string | THREE.Color;
}> = ({ glowColor = 'red', args }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  return (
    <Box args={[args.x, args.y, args.z]}>
      <glowShaderMaterial
        ref={materialRef}
        // glowColor={glowColor}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </Box>
  );
};

export default GlowEffectBox;
