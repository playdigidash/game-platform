import { Circle, Cone } from '@react-three/drei';
import { useTheme } from '@mui/material';

export const Spotlight = () => {
  const theme = useTheme();
  const radius = 1.5;
  const angle = -2.6; // This is the initial angle from AvatarSelectionScene
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);

  return (
    <group position={[0, 0.5, 0]}>
      <spotLight
        position={[x, 1, z]}
        color={theme.palette.primary.main}
        intensity={5}
        angle={0.5}
        distance={10}
      />
      <Cone args={[1, 3]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={theme.palette.primary.main}
          opacity={0.3}
          transparent
        />
      </Cone>
      <Circle
        args={[1]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.5, 0]}
      >
        <meshBasicMaterial
          color={theme.palette.primary.main}
          opacity={0.7}
          transparent
        />
      </Circle>
    </group>
  );
};
