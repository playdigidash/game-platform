import { useEffect, useRef } from 'react';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { Box, useTexture } from '@react-three/drei';
import { RepeatWrapping, Vector3 } from 'three';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react';
import { useFrame, useThree } from '@react-three/fiber';

const Ground = observer(
  ({
    position = new Vector3(0, -0.05, -13), // Fixed width for the ground - standard value is 9 units
  }: {
    position?: Vector3;
  }) => {
    const { scene, gl } = useThree();
    const depth = 30;
    const initialized = useRef(false);

    const gameStore = useGameStore();
    const { themeData, groundWidth } = gameStore.gameViewStore;
    const { isTreadmillOn, gameSpeed } = gameStore.gamePlayViewStore;
    const { isPaused } = gameStore.pauseMenuViewStore;
    const { isLimitedAnimations } = gameStore.settingsViewStore;
    const nMap = useTexture(
      themeData.default
        ? `../../assets/` + themeData.road.textures.baseColor
        : themeData.road.textures.baseColor
    );

    nMap.wrapS = nMap.wrapT = RepeatWrapping; // Allow repetition
    nMap.repeat.set(themeData.road.tiles.x, themeData.road.tiles.y);

    useEffect(() => {
      return () => {
        gl.dispose();
      };
    }, [gl, scene]);

    useFrame((_state, delta) => {
      if (isTreadmillOn) {
        nMap.offset.y += gameSpeed * delta * 0.015;

        if (nMap.offset.y >= 1) {
          nMap.offset.y = 0;
        }
      }
    });

    return (
      <RigidBody
        type="fixed"
        name="ground"
        position={position}
        colliders={false}
      >
        <CuboidCollider args={[groundWidth / 2, 0.1, depth / 2]} />
        <Box args={[groundWidth, 0.1, depth]} receiveShadow castShadow>
          <meshStandardMaterial map={nMap} />
        </Box>
      </RigidBody>
    );
  }
);
export default Ground;
