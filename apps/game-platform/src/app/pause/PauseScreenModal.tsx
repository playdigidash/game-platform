import React from 'react';
import { observer } from 'mobx-react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { IUserProfileType, SkeletonGameModal } from '@lidvizion/commonlib';
import { TutorialScreen } from './TutorialScreen';
import { PauseMenu } from '../modals/PauseMenu';
import { PauseMenuTabs } from './PauseMenuTabs';
import { PlatformLoginContentEntry } from '@lidvizion/login';

export const PauseScreenModal: React.FC = observer(() => {
  const { setShowPauseModal } = useGameStore().pauseMenuViewStore;
  const {
    tokenVerifyMsg,
    forceLogin,
    handleAfterLogin,
    showVerifyTokenModal,
    handleAfterLoginFail,
    setShowLoginModal,
  } = useGameStore().gameLoginViewStore;

  return (
    <>
      {forceLogin && (
        <SkeletonGameModal
          onClose={() => setShowLoginModal(false)}
          body={
            <PlatformLoginContentEntry
              userType={IUserProfileType.game}
              handleAfterLogin={handleAfterLogin}
              handleAfterLoginFail={handleAfterLoginFail}
              showVerifyToken={showVerifyTokenModal}
              tokenVerifyMsg={tokenVerifyMsg}
              emailAllowed={false}
              phoneAllowed={true}
            />
          }
          fullScreen
        />
      )}
      {!forceLogin && (
        <SkeletonGameModal
          onClose={() => setShowPauseModal(false)}
          headerContent={<PauseMenuTabs />}
          body={<PauseMenu />}
        />
      )}
    </>
  );
});
