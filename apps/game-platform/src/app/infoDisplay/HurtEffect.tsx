import { observer } from 'mobx-react';
import { useRef, useEffect } from 'react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import gsap from 'gsap';

export const HurtEffect: React.FC = observer(() => {
  const shadowRef = useRef(null);
  const { isHurt, setHurt } = useGameStore().gamePlayViewStore;

  useEffect(() => {
    if (isHurt) {
      if (window.navigator.vibrate) {
        // vibration supported
        window.navigator.vibrate(250);
      }
      const tl = gsap.timeline({ onComplete: () => setHurt(false) });
      tl.to(shadowRef.current, { opacity: 1, duration: 0.2 });
      tl.to(shadowRef.current, { opacity: 0, duration: 0.5, delay: 0.2 });
    }
  }, [isHurt]);

  return (
    <div
      ref={shadowRef}
      style={{
        position: 'fixed',
        zIndex: 99,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        boxShadow: 'inset 0 0 25px 10px red',
        opacity: 0,
        // transition: 'opacity 0.5s ease',
      }}
    />
  );
});
