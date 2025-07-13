import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Typography,
  Drawer,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useGameStore } from '../../../RootStore/RootStoreProvider';
import { GLBType, DefaultOrCustom } from '@lidvizion/commonlib';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

// Components
import {
  GamePreviewHeader,
  ActionBar,
  GameFeatureSection,
  DrawerContent,
  ActionMenuOption
} from '.';

// Default image as a constant URL
const DEFAULT_GAME_IMAGE = '/assets/images/dd-logo-white500x500.svg';

// Props interface
interface GamePreviewPanelProps {
  open: boolean;
  onClose: () => void;
}

// Additional styled components that don't conflict with imported components
const IconContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

// Main component
const GamePreviewPanel: React.FC<GamePreviewPanelProps> = observer(({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { gameLibraryViewStore } = useGameStore();
  const game = gameLibraryViewStore.activePreviewGame;
  
  // Local refs for UI interactions
  const descriptionRef = useRef<HTMLDivElement>(null);
  const gameDescriptionRef = useRef<HTMLDivElement>(null);
  const drawerContentRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);

  // Handle scroll events
  useEffect(() => {
    const gameDescription = gameDescriptionRef.current;
    if (!gameDescription) return;

    const handleScroll = () => {
      const scrollTop = gameDescription.scrollTop;
      const shouldExpand = scrollTop > 50; // Threshold for expansion
      
      if (shouldExpand && !gameLibraryViewStore.previewPanelExpanded) {
        gameLibraryViewStore.setPreviewPanelExpanded(true);
      } else if (!shouldExpand && gameLibraryViewStore.previewPanelExpanded && scrollTop === 0) {
        gameLibraryViewStore.setPreviewPanelExpanded(false);
      }
    };

    gameDescription.addEventListener('scroll', handleScroll);
    return () => {
      gameDescription.removeEventListener('scroll', handleScroll);
    };
  }, [gameLibraryViewStore]);

  // // Load organization info when game changes
  // useEffect(() => {
  //   if (game?.orgId) {
  //     const fetchName = async () => {
  //       try {
  //         const name = await gameLibraryViewStore.fetchOrganizationName(game.orgId);
  //         if (name) {
  //           gameLibraryViewStore.setCreatorName(name);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching organization name:', error);
  //       }
  //     };
  //     fetchName();
  //   }
  // }, [game, gameLibraryViewStore]);

  if (!game) return null;

  // Get game data
  const gameTitle = game?.settings?.gTitle || 'Game Preview';
  const gameDescription = game?.settings?.gDesc || 'No description available.';
  const gameImageUrl = game?.imgId 
    ? gameLibraryViewStore.getGameImage(game.moduleId) || DEFAULT_GAME_IMAGE
    : DEFAULT_GAME_IMAGE;
  const gameCreator = gameLibraryViewStore.orgName || 'Unknown Organization';

  // Action handlers
  const handlePlayGame = () => {
    gameLibraryViewStore.playSelectedGame();
    onClose();
  };
  
  const handleActionClick = (action: ActionMenuOption) => {
    gameLibraryViewStore.setShowActionMenu(false);
    
    switch (action) {
      case 'favorite':
        // Commented out favorites functionality as requested
        /*
        setIsFavorite(!isFavorite);
        if (game) {
          gameLibraryViewStore.toggleFavoriteGame(game.moduleId);
        }
        */
        break;
      case 'share':
        if (game) {
          gameLibraryViewStore.shareGame(game.moduleId);
        }
        // Notification is now handled in shareGame method
        break;
      case 'report':
        // Report functionality moved to ActionBar
        break;
    }
  };
  
  // Touch handlers for swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !drawerContentRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    // Only allow dragging down
    if (diff > 0) {
      drawerContentRef.current.style.transform = `translateY(${diff}px)`;
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startY.current || !drawerContentRef.current) return;
    
    const currentY = e.changedTouches[0].clientY;
    const diff = currentY - startY.current;
    
    // If dragged down more than 100px, close the drawer
    if (diff > 100) {
      drawerContentRef.current.style.transform = '';
      onClose();
    } else {
      // Otherwise, animate back to original position
      drawerContentRef.current.style.transform = '';
    }
    
    startY.current = null;
  };
  
  // Helper function for handle description click
  const handleDescriptionClick = () => {
    gameLibraryViewStore.setPreviewPanelExpanded(true);
    if (descriptionRef.current) {
      descriptionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            // maxHeight: '90vh',
            height: gameLibraryViewStore.previewPanelExpanded ? '90vh' : { xs: '90vh', sm: '90vh' },
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            transition: 'height 0.3s ease',
          }
        }}
      >
        <DrawerContent
          ref={drawerContentRef}
          onClose={onClose}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          gameDescriptionRef={gameDescriptionRef}
        >
          <GamePreviewHeader
            gameTitle={gameTitle}
            gameDescription={gameDescription}
            gameImageUrl={gameImageUrl}
            defaultGameImage={DEFAULT_GAME_IMAGE}
            onDescriptionClick={handleDescriptionClick}
            descriptionRef={descriptionRef}
            orgId={game.orgId}
          />

          {/* Game Features */}
          {game.avatars && game.avatars.length > 0 && (
            <GameFeatureSection
              title={<><PersonIcon /> Heroes</>}
              items={game.avatars}
              defaultImage={DEFAULT_GAME_IMAGE}
              itemNamePrefix="Avatar"
              featureType="avatar"
            />
          )}
          
          {game.selectedJump && game.selectedJump.length > 0 && (
            <GameFeatureSection
              title={<><KeyboardDoubleArrowUpIcon /> Jump Obstacles</>}
              items={game.selectedJump}
              defaultImage={DEFAULT_GAME_IMAGE}
              itemNamePrefix="Jump Obstacle"
              featureType="jump"
            />
          )}
          
          {game.selectedSlide && game.selectedSlide.length > 0 && (
            <GameFeatureSection
              title={<><KeyboardDoubleArrowDownIcon /> Duck Obstacles</>}
              items={game.selectedSlide}
              defaultImage={DEFAULT_GAME_IMAGE}
              itemNamePrefix="Duck Obstacle"
              featureType="duck"
            />
          )}
          
          {game.selectedDodge && game.selectedDodge.length > 0 && (
            <GameFeatureSection
              title={
                <>
                  <IconContainer>
                    <KeyboardDoubleArrowLeftIcon />
                    <KeyboardDoubleArrowRightIcon />
                  </IconContainer>
                  Dodge Obstacles
                </>
              }
              items={game.selectedDodge}
              defaultImage={DEFAULT_GAME_IMAGE}
              itemNamePrefix="Dodge Obstacle"
              featureType="dodge"
            />
          )}
        </DrawerContent>

        <ActionBar
          onPlayGame={handlePlayGame}
          onActionClick={handleActionClick}
          isFavorite={false}
          showActionMenu={gameLibraryViewStore.showActionMenu}
          toggleActionMenu={gameLibraryViewStore.toggleActionMenu}
          gameId={game?.moduleId}
        />
      </Drawer>
    </>
  );
});

export default GamePreviewPanel; 