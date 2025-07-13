import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Tooltip 
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SearchBar } from './SearchBar';

export interface GameLibraryAppBarProps {
  onBackClick: () => void;
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus: () => void;
  onSearchToggle: () => void;
  showSearch: boolean;
  isDesktop: boolean;
  onFilterToggle: (event: React.MouseEvent) => void;
  showFilterDropdown: boolean;
}

const StyledAppBar = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
}));

const FilterButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  color: 'white',
  padding: '0.5rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    color: theme.palette.secondary.light
  },
  marginLeft: theme.spacing(1)
}));

export const GameLibraryAppBar: React.FC<GameLibraryAppBarProps> = ({
  onBackClick,
  searchQuery,
  onSearchChange,
  onSearchFocus,
  onSearchToggle,
  showSearch,
  isDesktop,
  onFilterToggle,
  showFilterDropdown
}) => {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        {/* <IconButton
          edge="start"
          color="inherit"
          onClick={onBackClick}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton> */}
        
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            display: { xs: showSearch ? 'none' : 'block', sm: 'block' }
          }}
        >
          Game Home
        </Typography>
        
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearchFocus={onSearchFocus}
          onSearchToggle={onSearchToggle}
          showSearch={showSearch}
          isDesktop={isDesktop}
        />
        
        <Tooltip title="Filter games" arrow>
          <FilterButton 
            color="inherit" 
            aria-label="filter" 
            onClick={onFilterToggle}
            sx={{ color: showFilterDropdown ? 'secondary.light' : 'white' }}
          >
            <FilterListIcon sx={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }} />
          </FilterButton>
        </Tooltip>
      </Toolbar>
    </StyledAppBar>
  );
}; 