import React, { useEffect, useRef } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import {
  Group,
  Mesh,
  ShaderMaterial,
  AdditiveBlending,
  FrontSide,
  Color,
} from 'three';
import { shaderMaterial } from '@react-three/drei';

const GlowShaderMaterial = shaderMaterial(
  { time: 0, glowColor: new Color('red'), pulseSpeed: 5.0 },

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
  uniform float time;
  uniform vec3 glowColor;
  uniform float pulseSpeed;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = abs(dot(vNormal, vViewDir));
    fresnel = clamp(fresnel, 0.0, 1.0); // Use the full range of fresnel

    // Create a pulsing effect
    float pulse = 1.0 + 1.0 * sin(time * pulseSpeed) + 0.75;
    
    // Increase the base glow size by modifying intensity calculation
    float intensity = pow(1.0 - fresnel, 2.0) * pulse; // Use a lower exponent for a softer glow
    vec3 glow = glowColor * intensity;

    // Optionally, you can add a constant factor to increase the overall glow strength
    glow *= 2.0; // Adjust this value as needed

    gl_FragColor = vec4(glow, min(intensity, 1.0));
}

  `
);

extend({ GlowShaderMaterial });

interface GlowEffectObstacleProps {
  clonedModel: Group;
}

const GlowEffectObstacle: React.FC<GlowEffectObstacleProps> = ({
  clonedModel,
}) => {
  const { clock } = useThree();
  const materialRef = useRef<ShaderMaterial>();

  useEffect(() => {
    clonedModel.traverse((child) => {
      if (child instanceof Mesh) {
        const material = new GlowShaderMaterial();
        material.uniforms['time'].value = clock.getElapsedTime();
        material.transparent = true;
        material.blending = AdditiveBlending;
        material.side = FrontSide;
        child.material = material;
        materialRef.current = material;
      }
    });
  }, [clonedModel, clock]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms['time'].value = clock.getElapsedTime();
    }
  });

  return <primitive object={clonedModel} />;
};

export default GlowEffectObstacle;
