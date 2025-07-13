import React from 'react';
import { 
  Box, 
  InputBase,
  IconButton
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { SxProps } from '@mui/system';

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus: () => void;
  onSearchToggle: () => void;
  showSearch: boolean;
  isDesktop: boolean;
}

const SearchContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledSearchInput = styled(InputBase)(({ theme }: { theme: Theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchFocus,
  onSearchToggle,
  showSearch,
  isDesktop
}) => {
  return (
    <Box 
      component="div"
      sx={{ 
        display: 'flex', 
        alignItems: 'center' 
      } as SxProps<Theme>}
    >
      {(showSearch || isDesktop) && (
        <SearchContainer>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledSearchInput
            placeholder="Search games..."
            value={searchQuery}
            onChange={onSearchChange}
            onFocus={onSearchFocus}
            inputProps={{ 'aria-label': 'search' }}
            autoFocus={showSearch}
          />
        </SearchContainer>
      )}
      {!isDesktop && (
        <IconButton 
          color="inherit" 
          aria-label="search"
          onClick={onSearchToggle}
          sx={{ ml: 1 }}
        >
          <SearchIcon />
        </IconButton>
      )}
    </Box>
  );
}; 