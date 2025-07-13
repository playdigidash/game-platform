import { observer } from 'mobx-react';
import { useRef, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useThree, useFrame } from '@react-three/fiber';
import { Html, Text, Plane } from '@react-three/drei';
import gsap from 'gsap';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { Box } from '@mui/material';

interface TutorialProgressIndicatorProps {
  currentStep: number;
}

export const TutorialProgressIndicator = observer(({ currentStep }: TutorialProgressIndicatorProps) => {
  const theme = useTheme();
  const { scene, gl } = useThree();
  const progressRef = useRef<THREE.Mesh>(null);
  const progressTarget = useRef({ progress: 0 });
  const hintRef = useRef<THREE.Group>(null);
  const { isMobile, collectedHints } = useGameStore().gamePlayViewStore;

  // Calculate progress percentage
  const progress = (currentStep / 6) * 100; // 6 total tutorial steps

  useEffect(() => {
    return () => {
      gl.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressTarget.current, {
        progress: progress,
        duration: 1.5,
        ease: 'power2.out',
      });
    }
  }, [progress]);

  // Check if hint is collected
  const isHintCollected = () => {
    if (!collectedHints || !Array.isArray(collectedHints)) return false;
    return collectedHints.some(hint => hint.id === 'tutorial-hint-1');
  };

  useFrame(() => {
    if (progressRef.current) {
      const currentProgress = progressTarget.current.progress;
      progressRef.current.position.x = -1 + currentProgress / 100;
      progressRef.current.scale.x = currentProgress / 50;
    }
  });

  return (
    <group position={[0, isMobile ? 8.3 : 7.8, -5]} scale={1.35}>
      {/* Background bar */}
      <mesh position={[0, 0, -4]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2, 0.2]} />
        <meshBasicMaterial color={theme.palette.background.paper} />
      </mesh>

      {/* Progress bar with animation */}
      <mesh
        ref={progressRef}
        position={[-1, 0, -4]}
        rotation={[0, 0, 0]}
        scale={[0, 0.2, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={theme.palette.primary.main} />
      </mesh>

      {/* Single hint indicator */}
      <group
        ref={hintRef}
        position={[0, -0.35, -4]} // Centered position
      >
        <Html position={[0, 0, -0.1]} center transform scale={0.6}>
          <div>
            <Box
              component="div"
              style={{
                fontSize: '1rem',
                backgroundColor: isHintCollected()
                  ? theme.palette.primary.main
                  : theme.palette.primary.main,
                borderRadius: '0.5em',
                padding: '0.1em 0.3em',
                boxShadow: `0 0 0.1em 0.1em ${
                  isHintCollected()
                    ? theme.palette.primary.main
                    : theme.palette.primary.main
                }`,
              }}
            >
              H
            </Box>
          </div>
        </Html>
      </group>

      {/* Question indicator */}
      <group position={[1.2, 0, -4]}>
        <Plane args={[0.4, 0.4]} position={[0, 0, -0.1]}>
          <meshBasicMaterial transparent opacity={0.5} color="black" />
        </Plane>
        <Text
          scale={0.4}
          color={theme.palette.primary.main}
          anchorX="center"
          anchorY="middle"
        >
          ?
        </Text>
      </group>
    </group>
  );
}); 