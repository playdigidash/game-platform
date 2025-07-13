import React, { useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Paper,
  alpha,
  styled,
  Theme 
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../RootStore/RootStoreProvider';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import HistoryIcon from '@mui/icons-material/History';
import { IRecentGameSession } from '../gamelibrary/GameLibraryViewStore';

// Default image as a constant URL
const DEFAULT_GAME_IMAGE = '/assets/images/dd-logo-white500x500.svg';

// Styled containers
const RecentGamesSectionContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  marginBottom: theme.spacing(4),
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(3),
  },
}));

const SectionHeader = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
}));

const ScrollableContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  scrollbarWidth: 'none', // Firefox
  '&::-webkit-scrollbar': {
    display: 'none', // Chrome, Safari, Edge
  },
  paddingBottom: theme.spacing(1), // Add padding to avoid clipping box-shadow
  WebkitOverflowScrolling: 'touch', // Enable momentum scrolling on iOS
}));

const GameCard = styled(Paper)(({ theme }: { theme: Theme }) => ({
  flex: '0 0 auto',
  width: 'min(14rem, 70vw)', // Responsive width
  marginRight: theme.spacing(2),
  borderRadius: '0.625rem',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.8)}, ${alpha(theme.palette.secondary.dark, 0.8)})`,
  backdropFilter: 'blur(0.625rem)',
  boxShadow: '0 0.25rem 0.75rem rgba(0,0,0,0.2)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-0.25rem)',
    boxShadow: '0 0.375rem 1rem rgba(0,0,0,0.3)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  [theme.breakpoints.down('sm')]: {
    width: 'min(12rem, 65vw)',
    marginRight: theme.spacing(1.5),
  },
}));

const GameImageContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  position: 'relative',
  paddingTop: '56.25%', // 16:9 Aspect Ratio
  backgroundColor: 'rgba(0,0,0,0.2)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const ScoreOverlay = styled(Box)(({ theme }: { theme: Theme }) => ({
  position: 'absolute',
  top: '0.5rem',
  right: '0.5rem',
  padding: '0.25rem 0.5rem',
  borderRadius: '1rem',
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  fontSize: '0.75rem',
  fontWeight: 'bold',
}));

const PlayOverlay = styled(Box)(({ theme }: { theme: Theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.4)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1,
  },
}));

const GameContent = styled(Box)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const EmptyState = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.paper, 0.1),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
}));

// Add this constant near other styled components to simplify the complex Box styling
const PlayIconContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: 'white',
  textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.5)'
}));

const RecentGamesSection: React.FC = observer(() => {
  const { gameLibraryViewStore, gameLoginViewStore } = useGameStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Set up user when component mounts
  React.useEffect(() => {
    if (gameLoginViewStore.currUser && !gameLibraryViewStore.currUser) {
      gameLibraryViewStore.setCurrUser(gameLoginViewStore.currUser);
    }
  }, [gameLoginViewStore.currUser, gameLibraryViewStore]);


  // Type-safe event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleGameSelect = (gameUrl: string) => {
    // Find the corresponding game module from the store
    const gameModule = gameLibraryViewStore.games.find(game => 
      game.settings?.url === gameUrl || game.moduleId === gameUrl
    );
    
    if (gameModule) {
      // Use the same preview panel logic as the game library
      gameLibraryViewStore.handleGameSelect(gameModule);
    } else {
      // Fallback to direct URL if game module not found
      window.open(`/${gameUrl}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Format the timestamp to a readable date
  const formatTimestamp = (timestamp: number | null | undefined) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // If user is not logged in or no recent games
  if (!gameLibraryViewStore.currUser || gameLibraryViewStore.recentGames.length === 0) {
    return null; // Don't show this section at all
  }

  return (
    <RecentGamesSectionContainer>
      <SectionHeader>
        <HistoryIcon sx={{ color: 'white' }} />
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            fontSize: { xs: '1.125rem', sm: '1.375rem', md: '1.5rem' }
          }}
        >
          Recent
        </Typography>
      </SectionHeader>

      {gameLibraryViewStore.loadingRecentGames ? (
        <Box 
          component="div"
          sx={{ display: 'flex', justifyContent: 'center', py: 3 }}
        >
          <CircularProgress size={32} />
        </Box>
      ) : gameLibraryViewStore.uniqueGamesWithHighestScores.length === 0 ? (
        <EmptyState>
          <Typography variant="body1">No recent games played</Typography>
        </EmptyState>
      ) : (
        <ScrollableContainer
          ref={scrollContainerRef}
          component="div"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
        >
          {gameLibraryViewStore.uniqueGamesWithHighestScores.map((game) => (
            <GameCard 
              key={game.gameId || game.sessionId} 
              onClick={() => handleGameSelect(game.gameUrl || '')}
              elevation={3}
            >
              <GameImageContainer 
                component="div"
                sx={{ 
                  backgroundImage: `url(${game.imageUrl || DEFAULT_GAME_IMAGE})` 
                }}
              >
                {game.score !== undefined && game.score > 0 && (
                  <ScoreOverlay component="div">
                    {Math.round(game.score)} pts
                  </ScoreOverlay>
                )}
                <PlayOverlay component="div">
                  <PlayIconContainer>
                    <DirectionsRunIcon sx={{ fontSize: '2rem' }} />
                    <Typography variant="caption">Play</Typography>
                  </PlayIconContainer>
                </PlayOverlay>
              </GameImageContainer>
              <GameContent component="div">
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'white',
                    mb: 0.5,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {game.gameTitle || 'Unknown Game'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    display: 'block',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  {game.isCompleted ? 'Completed' : 'In Progress'} • {formatTimestamp(game.endTime || game.gameEntryTime)}
                </Typography>
              </GameContent>
            </GameCard>
          ))}
        </ScrollableContainer>
      )}
    </RecentGamesSectionContainer>
  );
});

export default RecentGamesSection; 