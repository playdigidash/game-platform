import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, CircularProgress, Typography, IconButton } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useGameStore } from '../RootStore/RootStoreProvider';
import GameCard from './GameCard';
import {
  ANIMATION_CONSTANTS,
  carouselContainerStyles,
  carouselContentStyles,
  gameCardStyles,
  loadingContainerStyles,
  createButtonStyles,
  createIconStyles,
  navArrowStyles,
} from './CarouselProps';


export const Carousel: React.FC = observer(() => {
  const { carouselViewStore } = useGameStore();
  const {
    games,
    loading,
    error,
    showDescription,
    setShowDescription,
    handleGameSelect,
    fetchGamesForCarousel,
  } = carouselViewStore;

  // Animation state
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const offsetRef = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Constants for animation
  const { NORMAL_SPEED, HOVER_SPEED, ITEM_WIDTH } = ANIMATION_CONSTANTS;
  const TOTAL_WIDTH = ITEM_WIDTH * games.length;
  const RESET_THRESHOLD = TOTAL_WIDTH;

  // Handle continuous animation
  const animate = (timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    
    if (!isDragging && carouselRef.current) {
      const speed = isHovered ? HOVER_SPEED : NORMAL_SPEED;
      offsetRef.current = (offsetRef.current + speed);

      // When we reach the point where the original set ends and duplicates begin,
      // reset back to the start without visual jump
      if (offsetRef.current >= RESET_THRESHOLD) {
        // Instead of immediately jumping to 0, we just reset to 0 to create a seamless loop
        offsetRef.current = 0;
        
        // Apply transform instantly without animation
        carouselRef.current.style.transition = 'none';
        carouselRef.current.style.transform = `translateX(0rem)`;
        
        // Force a reflow to ensure the transition is disabled before setting offsetRef
        void carouselRef.current.offsetWidth;
        
        // Continue from 0 with animation re-enabled
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = isDragging ? 'none' : 'transform 0.3s ease-out';
          }
        }, 10);
      } else {
        // Apply transform
        carouselRef.current.style.transform = `translateX(-${offsetRef.current}rem)`;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Set up continuous animation
  useEffect(() => {
    if (games.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, isDragging, games.length]);

  // Fetch games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      await fetchGamesForCarousel();
    };
    fetchGames();
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(offsetRef.current);
    
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX;
    const walk = (x - startX);
    let newOffset = scrollLeft - walk;

    // Wrap around when dragging
    if (newOffset < 0) {
      newOffset = RESET_THRESHOLD + newOffset;
    } else if (newOffset > RESET_THRESHOLD) {
      newOffset = newOffset % RESET_THRESHOLD;
    }

    offsetRef.current = newOffset;
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${newOffset}rem)`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'transform 0.3s ease-out';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleGameMouseEnter = (moduleId: string) => {
    setShowDescription(moduleId, true);
  };

  const handleGameMouseLeave = (moduleId: string) => {
    setShowDescription(moduleId, false);
  };

  // Navigation functions for arrow buttons
  const handlePrevClick = () => {
    if (!carouselRef.current) return;
    
    // Calculate the width of one card plus gap
    const cardWidth = ITEM_WIDTH;
    
    // Move back by one card width
    let newOffset = offsetRef.current - cardWidth;
    
    // Handle wrapping to the end if at the beginning
    if (newOffset < 0) {
      newOffset = TOTAL_WIDTH - cardWidth;
    }
    
    // Update offset and apply transform
    offsetRef.current = newOffset;
    carouselRef.current.style.transition = 'transform 0.3s ease-out';
    carouselRef.current.style.transform = `translateX(-${newOffset}rem)`;
  };

  const handleNextClick = () => {
    if (!carouselRef.current) return;
    
    // Calculate the width of one card plus gap
    const cardWidth = ITEM_WIDTH;
    
    // Move forward by one card width
    let newOffset = offsetRef.current + cardWidth;
    
    // Handle wrapping to the beginning if at the end
    if (newOffset >= TOTAL_WIDTH) {
      newOffset = 0;
    }
    
    // Update offset and apply transform
    offsetRef.current = newOffset;
    carouselRef.current.style.transition = 'transform 0.3s ease-out';
    carouselRef.current.style.transform = `translateX(-${newOffset}rem)`;
  };

  const handleCreateButtonClick = () => {
    window.open('https://create.playdigidash.io/wikiwidget/', '_blank');
  };

  // Loading state
  if (loading && games.length === 0) {
    return (
      <Box component="div" sx={loadingContainerStyles}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error && games.length === 0) {
    return (
      <Box component="div" sx={loadingContainerStyles}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  // Create a wrapped display array with duplicates for infinite scroll
  // We add the first few cards again at the end to create a seamless transition
  const visibleDuplicates = Math.min(games.length, 5); // Number of cards to duplicate at the end
  const displayGames = [...games, ...games.slice(0, visibleDuplicates)];

  return (
    <Box 
      component="div" 
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: '1.5rem',
        width: '100%',
        minHeight: '15rem',
        p: '1rem',
        overflow: 'hidden',
        backgroundColor: 'transparent'
      }}
    >
      {/* Main carousel container */}
      <Box 
        component="div" 
        sx={{
          ...carouselContainerStyles,
          flex: 1,
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: 'transparent'
        }}
      >
        {/* Left navigation arrow */}
        <IconButton
          onClick={handlePrevClick}
          sx={{
            ...navArrowStyles,
            left: '0.5rem',
          }}
          aria-label="Previous"
        >
          <ArrowBackIosNewIcon sx={{ color: '#ad00ff' }} />
        </IconButton>

        <Box 
          component="div"
          sx={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setIsHovered(true)}
        >
          <Box 
            ref={carouselRef}
            component="div" 
            sx={{
              ...carouselContentStyles,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            {displayGames.map((game, index) => (
              <GameCard
                key={`${game.moduleId}-${index}`}
                game={game}
                index={index}
                onClick={handleGameSelect}
                onMouseEnter={handleGameMouseEnter}
                onMouseLeave={handleGameMouseLeave}
                showDescription={!!showDescription[game.moduleId]}
              />
            ))}
          </Box>
        </Box>

        {/* Right navigation arrow */}
        <IconButton
          onClick={handleNextClick}
          sx={{
            ...navArrowStyles,
            right: '0.5rem',
          }}
          aria-label="Next"
        >
          <ArrowForwardIosIcon sx={{ color: '#ad00ff' }} />
        </IconButton>
      </Box>

      {/* Create button - side by side on desktop, underneath on mobile */}
      <Box
        component="div"
        onClick={handleCreateButtonClick}
        sx={{
          ...createButtonStyles,
          alignSelf: { xs: 'center', md: 'flex-start' },
          width: { xs: '100%', md: 'auto' }
        }}
      >
        <Box component="div" sx={createIconStyles}>
          <AutoFixHighIcon sx={{ fontSize: '2rem' }} />
        </Box>
        <Typography variant="h6" sx={{ color: '#ad00ff', textAlign: 'center' }}>
          Create a Dash!
        </Typography>
      </Box>
    </Box>
  );
});

export default Carousel; 