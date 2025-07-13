import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export const Cleanup = () => {
  const { scene } = useThree();
  useEffect(() => {
    return () => {
      scene.remove(...scene.children);
    };
  }, [scene]);
  return null;
};
