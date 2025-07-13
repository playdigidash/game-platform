import React, { useRef, useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Typography, 
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { useGameStore } from '../../../RootStore/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import FeedbackForm from './FeedbackForm';

// Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import FlagIcon from '@mui/icons-material/Flag';

// Types for action menu
export type ActionMenuOption = 'favorite' | 'share' | 'report';

// Styled components
const ActionBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  background: alpha('#000', 0.5),
  backdropFilter: 'blur(10px)',
  position: 'sticky',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 100,
}));

const PlayButton = styled(Button)(({ theme }) => ({
  borderRadius: '2rem',
  padding: '0.75rem 2rem',
  fontSize: '1.125rem',
  fontWeight: 'bold',
  textTransform: 'none',
  background: 'linear-gradient(90deg, #7928CA, #FF0080)',
  color: 'white',
  boxShadow: '0 0.25rem 1rem rgba(0,0,0,0.2)',
  flexGrow: 1,
  marginLeft: '1rem',
  height: '3.5rem',
  '&:hover': {
    background: 'linear-gradient(90deg, #6923b5, #e50073)',
    boxShadow: '0 0.25rem 1.25rem rgba(0,0,0,0.3)',
  },
}));

const MenuContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
}));

const ActionMenuOptions = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  bottom: '100%',
  left: 0,
  width: '10rem',
  background: '#1E1E2D',
  borderRadius: '0.5rem',
  overflow: 'hidden',
  zIndex: 1100,
  boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.3)',
  marginBottom: '0.5rem',
}));

const ActionMenuItem = styled(Box)(({ theme }) => ({
  padding: '0.75rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  userSelect: 'none',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  '&:active': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

// Menu item styling
const StyledShareMenuItem = styled(ActionMenuItem)`
  &:active {
    background-color: ${({ theme }) => alpha('#FF0080', 0.2)};
  }
  position: relative;
  z-index: 1101;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.2)};
  }
  
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`;

// Reuse same styling for report menu item
const StyledReportMenuItem = styled(StyledShareMenuItem)``;

interface ActionBarProps {
  onPlayGame: () => void;
  onActionClick: (action: ActionMenuOption) => void;
  isFavorite: boolean;
  showActionMenu: boolean;
  toggleActionMenu: () => void;
  gameId?: string; // Add optional gameId prop
}

export const ActionBar: React.FC<ActionBarProps> = observer(({
  onPlayGame,
  onActionClick,
  isFavorite,
  showActionMenu,
  toggleActionMenu,
  gameId
}) => {
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const { gameLibraryViewStore, feedbackModalViewStore } = useGameStore();
  // Handle click outside to close menu
  useEffect(() => {
    if (!showActionMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current && 
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        gameLibraryViewStore.setShowActionMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionMenu, gameLibraryViewStore]);

  // Handle direct sharing from ActionBar
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    
    // Close the action menu
    gameLibraryViewStore.setShowActionMenu(false);
    
    // If we have a gameId, use it, otherwise fallback to active preview game
    if (gameId) {
      gameLibraryViewStore.shareGame(gameId);
    } else if (gameLibraryViewStore.activePreviewGame?.moduleId) {
      gameLibraryViewStore.shareGame(gameLibraryViewStore.activePreviewGame.moduleId);
    }
  };

  // Handle direct reporting from ActionBar
  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    
    // Close the action menu first
    gameLibraryViewStore.setShowActionMenu(false);
    
    // Store the game ID for reporting - if gameId prop exists, use it, otherwise use active game
    const reportGameId = gameId || gameLibraryViewStore.activePreviewGame?.moduleId;
    
    if (!reportGameId) {
      return;
    }
    
    // Store the gameId for the feedback form to use
    localStorage.setItem('feedbackGameId', reportGameId);
    
    // Add a small delay to ensure menu is closed before opening modal
    setTimeout(() => {
      feedbackModalViewStore.setTopic('Other');
      feedbackModalViewStore.setShowFeedbackModal(true);
    }, 50);
  };

  // Handle form submission with success message
  const handleSubmitFeedback = () => {
    feedbackModalViewStore.handleSubmitFeedback();
    feedbackModalViewStore.setShowFeedbackModal(false);
    gameLibraryViewStore.setSnackbarMessage('Feedback submitted successfully!');
    gameLibraryViewStore.setShowSnackbar(true);
  };

  // Handle play button click
  const handlePlayClick = () => {
    onPlayGame();
  };

  // Handle menu toggle
  const handleToggleMenu = () => {
    toggleActionMenu();
  };

  // Get active game details
  const activeGame = gameLibraryViewStore.activePreviewGame;
  const activeGameId = gameId || activeGame?.moduleId;
  const gameTitle = activeGame?.settings?.gTitle || 'Game';

  return (
    <>
      <ActionBarContainer onClick={(e) => e.stopPropagation()}>
        <MenuContainer onMouseDown={(e) => e.stopPropagation()}>
          <IconButton 
            onClick={handleToggleMenu} 
            sx={{ color: 'white' }}
          >
            <MoreVertIcon />
          </IconButton>
          
          {showActionMenu && (
            <ActionMenuOptions 
              ref={actionMenuRef}
              onClick={(e) => e.stopPropagation()} 
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* <ActionMenuItem onClick={() => onActionClick('favorite')}>
                {isFavorite ? <StarIcon sx={{ color: '#FFD700' }} /> : <StarBorderIcon />}
                <Typography variant="body2" color="white">
                  {isFavorite ? 'Unfavorite' : 'Favorite'}
                </Typography>
              </ActionMenuItem> */}
              
              <StyledShareMenuItem 
                onClick={handleShareClick}
                onMouseDown={(e) => e.stopPropagation()}
                data-testid="share-menu-item"
              >
                <ShareIcon />
                <Typography variant="body2" color="white">
                  Share
                </Typography>
              </StyledShareMenuItem>
              
              <StyledReportMenuItem 
                onClick={handleReportClick}
                onMouseDown={(e) => e.stopPropagation()}
                data-testid="report-menu-item"
              >
                <FlagIcon />
                <Typography variant="body2" color="white">
                  Report
                </Typography>
              </StyledReportMenuItem>
            </ActionMenuOptions>
          )}
        </MenuContainer>
        
        <PlayButton
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={handlePlayClick}
        >
          Play Now
        </PlayButton>
      </ActionBarContainer>

      {/* Use the dedicated FeedbackForm component */}
      <FeedbackForm
        open={feedbackModalViewStore.showFeedbackModal}
        onClose={() => feedbackModalViewStore.setShowFeedbackModal(false)}
        gameTitle={gameTitle}
        gameId={activeGameId}
        email={feedbackModalViewStore.email}
        description={feedbackModalViewStore.description}
        onEmailChange={feedbackModalViewStore.setEmail}
        onDescriptionChange={feedbackModalViewStore.setDescription}
        onSubmit={handleSubmitFeedback}
        setTopic={feedbackModalViewStore.setTopic}
      />

      {/* Snackbar notifications */}
      <Snackbar
        open={gameLibraryViewStore.showSnackbar}
        autoHideDuration={4000}
        onClose={() => gameLibraryViewStore.setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => gameLibraryViewStore.setShowSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {gameLibraryViewStore.snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}); 