import { Box } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { defaultModalStyle } from '../Common';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useGameStore } from '../RootStore/RootStoreProvider';

export const TutorialEndScreen: React.FC = observer(() => {
  const { setIsTutorialCompleted, setIsTutorial } =
    useGameStore().gamePlayViewStore;
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerHeight <= 700);
    };
    handleResize();
    setIsTutorialCompleted(true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box
          component="div"
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          alignItems={'center'}
          padding={'.5em'}
          color="#fff"
          textAlign={'center'}
        >
          <p>Avoid Obstacles & Collect Coins!</p>
          <p>{isMobile ? 'Swipe' : 'Use Arrow Keys'} to Move and Jump</p>
          <p>Hint boxes will help you answer the questions!</p>
        </Box>
    // <>
    //   <BasicModal
    //     supportButton={{
    //       text: 'Play Tutorial Again',
    //       action: () => setIsTutorial(true),
    //     }}
    //     actionButton={{
    //       text: 'Start Game',
    //       action: () => setIsTutorialCompleted(true),
    //     }}
    //   >
        
    //   </BasicModal>
    // </>
  );
});
