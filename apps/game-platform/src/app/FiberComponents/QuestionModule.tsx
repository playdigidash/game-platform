import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import '../gameStyles.css';
import { useEffect, useState, useRef } from 'react';
import { getTxtFromEditor } from '@lidvizion/commonlib';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react';
import { Box, useTheme } from '@mui/material';
import { Mesh, MeshStandardMaterial, Group, PointLight, AmbientLight, Clock, Color } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

interface FrameState {
  clock: Clock;
  gl: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
}

export const QuestionModule: React.FC = observer(() => {
  const { reachPlayer } = useGameStore().questionViewStore;
  const theme = useTheme();
  const [questionModel, setQuestionModel] = useState<Group | null>(null);
  const modelRef = useRef<Group>(null);
  const initialY = 0.5;
  const bounceHeight = 0.1;
  const rotationSpeed = 0.5;

  // Animation loop
  useFrame((state: FrameState, delta: number) => {
    if (modelRef.current) {
      // Rotation
      modelRef.current.rotation.y += delta * rotationSpeed;

      // Bouncing motion
      const time = state.clock.getElapsedTime();
      modelRef.current.position.y = initialY + Math.sin(time * 2) * bounceHeight;
    }
  });

  useEffect(() => {
    const objLoader = new OBJLoader();

    objLoader.load(
      '/assets/questionmark/Question Symbol.obj',
      (object) => {
        // Apply materials to the loaded object
        object.traverse((node) => {
          if (node instanceof Mesh) {
            
            // Question mark material (Material.002 - green in mtl)
            const questionMarkMaterial = new MeshStandardMaterial({
              color: new Color(theme.palette.primary.main),
              metalness: 0.7,
              roughness: 0.2,
              emissive: new Color(theme.palette.primary.main),
              emissiveIntensity: 0.3,
              transparent: reachPlayer ? false : true,
              opacity: reachPlayer ? 1 : 0.6,
              side: 2 // THREE.DoubleSide
            });
            questionMarkMaterial.name = 'Material.002';

            // Border material (Material.001 - reddish in mtl)
            const borderMaterial = new MeshStandardMaterial({
              color: new Color(theme.palette.secondary.main),
              metalness: 0.8,
              roughness: 0.1,
              emissive: new Color(theme.palette.secondary.main),
              emissiveIntensity: 0.2,
              transparent: reachPlayer ? false : true,
              opacity: reachPlayer ? 1 : 0.6,
              side: 2 // THREE.DoubleSide
            });
            borderMaterial.name = 'Material.001';

            // Background material (Material - grey in mtl)
            const backgroundMaterial = new MeshStandardMaterial({
              color: new Color(theme.palette.background.paper),
              metalness: 0.4,
              roughness: 0.3,
              emissive: new Color(theme.palette.background.paper),
              emissiveIntensity: 0.1,
              transparent: reachPlayer ? false : true,
              opacity: reachPlayer ? 1 : 0.6,
              side: 2 // THREE.DoubleSide
            });
            backgroundMaterial.name = 'Material';

            // Apply materials based on the original material names from the mtl file
            const currentMaterial = node.material as MeshStandardMaterial;

            if (currentMaterial?.name === 'Material.002') {
              node.material = questionMarkMaterial;
            } else if (currentMaterial?.name === 'Material.001') {
              node.material = borderMaterial;
            } else if (currentMaterial?.name === 'Material') {
              node.material = backgroundMaterial;
            }
          }
        });

        setQuestionModel(object);
      },
      () => {
        // Progress tracking removed
      },
      (error) => {
        // Error handling removed
      }
    );
  }, [theme, reachPlayer]);

  if (!questionModel) {
    return null;
  }

  return (
    <>
      {/* Add lights */}
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <pointLight position={[-10, -10, -10]} intensity={1.5} />
      <pointLight position={[0, 0, 5]} intensity={1.5} />
      <pointLight position={[0, 5, 0]} intensity={1.5} />

      <primitive 
        ref={modelRef}
        object={questionModel} 
        scale={[1, 1, 1]} 
        rotation={[0, 0, 0]}
        position={[0, initialY, 0]}
      />
    </>
  );
});
