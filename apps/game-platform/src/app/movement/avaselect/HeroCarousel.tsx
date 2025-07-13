import { Float } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { AVA_ANIM, HeroModel } from '../../FiberComponents/HeroModel';
import { useGameStore } from '../../RootStore/RootStoreProvider';

export const HeroCarousel: React.FC = observer(() => {
  const { herosData, selectedIndex, heroSelGLTFMap, getAdjustedPosition } =
    useGameStore().gameViewStore;

  const { isLimitedAnimations } = useGameStore().settingsViewStore;

  return (
    <>
      {herosData.map((item, index) => {
        // Only the selected hero should dance, others should be idle
        const playAnim = {
          name: index === selectedIndex ? AVA_ANIM.SELECTED : AVA_ANIM.IDLE,
          counter: 0,
        };

        return (
          <group key={index} position={getAdjustedPosition(index)}>
            {index in heroSelGLTFMap && heroSelGLTFMap[index]?.scene && (
              <HeroModel
                maxSize={index === selectedIndex ? 2.5 : 1.0}
                selectedIndex={selectedIndex === index}
                faceCamera={true}
                // customRotationY={(Math.PI * 3) / 2}
                playAnim={playAnim}
                animations={heroSelGLTFMap[index].animations || []}
                heroScene={heroSelGLTFMap[index].scene}
              />
            )}
          </group>
        );
      })}
    </>
  );
});
