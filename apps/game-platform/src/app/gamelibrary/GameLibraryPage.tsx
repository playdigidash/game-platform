import React, { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../RootStore/RootStoreProvider';
import GamePreviewPanel from './components/preview-panel/GamePreviewPanel';
import { useWindowSize } from '../hooks/useWindowSize';
import { ICustomModule } from '@lidvizion/commonlib';
import { throttle } from 'lodash';

// Import components
import {
  GameLibraryHeader,
  GameGrid,
  GameLibraryAppBar,
  UserNameDisplay,
  ContentContainer
} from './components';
import RecentGamesSection from './RecentGamesSection';

export const GameLibraryPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const { gameLibraryViewStore, gameLoginViewStore, scoreViewStore } = useGameStore();
  const [showSearch, setShowSearch] = useState(false);
  const windowWidth = useWindowSize();
  const isDesktop = windowWidth >= 600;

  // Fetch all games and categories when component mounts
  useEffect(() => {
    gameLibraryViewStore.fetchAllGames();
    gameLibraryViewStore.fetchCategories();
    
    // If current user exists, set it in the carousel store and fetch recent games
    if (gameLoginViewStore.currUser) {
      gameLibraryViewStore.setCurrUser(gameLoginViewStore.currUser);
      gameLibraryViewStore.fetchRecentGames();
    }
  }, []);

  // Add another effect to watch for user changes
  useEffect(() => {
    if (gameLoginViewStore.currUser) {
      gameLibraryViewStore.setCurrUser(gameLoginViewStore.currUser);
      gameLibraryViewStore.fetchRecentGames();
    }
  }, [gameLoginViewStore.currUser]);

  // Implement infinite scrolling
  const handleScroll = useCallback(
    throttle(() => {
      // Check if we're near the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 200 &&
        !gameLibraryViewStore.loading
      ) {
        // Determine which fetch method to call based on whether a category is selected
        if (gameLibraryViewStore.selectedCategory && gameLibraryViewStore.hasMoreFilteredGames) {
          const nextPage = gameLibraryViewStore.currentPage + 1;
          gameLibraryViewStore.fetchFilteredGames(gameLibraryViewStore.selectedCategory, nextPage);
          gameLibraryViewStore.currentPage = nextPage;
        } else if (!gameLibraryViewStore.selectedCategory && gameLibraryViewStore.hasMoreGames) {
          const nextPage = gameLibraryViewStore.currentPage + 1;
          gameLibraryViewStore.fetchGames(nextPage);
          gameLibraryViewStore.currentPage = nextPage;
        }
      }
    }, 300),
    [gameLibraryViewStore.selectedCategory, gameLibraryViewStore.loading, gameLibraryViewStore.currentPage, 
     gameLibraryViewStore.hasMoreGames, gameLibraryViewStore.hasMoreFilteredGames]
  );

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // Cancel any pending throttled executions
    };
  }, [handleScroll]);

  // Event handlers
  const handleGameSelect = (game: ICustomModule) => {
    gameLibraryViewStore.handleGameSelect(game);
  };

  const handleFilterToggle = (event: React.MouseEvent) => {
    // Stop event propagation to prevent it from reaching the click-away listener
    event.preventDefault();
    event.stopPropagation();
    // Toggle the filter dropdown
    gameLibraryViewStore.toggleFilterDropdown();
  };

  const handleCategorySelect = (categoryId: string) => {
    gameLibraryViewStore.setSelectedCategory(categoryId);
    gameLibraryViewStore.closeFilterDropdown();
  };

  const handleResetFilter = () => {
    gameLibraryViewStore.setSelectedCategory(null);
  };

  const handleClickAway = () => {
    gameLibraryViewStore.closeFilterDropdown();
  };

  // Search handlers
  const handleSearchFocus = () => {
    gameLibraryViewStore.closeFilterDropdown();
    setShowSearch(true);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      gameLibraryViewStore.closeFilterDropdown();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    gameLibraryViewStore.setSearchQuery(event.target.value);
  };

  const handleClosePreviewPanel = () => {
    gameLibraryViewStore.closePreviewPanel();
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Get user display name safely
  const userDisplayName = gameLoginViewStore.currUser?.displayName || 
                          scoreViewStore.displayName ||
                          'Guest Player';

  // Filter out games without a title to ensure thumbnails display correctly
  const filterGamesWithTitles = (games: ICustomModule[]): ICustomModule[] => {
    return games.filter(game => 
      // Ensure game has required properties
      game.settings?.gTitle && 
      game.moduleId && 
      // Only exclude games where isDeleted is explicitly true
      // The property won't exist unless the user deleted it
      !(game.isDeleted === true)
    );
  }
  
  // Determine which games to display based on whether a category is selected
  const unfilteredGames = gameLibraryViewStore.selectedCategory 
    ? gameLibraryViewStore.filteredGames 
    : gameLibraryViewStore.games;
  
  // Apply additional filtering to ensure all games have proper titles
  const displayedGames = filterGamesWithTitles(unfilteredGames);

  return (
    <Box sx={{ flexGrow: 1, height: '100vh' }} component="div">
      {/* App Bar with Filter Button */}
      <GameLibraryAppBar
        onBackClick={handleBackClick}
        searchQuery={gameLibraryViewStore.searchQuery}
        onSearchChange={handleSearchChange}
        onSearchFocus={handleSearchFocus}
        onSearchToggle={handleSearchToggle}
        showSearch={showSearch}
        isDesktop={isDesktop}
        onFilterToggle={handleFilterToggle}
        showFilterDropdown={gameLibraryViewStore.showFilterDropdown}
      />
      
      {/* Main Content */}
      <ContentContainer>
        {/* User's display name */}
        <UserNameDisplay displayName={userDisplayName} />

        {/* Recently Played Games Section */}
        <RecentGamesSection />

        {/* Game Library Header (without filter button now) */}
        <GameLibraryHeader
          selectedCategory={gameLibraryViewStore.selectedCategory}
          showFilterDropdown={gameLibraryViewStore.showFilterDropdown}
          onCategorySelect={handleCategorySelect}
          onResetFilter={handleResetFilter}
          onClickAway={handleClickAway}
        />

        {/* Games Grid */}
        <GameGrid 
          games={displayedGames}
          loading={gameLibraryViewStore.loading}
          error={gameLibraryViewStore.error}
          selectedCategory={gameLibraryViewStore.selectedCategory}
          onGameSelect={handleGameSelect}
        />
      </ContentContainer>
      
      {/* Game Preview Panel */}
      <GamePreviewPanel 
        open={gameLibraryViewStore.showPreviewPanel}
        onClose={handleClosePreviewPanel}
      />
    </Box>
  );
});

export default GameLibraryPage; 