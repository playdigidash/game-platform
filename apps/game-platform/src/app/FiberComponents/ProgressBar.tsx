import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Html, Text } from '@react-three/drei';
import { useTheme } from '@mui/material';

type ProgressBarProps = {
  duration: number; // Total time for the progress bar to fill (in seconds)
  position?: [number, number, number]; // Position of the progress bar in 3D space
  onComplete?: () => void; // Callback when progress completes
};

export default function ProgressBar({
  duration,
  position = [0, 5, -10], // Default position (above the ground and behind the camera)
  onComplete,
}: ProgressBarProps) {
  const barRef = useRef<any>(null);
  const elapsedTimeRef = useRef(0); // Track elapsed time
  const theme = useTheme();

  useFrame((_, delta) => {
    if (elapsedTimeRef.current < duration) {
      elapsedTimeRef.current += delta; // Increment elapsed time
      const progress = Math.min(elapsedTimeRef.current / duration, 1); // Calculate progress percentage

      if (barRef.current) {
        barRef.current.scale.x = progress * 5; // Dynamically scale width (4 is the total width of the bar)
      }

      if (progress === 1 && onComplete) {
        onComplete(); // Trigger completion callback if provided
      }
    }
  });

  return (
    <group position={position}>
      {/* Background Bar */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[5, 0.4]} />
        <meshBasicMaterial color="gray" />
      </mesh>

      {/* Foreground Progress Bar */}
      <mesh ref={barRef} position={[-2, 0, 0]} scale={[0.001, 1, 1]}>
        <planeGeometry args={[5, 0.4]} />
        <meshBasicMaterial color="limegreen" />
      </mesh>

      {/* Question Mark Indicator */}
      <Box position={[0, 0.5, 0]} scale={5} />

      <Html position={[-1, 0, 1]} scale={5}>
        <div
          style={{
            color: theme.palette.text.primary,
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'Inter, sans-serif',
            transform: 'translate(-50%, -50%)',
            userSelect: 'none',
          }}
        >
          ?
        </div>
      </Html>
    </group>
  );
}
