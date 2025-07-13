import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper,
  Tooltip,
  ClickAwayListener,
  Grow,
  Backdrop,
  Theme,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import PaletteIcon from '@mui/icons-material/Palette';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BusinessIcon from '@mui/icons-material/Business';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import WorkIcon from '@mui/icons-material/Work';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LanguageIcon from '@mui/icons-material/Language';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ComputerIcon from '@mui/icons-material/Computer';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { CATEGORIES, categoryBubbleStyles } from '../../GameLibraryProps';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../../RootStore/RootStoreProvider';

export interface FilterDropdownProps {
  open: boolean;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  onResetFilter: () => void;
  onClickAway: () => void;
}

const FilterDropdown = styled(Paper)(({ theme }) => ({
  width: 'min(40rem, 90vw)',
  maxHeight: 'min(35rem, 80vh)',
  overflowY: 'auto',
  backgroundColor: 'rgba(0, 0, 0, 0.95)',
  backdropFilter: 'blur(0.625rem)',
  borderRadius: '1rem',
  boxShadow: '0 0.5rem 2rem rgba(0,0,0,0.7)',
  padding: '2rem',
  zIndex: 1300,
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    width: '90vw',
    padding: '1.5rem 1rem',
    maxHeight: '80vh',
  }
}));

const DropdownContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '64px', // Height of the AppBar
  right: '0',
  left: '0',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 1300,
  [theme.breakpoints.down('sm')]: {
    top: '56px', // Mobile AppBar height
  }
}));

const CategoryGridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  width: '100%',
  gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))',
  gap: '1.5rem',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(6.5rem, 1fr))',
    gap: '0.75rem'
  },
  [theme.breakpoints.down('xs')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(5.5rem, 1fr))',
    gap: '0.5rem'
  }
}));

// Enhanced category bubble styles
const enhancedCategoryBubbleStyles = (isSelected: boolean) => ({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem 1rem',
  borderRadius: '1rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: isSelected ? 'rgba(121, 40, 202, 0.8)' : 'rgba(30, 30, 45, 0.8)',
  color: 'white',
  gap: '0.75rem',
  boxShadow: isSelected 
    ? '0 0.25rem 1rem rgba(121, 40, 202, 0.5)' 
    : '0 0.25rem 0.75rem rgba(0, 0, 0, 0.3)',
  '&:hover': {
    backgroundColor: isSelected 
      ? 'rgba(121, 40, 202, 0.9)' 
      : 'rgba(50, 50, 70, 0.9)',
    transform: 'translateY(-0.25rem)',
    boxShadow: isSelected 
      ? '0 0.5rem 1.5rem rgba(121, 40, 202, 0.6)' 
      : '0 0.5rem 1rem rgba(0, 0, 0, 0.4)',
  },
  '& svg': {
    fontSize: '2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
    },
  },
  '& .MuiTypography-root': {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '0.5rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem',
    },
  }
});

// Define a type-safe category mapping
type CategoryId = 
  | 'C001' | 'C002' | 'C003' | 'C004' | 'C005' | 'C006' | 'C007' | 'C008' 
  | 'C009' | 'C010' | 'C011' | 'C012' | 'C013' | 'C014' | 'C015' | 'C016';

interface CategoryMapping {
  id: CategoryId;
  shortName: string;
  icon: React.ReactElement;
}

const categoryMappings: CategoryMapping[] = [
  { id: 'C001', shortName: 'Arts', icon: <PaletteIcon /> },
  { id: 'C002', shortName: 'STEM', icon: <ScienceIcon /> },
  { id: 'C003', shortName: 'Humanities', icon: <MenuBookIcon /> },
  { id: 'C004', shortName: 'Business', icon: <BusinessIcon /> },
  { id: 'C005', shortName: 'Wellness', icon: <FitnessCenterIcon /> },
  { id: 'C006', shortName: 'Games', icon: <SportsEsportsIcon /> },
  { id: 'C007', shortName: 'Professional', icon: <WorkIcon /> },
  { id: 'C008', shortName: 'Space', icon: <RocketLaunchIcon /> },
  { id: 'C009', shortName: 'Mythology', icon: <AutoStoriesIcon /> },
  { id: 'C010', shortName: 'Languages', icon: <LanguageIcon /> },
  { id: 'C011', shortName: 'Current', icon: <NewspaperIcon /> },
  { id: 'C012', shortName: 'Technology', icon: <ComputerIcon /> },
  { id: 'C013', shortName: 'Sports', icon: <SportsSoccerIcon /> },
  { id: 'C014', shortName: 'Campus', icon: <SchoolIcon /> },
  { id: 'C015', shortName: 'Thinking', icon: <PsychologyIcon /> },
  { id: 'C016', shortName: 'Ethics', icon: <AccountBalanceIcon /> }
];

