import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useGameStore } from '../RootStore/RootStoreProvider';

export default function CameraTriggers() {
  const { setCameraSlider } = useGameStore().gamePlayViewStore;

  return (
    <>
      <RigidBody
        type="fixed"
        sensor
        position={[3, 1, 0]}
        onIntersectionEnter={(payload) => {
          if (!payload.rigidBodyObject) return;
          const isPlayer = payload.rigidBodyObject.name === 'player';
          if (isPlayer) {
            setCameraSlider(2.5);
          }
        }}
      >
        <CuboidCollider args={[1, 2, 1]} />
      </RigidBody>
      <RigidBody
        type="fixed"
        sensor
        position={[0, 1, 0]}
        onIntersectionEnter={(payload) => {
          if (!payload.rigidBodyObject) return;
          const isPlayer = payload.rigidBodyObject.name === 'player';
          if (isPlayer) {
            setCameraSlider(0);
          }
        }}
      >
        <CuboidCollider args={[1, 2, 1]} />
      </RigidBody>
      <RigidBody
        type="fixed"
        sensor
        position={[-3, 1, 0]}
        onIntersectionEnter={(payload) => {
          if (!payload.rigidBodyObject) return;
          const isPlayer = payload.rigidBodyObject.name === 'player';
          if (isPlayer) {
            setCameraSlider(-2.5);
          }
        }}
      >
        <CuboidCollider args={[1, 2, 1]} />
      </RigidBody>
    </>
  );
}
