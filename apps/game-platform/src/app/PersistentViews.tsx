import { observer } from 'mobx-react';
import { useGameStore } from './RootStore/RootStoreProvider';
import { PauseScreenModal } from './pause/PauseScreenModal';
import { Box } from '@mui/material';
import { Suspense } from 'react';
import EndGameModal from './endgame/EndGameModal';
import { AudioPlayer } from './audio/AudioPLayer';
import { QuestionModal } from './question/QuestionModal';

export const PersistentViews: React.FC = observer(() => {
  const { showPauseModal } = useGameStore().pauseMenuViewStore;
  const { forceLogin } = useGameStore().gameLoginViewStore;
  const { isEndGameModalOpen } = useGameStore().endGameViewStore;
  return (
    <Box component={'div'}>
      {(showPauseModal || forceLogin) && <PauseScreenModal />}
      {isEndGameModalOpen && (
        <Box component="div">
          <Suspense>
            <EndGameModal />
          </Suspense>
        </Box>
      )}
      <AudioPlayer />
      {<QuestionModal />}
    </Box>
  );
});
