import { observer } from 'mobx-react';
import { AppRoutes } from './AppRoutes';
import { PersistentViews } from './PersistentViews';
import { useEffect, useState } from 'react';
import { AppRoute } from '@lidvizion/commonlib';
import { useGameStore } from './RootStore/RootStoreProvider';

export const AppEntry = observer(() => {
  const { setShowVerifyTokenModal } = useGameStore().gameLoginViewStore;
  const { setSelectedModuleUrlName } = useGameStore().moduleViewStore;

  useEffect(() => {
    const endsWithSlash = window.location.pathname.endsWith('/');
    const pathArr = window.location.pathname.split('/');
    if (endsWithSlash) {
      pathArr.pop();
    }

    if (pathArr[1] && pathArr[1] !== AppRoute.verifyMagicLink) {
      setSelectedModuleUrlName(pathArr[1]);
    }

    if (pathArr[pathArr.length - 1] === 'dash') {
      window.location.href = `${window.location.origin}/${pathArr[1] || ''}`;
    } else if (pathArr[1] && pathArr[1] === AppRoute.verifyMagicLink) {
      setShowVerifyTokenModal(true);
    }

    setIsValidPath(true);
  }, []);

  const [isValidPath, setIsValidPath] = useState(false);

  return (
    <>
      {isValidPath && (
        <>
          <AppRoutes />
          <PersistentViews />
        </>
      )}
    </>
  );
});
