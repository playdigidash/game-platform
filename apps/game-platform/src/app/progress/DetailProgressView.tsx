import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { Box } from '@mui/material';
import Quiz from '@mui/icons-material/Quiz';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react';
import { gsap } from 'gsap';

interface DetailProgressViewProps {
  progress: number;
  questionCounter: number;
  settings: any;
  hintCounter: number;
}

export const DetailProgressView = observer(({
  progress,
  questionCounter,
  settings,
  hintCounter,
}: DetailProgressViewProps) => {
  const progressRef = useRef<any>();
  const progressTarget = useRef({ progress: 0 });
  const containerRef = useRef<any>();
  const { isMobile } = useGameStore().gamePlayViewStore;

  // Animate progress changes
  useEffect(() => {
    gsap.to(progressTarget.current, {
      progress: progress,
      duration: 0.5,
      ease: "power2.out"
    });
  }, [progress]);

  // Zoom in animation from overview
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.scale,
        { x: 0.3, y: 0.3, z: 0.3 },
        {
          x: 1, y: 1, z: 1,
          duration: 0.8,
          ease: "power2.out"
        }
      );
    }
  }, []);



  useFrame(() => {
    if (progressRef.current) {
      const currentProgress = Math.min(Math.max(progressTarget.current.progress, 0), 100); // Clamp between 0-100
      const progressScale = currentProgress / 100; // Convert to 0-1 scale
      
      progressRef.current.scale.x = progressScale;
      progressRef.current.position.x = -(1 - progressScale);
    }
  });



  return (
    <group 
      ref={containerRef}
      position={[0, isMobile ? 8.3 : 7.8, -5]} 
      scale={1.35}
    >
      {/* Progress bar container - same dimensions as View 1 */}
      <group position={[0, 0, -4]}>
        {/* Background bar */}
        <RoundedBox args={[2, 0.2, 0.05]} radius={0.05} smoothness={4}>
          <meshBasicMaterial color="#333333" transparent opacity={0.8} />
        </RoundedBox>
        
        {/* Progress fill */}
        <RoundedBox 
          ref={progressRef}
          args={[2, 0.2, 0.06]} 
          radius={0.05} 
          smoothness={4}
        >
          <meshBasicMaterial color="#9c27b0" />
        </RoundedBox>
      </group>

      {/* Quiz icon at the end */}
      <Html position={[1.3, 0, -4]} center transform scale={0.8}>
        <Box
          component="div"
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9c27b0',
          }}
        >
          <Quiz sx={{ fontSize: 28 }} />
        </Box>
      </Html>
    </group>
  );
}); 