// Helper function to get category info
const getCategoryInfo = (categoryId: string): CategoryMapping => {
  const mapping = categoryMappings.find(m => m.id === categoryId);
  return mapping || { id: categoryId as CategoryId, shortName: 'Other', icon: <SportsEsportsIcon /> };
};

// Styled category item
const CategoryItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem 1rem',
  borderRadius: '1rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: isSelected ? 'rgba(121, 40, 202, 0.8)' : 'rgba(30, 30, 45, 0.8)',
  color: 'white',
  gap: '0.75rem',
  boxShadow: isSelected 
    ? '0 0.25rem 1rem rgba(121, 40, 202, 0.5)' 
    : '0 0.25rem 0.75rem rgba(0, 0, 0, 0.3)',
  '&:hover': {
    backgroundColor: isSelected 
      ? 'rgba(121, 40, 202, 0.9)' 
      : 'rgba(50, 50, 70, 0.9)',
    transform: 'translateY(-0.25rem)',
    boxShadow: isSelected 
      ? '0 0.5rem 1.5rem rgba(121, 40, 202, 0.6)' 
      : '0 0.5rem 1rem rgba(0, 0, 0, 0.4)',
  },
  '& svg': {
    fontSize: '2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
    },
  },
  '& .MuiTypography-root': {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '0.5rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem',
    },
  }
}));

// Add this component for the loading state
const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  padding: '1rem'
});

export const CategoryFilterDropdown: React.FC<FilterDropdownProps> = observer(({ 
  open, 
  selectedCategory,
  onCategorySelect,
  onResetFilter,
  onClickAway
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { gameLibraryViewStore } = useGameStore();

  // Handle click away more carefully
  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    // If the event target is the filter button or its children, ignore it
    const filterBtn = document.querySelector('[aria-label="filter"]');
    if (filterBtn && (filterBtn === event.target || filterBtn.contains(event.target as Node))) {
      return;
    }
    
    // Otherwise, handle the click away normally
    onClickAway();
  };

  const renderContent = () => {
    if (gameLibraryViewStore.loadingCategories) {
      return (
        <LoadingContainer>
          <CircularProgress sx={{ color: 'white' }} />
        </LoadingContainer>
      );
    }

    return gameLibraryViewStore.categories.map((category) => {
      const categoryId = category.CategoryID;
      if (!categoryId) return null;

      const categoryInfo = getCategoryInfo(categoryId);

      return (
        <CategoryItem
          key={categoryId}
          isSelected={selectedCategory === categoryId}
          onClick={() => onCategorySelect(categoryId)}
        >
          {categoryInfo.icon}
          <Typography 
            variant="body1"
            className="MuiTypography-root"
            sx={{
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
              fontSize: isMobile ? '0.75rem' : '1rem'
            }}
          >
            {categoryInfo.shortName}
          </Typography>
        </CategoryItem>
      );
    });
  };

  if (!open) return null;

  return (
    <>
      <Backdrop
        open={open}
        sx={{ 
          zIndex: 1200, 
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(3px)'
        }}
        onClick={onClickAway}
      />
      <ClickAwayListener onClickAway={handleClickAway}>
        <DropdownContainer>
          <Grow 
            in={open} 
            style={{ transformOrigin: 'top center' }}
            timeout={{
              enter: 400,
              exit: 300
            }}
          >
            <FilterDropdown onClick={(e) => e.stopPropagation()}>
              <Box 
                component="div" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative',
                  mb: isMobile ? 2 : 3
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    fontSize: isMobile ? '1.125rem' : 'clamp(1.25rem, 2vw, 1.75rem)',
                    pr: selectedCategory ? 4 : 0
                  }}
                >
                  Filter by Category
                </Typography>
                
                {selectedCategory && (
                  <Tooltip title="Reset filter" arrow>
                    <IconButton 
                      size={isMobile ? "small" : "medium"}
                      onClick={onResetFilter}
                      sx={{ 
                        position: 'absolute',
                        right: 0,
                        color: 'white',
                        p: isMobile ? 0.5 : 1
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              <CategoryGridContainer>
                {renderContent()}
              </CategoryGridContainer>
            </FilterDropdown>
          </Grow>
        </DropdownContainer>
      </ClickAwayListener>
    </>
  );
}); 