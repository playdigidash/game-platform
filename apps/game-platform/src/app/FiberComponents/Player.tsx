import { useEffect, useState, useRef } from 'react';
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useFrame, useThree } from '@react-three/fiber';
import { HeroModel, AVA_ANIM } from './HeroModel';
import { IDirection } from '@lidvizion/commonlib';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react';
import { IGlb } from '@lidvizion/commonlib';

const Player = observer(
  ({ selectedAva, laneSize }: { selectedAva: IGlb; laneSize: number }) => {
    // Add console logs to track selectedAva
    useEffect(() => {
      console.log('[Player] Received selectedAva:', selectedAva);
      console.log('[Player] selectedAva objId:', selectedAva?.objId);
      console.log('[Player] selectedAva id:', (selectedAva as any)?.id);
      console.log('[Player] selectedAva res:', selectedAva?.res);
      console.log('[Player] selectedAva animations:', selectedAva?.animations);
    }, [selectedAva]);

    const {
      gestureKey,
      isHurt,
      laneSelected,
      sensitivity,
      showScoreBoard,
      questionMode,
      setCameraSlider,
    } = useGameStore().gamePlayViewStore;
    const { jumpHeight } = useGameStore().movementViewStore;
    const { isPaused } = useGameStore().pauseMenuViewStore;
    const { scene, gl } = useThree();
    let animTimer: any;
    const playerRef = useRef<RapierRigidBody>(null);
    const isOnFloor = useRef(false);
    const pressedKeys = useRef(new Set()); // Track pressed keys
    const [currentAnim, setAnim] = useState({ name: AVA_ANIM.RUN, counter: 1 });

    const updateAnimation = (animName: AVA_ANIM) => {
      if (showScoreBoard) {
        return;
      }
      setAnim((prev) => ({ name: animName, counter: prev.counter + 1 }));
    };

    const playerMovementSpeed = sensitivity || 0.5;
    const playerMovementSpeedMobile = sensitivity * 4 || 8;
    const downwardForce = 2;
    const lanePositions = [-laneSize, 0, laneSize];
    const [targetX, setTargetX] = useState(0);

    const currentLaneIndexRef = useRef(1);

    const handleKeyDown = (e: any) => {
      if (!playerRef.current || showScoreBoard) return;
      // if (laneSelected === 'Free movement') {
      //   pressedKeys.current.add(e.code);
      // } else
      if (laneSelected) {
        if (e.code === 'ArrowLeft') {
          if (currentLaneIndexRef.current > 0) {
            currentLaneIndexRef.current -= 1;
            setTargetX(lanePositions[currentLaneIndexRef.current]);
            updateAnimation(AVA_ANIM.RUN_LEFT);
          }
        }

        if (e.code === 'ArrowRight') {
          if (currentLaneIndexRef.current < lanePositions.length - 1) {
            currentLaneIndexRef.current += 1;
            setTargetX(lanePositions[currentLaneIndexRef.current]);
            updateAnimation(AVA_ANIM.RUN_RIGHT);
          }
        }

        if (e.code === 'ArrowUp' && isOnFloor.current) {
          playerRef.current.applyImpulse({ x: 0, y: jumpHeight, z: 0 }, true);
          updateAnimation(AVA_ANIM.JUMP);
        }

        if (e.code === 'ArrowDown' && !isOnFloor.current) {
          playerRef.current.applyImpulse(
            { x: 0, y: -downwardForce * 4, z: 0 },
            true
          );
        }
      }
    };

    const handleKeyUp = (e: any) => {
      if (!playerRef.current) return;
      pressedKeys.current.delete(e.code);
    };

    const { loadHeroModel } = useGameStore().gameViewStore;
    const [loadedModel, setLoadedModel] = useState<any>(null);

    useEffect(() => {
      const getHeroGLTF = async () => {
        console.log('[Player] About to load hero model for selectedAva:', selectedAva);
        const loadedModel = await loadHeroModel(selectedAva, 0);
        console.log('[Player] Loaded model result:', loadedModel);

        setLoadedModel(loadedModel);
      };

      getHeroGLTF();
    }, [
      loadHeroModel,
      selectedAva.animations,
      selectedAva.res,
      selectedAva.res?.animations,
      selectedAva.res?.scene,
      selectedAva.url,
    ]);

    useEffect(() => {
      setCameraSlider(0);

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, [laneSelected]);

    useEffect(() => {
      if (gestureKey && playerRef.current) {
        // if (laneSelected === 'Free movement') {
        //   // Free movement logic
        //   if (gestureKey.key === IDirection.left) {
        //     playerRef.current.applyImpulse(
        //       {
        //         x: -playerMovementSpeedMobile * gestureKey.force,
        //         y: 0.1,
        //         z: 0,
        //       },
        //       true
        //     );
        //     updateAnimation(AVA_ANIM.RUN_LEFT);
        //   }
        //   if (gestureKey.key === IDirection.right) {
        //     playerRef.current.applyImpulse(
        //       { x: playerMovementSpeedMobile * gestureKey.force, y: 0.1, z: 0 },
        //       true
        //     );
        //     updateAnimation(AVA_ANIM.RUN_RIGHT);
        //   }
        // } else {
        // Lane-based movement logic
        if (gestureKey.key === IDirection.left) {
          if (currentLaneIndexRef.current > 0) {
            currentLaneIndexRef.current -= 1;
            setTargetX(lanePositions[currentLaneIndexRef.current]);
          }
          updateAnimation(AVA_ANIM.RUN_LEFT);
        }
        if (gestureKey.key === IDirection.right) {
          if (currentLaneIndexRef.current < lanePositions.length - 1) {
            currentLaneIndexRef.current += 1;
            setTargetX(lanePositions[currentLaneIndexRef.current]);
          }
          updateAnimation(AVA_ANIM.RUN_RIGHT);
        }

        if (gestureKey.key === IDirection.up && isOnFloor.current) {
          playerRef.current.applyImpulse({ x: 0, y: jumpHeight, z: 0 }, true);
          updateAnimation(AVA_ANIM.JUMP);
        }

        if (gestureKey.key === IDirection.down && !isOnFloor.current) {
          playerRef.current.applyImpulse(
            { x: 0, y: -downwardForce * 4 * gestureKey.force, z: 0 },
            true
          );
        }
      }
    }, [gestureKey, laneSelected]);

    useEffect(() => {
      return () => {
        gl.dispose();
      };
    }, [gl, scene]);

    useEffect(() => {
      //clear any timer if exist
      if (animTimer) {
        clearTimeout(animTimer);
      }
      if (showScoreBoard) {
        return; //dont change
      }
      if (isPaused || questionMode) {
        updateAnimation(AVA_ANIM.IDLE);
      } else if (currentAnim.name !== 'idle' && currentAnim.name !== 'run') {
        animTimer = setTimeout(() => {
          updateAnimation(AVA_ANIM.RUN);
        }, 500);
      } else if (currentAnim.name === 'idle' && !isPaused && !questionMode) {
        updateAnimation(AVA_ANIM.RUN);
      }
    }, [isPaused, questionMode, currentAnim]);

    useEffect(() => {
      if (showScoreBoard) {
        setAnim({ name: AVA_ANIM.SELECTED, counter: 0 });
      }
    }, [showScoreBoard]);

    useFrame(() => {
      if (!playerRef.current || isPaused) return;

      const movementDirection = { x: 0, y: 0, z: 0 };

      // if (laneSelected === 'Free movement') {
      //   if (pressedKeys.current.has('ArrowLeft')) {
      //     movementDirection.x = isOnFloor.current
      //       ? -playerMovementSpeed
      //       : -playerMovementSpeed / 2;
      //     movementDirection.y = 0.03;
      //     updateAnimation(AVA_ANIM.RUN_LEFT);
      //   }
      //   if (pressedKeys.current.has('ArrowRight')) {
      //     movementDirection.x = isOnFloor.current
      //       ? playerMovementSpeed
      //       : playerMovementSpeed / 2;
      //     movementDirection.y = 0.03;
      //     updateAnimation(AVA_ANIM.RUN_RIGHT);
      //   }
      //   if (pressedKeys.current.has('ArrowUp') && isOnFloor.current) {
      //     movementDirection.y = jumpHeight;
      //     updateAnimation(AVA_ANIM.JUMP);
      //   }
      //   if (pressedKeys.current.has('ArrowDown') && !isOnFloor.current) {
      //     movementDirection.y = -downwardForce;
      //   }

      //   if (isHurt) {
      //     //slow down
      //     movementDirection.x = movementDirection.x / 2;
      //     movementDirection.z = movementDirection.z / 2;
      //     movementDirection.y = movementDirection.y / 2;
      //   }
      // } else
      if (laneSelected) {
        // Three Lane system
        const currentX = playerRef.current.translation().x;
        const speed = 0.1;
        const deltaX = targetX - currentX;
        playerRef.current.setTranslation(
          {
            x: currentX + deltaX * speed,
            y: playerRef.current.translation().y,
            z: playerRef.current.translation().z,
          },
          true
        );

        // Update camera slider accordingly
        if (deltaX !== 0) {
          if (targetX === lanePositions[0]) {
            // left lane
            setCameraSlider(-laneSize / 2);
          } else if (targetX === lanePositions[2]) {
            // right lane
            setCameraSlider(laneSize / 2);
          } else {
            // center lane
            setCameraSlider(0);
          }
        }
      }

      if (movementDirection.y > jumpHeight) {
        movementDirection.y = 0;
      }

      // playerRef.current.applyImpulse(movementDirection, true);
      const currentVelocity = playerRef.current.linvel();

      if (currentVelocity.y > jumpHeight) {
        playerRef.current.setLinvel(
          {
            x: currentVelocity.x,
            y: jumpHeight,
            z: currentVelocity.z,
          },
          true
        );
      }
    });

    return (
      <RigidBody
        mass={5}
        name="player"
        ref={playerRef}
        angularDamping={8}
        position={[0, 0.1, 0]}
        colliders={false}
        onCollisionEnter={({ other }) => {
          if (!other.rigidBodyObject) return;
          if (other.rigidBodyObject.name === 'ground') {
            isOnFloor.current = true;
          }
        }}
        onCollisionExit={({ other }) => {
          if (
            other.rigidBodyObject &&
            other.rigidBodyObject.name === 'ground'
          ) {
            isOnFloor.current = false;
          }
        }}
      >
        <CuboidCollider args={[0.5, 0.5, 0.5]} position={[0, 0.7, 0]} />
        {loadedModel?.scene && loadedModel.animations && (
          <HeroModel
            maxSize={1}
            selectedIndex={true}
            faceCamera={false}
            playAnim={currentAnim}
            animations={loadedModel.animations}
            heroScene={loadedModel.scene}
          />
        )}
      </RigidBody>
    );
  }
);

export default Player;
