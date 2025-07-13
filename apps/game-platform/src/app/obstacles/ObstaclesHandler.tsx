import { useEffect } from 'react';
import { useGameStore } from '../RootStore/RootStoreProvider';

import { observer } from 'mobx-react';
import ExplosionConfetti from '../FiberComponents/Helper/ExplosionConfetti';
import { Sparkles } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import moment from 'moment';
import { ObstacleItem } from './ObstacleItem';
import { ObstacleType } from '@lidvizion/commonlib';
import { ProgressIndicator } from '../progress/ProgressIndicator';

export const ObstaclesHandler = observer(() => {
  const { isLimitedEffects } = useGameStore().settingsViewStore;
  const { scene, gl } = useThree();
  const { questionCounter, questionMode, showScoreBoard } =
    useGameStore().gamePlayViewStore;
  const { isPaused } = useGameStore().pauseMenuViewStore;
  const { questionsData, settings, playedQuestions, apiQuestions } =
    useGameStore().gameViewStore;
  const {
    setConfettiEffect,
    confettiEffect,
    timeoutRef,
    startTimeRef,
    particlesEffect,
    setParticlesEffect,
    elapsedTimeRef,
    setRemainingTimeRef,
    layersTimeoutDelay,
    setElapsedTimeRef,
    progress,
  } = useGameStore().questionViewStore;
  const { obstaclesList, removeObstacle } = useGameStore().obstacleViewStore;

  useEffect(() => {
    return () => {
      gl.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    if (confettiEffect) {
      setTimeout(
        () => {
          setConfettiEffect(false);
        },
        Object.keys(playedQuestions).length === apiQuestions.length
          ? 6500
          : 3500
      );
    }
  }, [confettiEffect]);

  useEffect(() => {
    if (particlesEffect) {
      setTimeout(
        () => {
          setParticlesEffect(false);
        },
        Object.keys(playedQuestions).length === apiQuestions.length
          ? 6500
          : 3500
      );
    }
  }, [particlesEffect]);

  // useEffect(() => {
  //   if (isPaused) {
  //     const currentTime = moment().valueOf();
  //     const elapsedTime = currentTime - startTimeRef + elapsedTimeRef;
  //     setRemainingTimeRef(Math.max(0, layersTimeoutDelay - elapsedTime));
  //     setElapsedTimeRef(elapsedTime);
  //   } else {
  //     handleUnpause();
  //   }
  // }, [isPaused]);

  // useEffect(() => {
  //   if (!isPaused)
  //     return () => {
  //       if (timeoutRef) clearTimeout(timeoutRef);
  //     };

  //   return;
  // }, [isPaused]);

  return (
    <>
      {/* Progress indicator */}
      {!questionMode && !showScoreBoard && (
        <ProgressIndicator
          progress={progress}
          questionCounter={questionCounter}
          settings={settings}
          hintCounter={questionsData[questionCounter]?.hints?.length || 0}
        />
      )}

      {obstaclesList.map((item: ObstacleType) => {
        return <ObstacleItem key={item.id} item={item} />;
      })}
      {!isLimitedEffects && (
        <group position={[0, 0, -8]}>
          {confettiEffect && (
            <ExplosionConfetti
              radius={
                Object.keys(playedQuestions).length === apiQuestions.length
                  ? 20
                  : 10
              }
            />
          )}
          {particlesEffect && (
            <Sparkles
              count={100}
              size={
                Object.keys(playedQuestions).length === apiQuestions.length
                  ? 20
                  : 10
              }
              speed={1}
              color="gold"
              opacity={0.8}
              scale={[8, 8, 10]}
            />
          )}
        </group>
      )}
    </>
  );
});
