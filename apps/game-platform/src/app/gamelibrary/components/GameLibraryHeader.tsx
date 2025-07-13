import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { CategoryFilterDropdown } from './top-bar/CategoryFilterDropdown';

export interface GameLibraryHeaderProps {
  selectedCategory: string | null;
  showFilterDropdown: boolean;
  onCategorySelect: (categoryId: string) => void;
  onResetFilter: () => void;
  onClickAway: () => void;
}

const HeaderContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
  [theme.breakpoints.up('sm')]: {
    marginBottom: '1.5rem'
  }
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontWeight: 'bold',
  borderBottom: '0.125rem solid',
  borderImage: 'linear-gradient(to right, #ad00ff, #00e0ff) 1',
  paddingBottom: '0.5rem',
  fontSize: 'clamp(1.25rem, 4vw, 2.5rem)',
  lineHeight: '1.2',
  letterSpacing: '-0.02em',
  transition: 'all 0.3s ease'
}));

export const GameLibraryHeader: React.FC<GameLibraryHeaderProps> = ({
  selectedCategory,
  showFilterDropdown,
  onCategorySelect,
  onResetFilter,
  onClickAway
}) => {
  return (
    <HeaderContainer>
      <HeaderTitle variant="h4">
        Game Library {selectedCategory && '(Filtered)'}
      </HeaderTitle>
      
      {showFilterDropdown && (
        <CategoryFilterDropdown
          open={showFilterDropdown}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          onResetFilter={onResetFilter}
          onClickAway={onClickAway}
        />
      )}
    </HeaderContainer>
  );
}; 