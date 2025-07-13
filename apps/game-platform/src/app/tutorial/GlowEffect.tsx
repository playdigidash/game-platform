import React, { useRef } from 'react';
import { extend, useFrame, ReactThreeFiber } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const CoinGlowShaderMaterial = shaderMaterial(
  {
    time: 0,
    glowColor: new THREE.Color('green'),
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
uniform float time;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
    // Fresnel Effect: Emphasize edges
    float fresnel = abs(dot(vNormal, vViewDir));

    // Create a radial intensity effect
    float radial = length(gl_PointCoord - vec2(0.5)) * 2.0; // Distance from the center
    radial = 1.0 - smoothstep(0.8, 1.0, radial); // Emphasize the edges and fade inwards

    // Combine fresnel and radial for glowing effect
    float intensity = mix(fresnel, radial, 0.5); // Blend effects for a balanced glow

    // Add a subtle pulsating effect
    float pulse = 0.2 + 0.2 * sin(time * 2.0); // Pulsate between 0.1 and 0.2
    intensity += pulse;

    // Set the final glow color and opacity
    vec3 glow = glowColor * intensity;
    gl_FragColor = vec4(glow, intensity);
}

  `
);

extend({ CoinGlowShaderMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      coinGlowShaderMaterial: ReactThreeFiber.ShaderMaterialProps & {
        glowColor?: THREE.Color | string | number;
      };
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      glowShaderMaterial: ReactThreeFiber.ShaderMaterialProps & {
        glowColor?: THREE.Color | string | number;
      };
    }
  }
}

const GlowEffect: React.FC<{ glowColor?: string | THREE.Color }> = ({
  glowColor = 'green',
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms['time'].value = clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={[1.3, 1.3, 1.3]}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <coinGlowShaderMaterial
        ref={materialRef}
        glowColor={glowColor}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};

export default GlowEffect;
