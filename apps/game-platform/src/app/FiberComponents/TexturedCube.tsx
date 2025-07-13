import { useLoader } from '@react-three/fiber';
import {
  BackSide,
  TextureLoader,
  LinearMipMapLinearFilter,
  Texture,
  RepeatWrapping,
} from 'three';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { Sphere } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import gsap from 'gsap';

const TexturedCube = observer(() => {
  const cubRef = useRef<any>();
  const { themeData } = useGameStore().gameViewStore;
  const { selectedHero, isMobile } = useGameStore().gamePlayViewStore;
  const originalTexture = useLoader(
    TextureLoader,
    themeData.default
      ? `../../assets/` + themeData.background.textures.baseColor
      : themeData.background.textures.baseColor
  ) as Texture;

  const panoTexture = originalTexture.clone();
  panoTexture.wrapS = RepeatWrapping;
  panoTexture.repeat.x = -1;

  useEffect(() => {
    if (cubRef && cubRef.current) {
      cubRef.current.material.map.minFilter = LinearMipMapLinearFilter;
    }
  }, []);

  useEffect(() => {
    if (selectedHero !== -1) {
      gsap.to(cubRef.current.rotation, {
        y: Math.PI / 2,
        duration: 2,
        delay: 1,
      });
      gsap.to(cubRef.current.position, {
        z: isMobile ? -8 : -20,
        duration: 2,
        delay: 1,
      });
    }
  }, [selectedHero]);

  return (
    <Sphere
      ref={cubRef}
      args={[isMobile ? 12 : 20, 64, 64]}
      rotation={[0, 0, 0]}
      position={[0, isMobile ? 2 : 6, 0]}
    >
      <meshBasicMaterial map={panoTexture} side={BackSide} />
    </Sphere>
  );
});

export default TexturedCube;
