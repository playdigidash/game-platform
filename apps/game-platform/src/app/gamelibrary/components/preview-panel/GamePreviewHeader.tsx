import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { useGameStore } from '../../../RootStore/RootStoreProvider';
import { observer } from 'mobx-react-lite';

// Styled components
const HeaderContainer = styled(Box)(({ theme }) => ({
  padding: '2rem 1.5rem 1.5rem',
  display: 'flex',
  gap: '1rem',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    padding: '2rem 1rem 1rem',
  },
}));

const GameThumbnail = styled(Box)(({ theme }) => ({
  width: '14rem',
  height: '10rem',
  borderRadius: '0.75rem',
  overflow: 'hidden',
  boxShadow: '0 0.25rem 1rem rgba(0,0,0,0.3)',
  flexShrink: 0,
  background: '#121212',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '12rem',
  },
}));

const GameInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflow: 'hidden',
}));

const GameImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const TitleContainer = styled('div')({
  marginBottom: '1rem',
});

const GameTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: 'white',
  marginBottom: theme.spacing(1),
  fontSize: '1.5rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
  },
}));

const CreatorText = styled(Typography)(({ theme }) => ({
  color: alpha('#fff', 0.7),
  fontSize: '0.875rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  color: alpha('#fff', 0.9),
  marginTop: theme.spacing(2),
  fontSize: '0.875rem',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

interface GamePreviewHeaderProps {
  gameTitle: string;
  gameDescription: string;
  gameImageUrl: string;
  defaultGameImage: string;
  onDescriptionClick: () => void;
  descriptionRef: React.RefObject<HTMLDivElement>;
  orgId?: string;
}

export const GamePreviewHeader: React.FC<GamePreviewHeaderProps> = observer(({
  gameTitle,
  gameDescription,
  gameImageUrl,
  defaultGameImage,
  onDescriptionClick,
  descriptionRef,
  orgId
}) => {
  const { gameLibraryViewStore } = useGameStore();

  useEffect(() => {
    if (orgId) {
      gameLibraryViewStore.fetchOrganizationName(orgId);
    } else {
      gameLibraryViewStore.setOrgName('Unknown Organization');
    }
  }, [orgId, gameLibraryViewStore, gameTitle]);

  return (
    <HeaderContainer>
      <GameThumbnail>
        <GameImage
          src={gameImageUrl}
          alt={gameTitle}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = defaultGameImage;
          }}
        />
      </GameThumbnail>
      
      <GameInfo>
        <TitleContainer>
          <GameTitle variant="h5">
            {gameTitle}
          </GameTitle>
          
          <CreatorText variant="body2">
            From {gameLibraryViewStore.orgName || 'Unknown ZOrganization'}
          </CreatorText>
        </TitleContainer>
        
        <div ref={descriptionRef}>
          <DescriptionText 
            variant="body2"
            onClick={onDescriptionClick}
          >
            {gameDescription}
          </DescriptionText>
        </div>
      </GameInfo>
    </HeaderContainer>
  );
}); 