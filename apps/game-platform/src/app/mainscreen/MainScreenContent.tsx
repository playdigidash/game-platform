import React from 'react';
import { Box } from '@mui/material';
import { GameBanner } from './GameBanner';
import { GameTitle } from './GameTitle';
import { GameDescription } from './GameDescription';
import { GameLogo } from './GameLogo';
import { QuestSection } from './QuestSection';
import { useGameStore } from '../RootStore/RootStoreProvider';

interface MainScreenContentProps {
  hasBanner: boolean;
  bannerSrc: string;
  title: string | undefined;
  description: string | undefined;
  logoSrc: string;
  totalQuestParts: { parts: number };
  onDescriptionClick: (
    event: React.MouseEvent<HTMLDivElement>,
    description: string | undefined
  ) => void;
  currentQuestPart: number;
}

export const MainScreenContent: React.FC<MainScreenContentProps> = ({
  hasBanner,
  bannerSrc,
  title,
  description,
  logoSrc,
  totalQuestParts,
  onDescriptionClick,
  currentQuestPart,
}) => {
  const { handleQuestPartClick } = useGameStore().gameViewStore;

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: `${hasBanner ? 'flex-start' : 'center'}`,
        height: '100vh',
        width: '100vw',
        maxHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
        paddingTop: '5rem',
        paddingBottom: '1rem',
      }}
    >
      <GameBanner hasBanner={hasBanner} bannerSrc={bannerSrc} />

      <Box
        component="div"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: { xs: '90vw', md: '60rem' },
          margin: '0 auto',
          padding: '0.5rem',
          flex: 1,
          minHeight: 'min-content',
          overflow: 'hidden',
        }}
      >
        <GameTitle title={title} />

        <GameDescription
          description={description}
          onDescriptionClick={onDescriptionClick}
        />

        <Box
          component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '40rem',
            margin: '0 auto',
          }}
        >
          <GameLogo logoSrc={logoSrc} />

          <QuestSection
            totalQuestParts={totalQuestParts}
            currentQuestPart={currentQuestPart}
          />
        </Box>
      </Box>
    </Box>
  );
};
