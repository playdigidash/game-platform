import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  alpha,
  Tooltip,
  Chip
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { ICustomModule } from '@lidvizion/commonlib';
import { useGameStore } from '../RootStore/RootStoreProvider';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

// Default image as a constant URL
const DEFAULT_GAME_IMAGE = '/assets/images/dd-logo-white500x500.svg';

interface GameCardProps {
  game: ICustomModule;
  onClick: (game: ICustomModule) => void;
}

const StyledCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '1rem',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.8)}, ${alpha(theme.palette.secondary.dark, 0.8)})`,
  backdropFilter: 'blur(0.625rem)',
  boxShadow: '0 0.25rem 1rem rgba(0,0,0,0.3)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-0.5rem)',
    boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.4)',
  },
}));

const GameOverlay = styled(Box)(({ theme }: { theme: Theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '1rem',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const PlayButton = styled(Box)(({ theme }: { theme: Theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  color: 'white',
}));

const HashtagsContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '0.5rem',
}));

const StyledChip = styled(Chip)(({ theme }: { theme: Theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  color: 'white',
  fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',
  height: 'clamp(1.25rem, 2vw, 1.5rem)',
  '& .MuiChip-label': {
    padding: '0 0.5rem',
  },
}));

const GameLibraryCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const { carouselViewStore, gameLibraryViewStore } = useGameStore();
  
  // Try to get the image from various possible sources
  const storeImage = gameLibraryViewStore.getGameImage(game.moduleId);
  const carouselImage = carouselViewStore.getGameImage(game.moduleId);
  const imageUrl = storeImage || carouselImage || DEFAULT_GAME_IMAGE;
  
  // Fetch image and tags when component mounts
  useEffect(() => {
    // If the game has an imgId but we don't have its image yet, try to fetch it
    if (game.imgId && !storeImage && !carouselImage) {
      gameLibraryViewStore.fetchGameImage(game.moduleId, game.imgId);
    }
    
    // Fetch tags for this game if it has any
    if (game.tags && game.tags.length > 0) {
      gameLibraryViewStore.fetchTagsForGame(game);
    }
  }, [game.moduleId, game.imgId, game.tags, storeImage, carouselImage]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DEFAULT_GAME_IMAGE;
  };

  // Use real tags from the game object
  const gameTags = game.tags || [];

  return (
    <StyledCard>
      <CardActionArea 
        onClick={() => onClick(game)}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box component="div" sx={{ position: 'relative', paddingTop: '75%' /* 4:3 Aspect Ratio */ }}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={game.settings?.gTitle || 'Game'}
            onError={handleImageError}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Play Overlay */}
          <GameOverlay 
            component="div"
            className="game-overlay"
            sx={{
              '.MuiCardActionArea-root:hover &': {
                opacity: 1,
              },
              padding: { xs: '0.5rem', sm: '0.75rem', md: '1rem' }
            }}
          >
            <Typography 
              variant="h6" 
              component="div"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.5)',
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
              }}
            >
              {game.settings?.gTitle || 'Untitled Game'}
            </Typography>
          </GameOverlay>
          
          {/* Play Button */}
          <PlayButton
            component="div"
            className="play-button"
            sx={{
              '.MuiCardActionArea-root:hover &': {
                opacity: 1,
              },
            }}
          >
            <DirectionsRunIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, color: 'white' }} />
            <Typography
              variant="body1"
              component="div"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.5)',
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
              }}
            >
              Play
            </Typography>
          </PlayButton>
        </Box>
        
        <CardContent sx={{ 
          flexGrow: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: { xs: '0.5rem', sm: '0.75rem', md: '1rem' }
        }}>
          {/* Game title with description tooltip */}
          <Tooltip 
            title={game.settings?.gDesc || 'No description available'} 
            arrow 
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: 'rgba(0,0,0,0.9)',
                  backdropFilter: 'blur(0.625rem)',
                  maxWidth: 'min(18.75rem, 80vw)',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  lineHeight: 1.5,
                  p: 1.5,
                  borderRadius: '0.5rem',
                }
              }
            }}
          >
            <Typography 
              gutterBottom 
              variant="h6" 
              component="div"
              sx={{ 
                color: 'white',
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'help',
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                marginBottom: { xs: '0.25rem', sm: '0.5rem' }
              }}
            >
              {game.settings?.gTitle || 'Untitled Game'}
            </Typography>
          </Tooltip>
          
          {/* Tags as hashtags */}
          <HashtagsContainer component="div">
            {gameTags.map((tagId, index) => (
              <StyledChip 
                key={`${game.moduleId}-tag-${index}`}
                label={`#${gameLibraryViewStore.getTag(tagId)}`}
                size="small"
              />
            ))}
            {gameTags.length === 0 && (
              <Typography 
                variant="caption" 
                component="div"
                sx={{ color: 'rgba(255,255,255,0.5)' }}
              >
                No tags
              </Typography>
            )}
          </HashtagsContainer>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default GameLibraryCard; 