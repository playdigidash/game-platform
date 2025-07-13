import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { observer } from 'mobx-react';
import { useEffect, useRef } from 'react';

interface ITrophy {
  modelPath: string;
  scale: number[];
}

export const Trophy: React.FC<ITrophy> = observer(({ modelPath, scale }) => {
  const gltf = useGLTF(modelPath);
  const ref = useRef<THREE.Mesh>();
  const { scene, gl } = useThree();

  useEffect(() => {
    return () => {
      gl.dispose();
    };
  }, [gl, scene]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.03;
    }
  });

  return <primitive ref={ref} object={gltf.scene} scale={scale} />;
});
