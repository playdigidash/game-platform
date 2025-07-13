import React from 'react';
import { observer } from 'mobx-react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { OverviewProgressView } from './OverviewProgressView';

export const ProgressIndicator = observer(({
  progress,
  questionCounter,
  settings,
  hintCounter,
}: {
  progress: number;
  questionCounter: number;
  settings: any;
  hintCounter: number;
}) => {
  const { isTutorial } = useGameStore().gamePlayViewStore;

  // Don't show progress views in tutorial mode
  if (isTutorial) {
    return null;
  }

  // Always show the overview progress view
  return (
    <OverviewProgressView
      progress={progress}
      questionCounter={questionCounter}
      settings={settings}
    />
  );
});
