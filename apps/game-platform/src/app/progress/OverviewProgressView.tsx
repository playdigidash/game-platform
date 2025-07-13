import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html, Text, Plane, RoundedBox } from '@react-three/drei';
import { useTheme, Box } from '@mui/material';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react';
import { gsap } from 'gsap';
import { useTexture } from '@react-three/drei';
import flag from '../../assets/textures/flag.svg';
import CheckIcon from '@mui/icons-material/Check';

interface OverviewProgressViewProps {
  progress: number;
  questionCounter: number;
  settings: any;
}

export const OverviewProgressView: React.FC<OverviewProgressViewProps> =
  observer(({ progress, questionCounter, settings }) => {
    const theme = useTheme();
    const { scene, gl } = useThree();
    const flagTexture = useTexture(flag);
    const { isMobile, questionMode } = useGameStore().gamePlayViewStore;
    const { questionsData, gameSession } = useGameStore().gameViewStore;

    const groupRef = useRef<THREE.Group>(null);
    const bubbleRefs = useRef<(THREE.Group | null)[]>([]);

    // Calculate questions for current part
    const totalQuestions = questionsData.length;
    const questionsInCurrentPart = totalQuestions; // For now, assume all questions are in current part

    useEffect(() => {
      return () => {
        gl.dispose();
      };
    }, [gl, scene]);

    // Animation on mount
    useEffect(() => {
      if (groupRef.current) {
        // Start with scale 0 and animate in
        gsap.fromTo(
          groupRef.current.scale,
          { x: 0, y: 0, z: 0 },
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
          }
        );

        // Animate individual bubbles with stagger
        bubbleRefs.current.forEach((bubble, index) => {
          if (bubble) {
            gsap.fromTo(
              bubble.scale,
              { x: 0, y: 0, z: 0 },
              {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3,
                delay: index * 0.1,
                ease: 'back.out(1.7)',
              }
            );
          }
        });
      }
    }, []);

    const getQuestionStatus = (
      questionIndex: number
    ): 'completed' | 'current' | 'upcoming' => {
      if (questionIndex < questionCounter) return 'completed';
      if (questionIndex === questionCounter) return 'current';
      return 'upcoming';
    };

    const getQuestionColor = (status: 'completed' | 'current' | 'upcoming') => {
      switch (status) {
        case 'completed':
          return theme.palette.success.main;
        case 'current':
          return theme.palette.primary.main;
        case 'upcoming':
          return 'transparent'; // Empty bubbles initially
        default:
          return 'transparent';
      }
    };

    const getBorderColor = (status: 'completed' | 'current' | 'upcoming') => {
      switch (status) {
        case 'completed':
          return theme.palette.success.main;
        case 'current':
          return theme.palette.primary.main;
        case 'upcoming':
          return theme.palette.grey[500];
        default:
          return theme.palette.grey[500];
      }
    };

    const renderQuestionBubbles = () => {
      const bubbles = [];
      const maxBubbles = Math.min(questionsInCurrentPart, 8); // Limit to 8 bubbles for clean layout
      const spacing = 3.5 / (maxBubbles + 1); // Distribute across 3.5 units width

      for (let i = 0; i < maxBubbles; i++) {
        const status = getQuestionStatus(i);
        const xPosition = -1.75 + spacing * (i + 1); // Center the bubbles
        const isLastQuestion = i === maxBubbles - 1;

        bubbles.push(
          <group
            key={i}
            position={[xPosition, 0, -4]}
            ref={(el) => (bubbleRefs.current[i] = el)}
          >
            {/* Question bubble background */}
            <mesh>
              <circleGeometry args={[0.15, 16]} />
              <meshBasicMaterial
                color={getQuestionColor(status)}
                transparent
                opacity={status === 'current' ? 1 : 0.8}
              />
            </mesh>

            {/* Question bubble border for empty bubbles */}
            {status === 'upcoming' && (
              <mesh>
                <ringGeometry args={[0.13, 0.15, 32]} />
                <meshBasicMaterial color={getBorderColor(status)} />
              </mesh>
            )}

            {/* Question content - number, checkmark, or flag */}
            {isLastQuestion && status !== 'upcoming' ? (
              <Plane args={[0.2, 0.2]} position={[0, 0, 0.01]}>
                <meshBasicMaterial
                  alphaMap={flagTexture}
                  color={theme.palette.primary.main}
                  transparent
                />
              </Plane>
            ) : status === 'completed' ? (
              <Html center transform scale={0.6} position={[0, 0, 0.01]}>
                <CheckIcon
                  sx={{
                    color: 'white',
                    fontSize: '1.2rem',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                  }}
                />
              </Html>
            ) : (
              <Text
                scale={0.2}
                color={
                  status === 'upcoming' ? theme.palette.grey[400] : 'white'
                }
                anchorX="center"
                anchorY="middle"
                position={[0, 0, 0.01]}
                // font="/fonts/orbitron-bold.woff"
              >
                {i + 1}
              </Text>
            )}

            {/* Progress indicator for current question */}
            {status === 'current' && (
              <mesh rotation={[0, 0, -Math.PI / 2]}>
                <ringGeometry args={[0.16, 0.18, 32]} />
                <meshBasicMaterial
                  color={theme.palette.secondary.main}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}
          </group>
        );
      }

      return bubbles;
    };

    return (
      <group
        ref={groupRef}
        position={[0, isMobile ? 8.3 : 7.8, -5]}
        scale={1.35}
      >
        {/* Title text */}
        <Html position={[0, 0.5, -4]} center transform scale={0.8}>
          <Box
            component="div"
            sx={{
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'center',
              fontFamily: 'Orbitron, sans-serif',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Part {gameSession.questPart} Progress
          </Box>
        </Html>

        {/* Background bar with rounded corners */}
        <RoundedBox
          args={[4, 0.4, 0.05]}
          radius={0.2}
          smoothness={4}
          position={[0, 0, -4.1]}
        >
          <meshBasicMaterial
            color={theme.palette.background.paper}
            transparent
            opacity={0.3}
          />
        </RoundedBox>

        {/* Render question bubbles */}
        {renderQuestionBubbles()}
      </group>
    );
  });
