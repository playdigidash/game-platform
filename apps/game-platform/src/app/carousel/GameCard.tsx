import React from 'react';
import { Box, Typography } from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { gameCardStyles, gameImageStyles, playButtonStyles, titleOverlayStyles } from './CarouselProps';
import { ICustomModule } from '@lidvizion/commonlib';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { useGameStore } from '../RootStore/RootStoreProvider';

// Default image as a constant URL
const DEFAULT_GAME_IMAGE = '/assets/images/dd-logo-white500x500.svg';

interface GameCardProps {
  game: ICustomModule;
  index: number;
  onClick: (game: ICustomModule) => void;
  onMouseEnter: (moduleId: string) => void;
  onMouseLeave: (moduleId: string) => void;
  showDescription: boolean;
}

/**
 * GameCard component for the carousel
 */
export const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  index, 
  onClick, 
  onMouseEnter, 
  onMouseLeave, 
  showDescription 
}) => {
  const { carouselViewStore } = useGameStore();
  const imageUrl = carouselViewStore.getGameImage(game.moduleId) || DEFAULT_GAME_IMAGE;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DEFAULT_GAME_IMAGE;
  };

  return (
    <Box
      component="div"
      sx={gameCardStyles(false) as SxProps<Theme>}
      onClick={() => onClick(game)}
      onMouseEnter={() => onMouseEnter(game.moduleId)}
      onMouseLeave={() => onMouseLeave(game.moduleId)}
    >
      <Box
        component="div"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        } as SxProps<Theme>}
      >
        {/* Image container */}
        <Box 
          component="div" 
          sx={{ 
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          } as SxProps<Theme>}
        >
          <Box 
            component="img"
            src={imageUrl}
            alt={game.settings?.gTitle || 'Game'}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            } as SxProps<Theme>}
            onError={handleImageError}
          />
          
          {/* Gradient overlay */}
          <Box
            component="div"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '1rem',
            } as SxProps<Theme>}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.5)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '1.25rem',
              } as SxProps<Theme>}
            >
              {game.settings?.gTitle || 'Untitled Game'}
            </Typography>
          </Box>

          {/* Play button overlay */}
          <Box 
            component="div" 
            sx={{
              ...playButtonStyles,
              opacity: showDescription ? 1 : 0,
              visibility: showDescription ? 'visible' : 'hidden',
              // flexDirection: 'column',
              // gap: '0.5rem',
              // backgroundColor: 'rgba(0, 0, 0, 0.6)',
              // padding: '1rem',
              // width: 'auto',
              // height: 'auto',
            } as SxProps<Theme>}
          >
            <DirectionsRunIcon sx={{ fontSize: '2.5rem', color: 'white' }} />
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Tap to Play!
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GameCard; 