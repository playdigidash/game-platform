import { Text, Plane } from '@react-three/drei';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import ObstacleModel from './ObstacleModel';
import { useGameStore } from '../RootStore/RootStoreProvider';
import GlowEffect from '../tutorial/GlowEffect';
import GlowEffectBox from '../tutorial/GlowEffectBox';
import { EObstacleModelType, ObstacleType } from '@lidvizion/commonlib';

type ObsProps = {
  item: ObstacleType;
};

export const ObstacleItem = ({ item }: ObsProps) => {
  const { translatedGameData } = useGameStore().translateViewStore;
  const { questionsData } = useGameStore().gameViewStore;
  const { gameSpeed, setGameSpeed, gameSpeeds, hintIdx } =
    useGameStore().gamePlayViewStore;
  const { setReachPlayer, questionCounter } = useGameStore().questionViewStore;
  const { isSoundEffectsChecked } = useGameStore().settingsViewStore;
  const { isTreadmillOn } = useGameStore().gamePlayViewStore;
  const {
    shouldShowGlowEffect,
    handleObstacleHit,
    handleSponsorObstacleHit,
    removeObstacle,
    getSpecifiedObsPos,
  } = useGameStore().obstacleViewStore;
  const { addCollectedCoin, addCollectedHint } =
    useGameStore().collectableViewStore;
  const obstacleRef = useRef<RapierRigidBody>(null);
  const hitRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resetPositionZ = 5;

  useEffect(() => {
    if (isSoundEffectsChecked) {
      audioRef.current = new Audio('/assets/audio/soundeffects/ouch.wav');
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isSoundEffectsChecked]);

  useFrame((_state, delta) => {
    if (obstacleRef.current && isTreadmillOn) {
      const position = obstacleRef.current.translation();

      if (item.type === EObstacleModelType.sponsor && position.z > -12) {
        setGameSpeed(gameSpeeds.slowMotion);
      }

      const newZ = position.z + gameSpeed * delta;
      obstacleRef.current.setNextKinematicTranslation({
        x: position.x,
        y: position.y,
        z: newZ,
      });

      if (newZ > resetPositionZ) {
        removeObstacle({ item });
      }
    }
  });

  return (
    <RigidBody
      sensor
      type="kinematicPosition"
      name="obstacle"
      ref={obstacleRef}
      position={item.position}
      userData={{ type: `${item.type}_obstacle` }}
      onIntersectionEnter={(payload) => {
        if (!payload.rigidBodyObject) return;
        const isPlayer = payload.rigidBodyObject.name === 'player';
        if (isPlayer) {
          if (item.type === EObstacleModelType.sponsor) {
            handleSponsorObstacleHit(hitRef, item);
          } else if (item.type === EObstacleModelType.question) {
            setReachPlayer(true);
            removeObstacle({ item });
          } else if (item.type === EObstacleModelType.coin) {
            addCollectedCoin(item);
          } else if (item.type === EObstacleModelType.hint) {
            addCollectedHint(item);
          } else {
            handleObstacleHit(hitRef, item);
          }
        }
      }}
    >
      {shouldShowGlowEffect(item.type) && (
        <GlowEffectBox args={item.boxArg} glowColor={item.glowColor} />
      )}
      {item.type === EObstacleModelType.coin && (
        <GlowEffect glowColor="green" />
      )}
      {item.text && item.type === EObstacleModelType.hint && (
        <group position={[0, 1, 0]}>
          <Plane args={[item.text.length / 3, 0.8]} position={[0, 0, -0.1]}>
            <meshBasicMaterial transparent opacity={0.5} color="black" />
          </Plane>
          <Text scale={0.5} color="white" anchorX="center" anchorY="middle">
            {typeof questionCounter === 'number' &&
            item.instance !== null &&
            item.instance !== undefined
              ? item.text || ''
              : ''}
          </Text>
        </group>
      )}
      {item.instance && <ObstacleModel item={item} />}
    </RigidBody>
  );
};
