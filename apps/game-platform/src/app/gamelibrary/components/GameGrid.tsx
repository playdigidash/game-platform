import React from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  CircularProgress
} from '@mui/material';
import { ICustomModule } from '@lidvizion/commonlib';
import GameCard from '../GameLibraryCard';

export interface GameGridProps {
  games: ICustomModule[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  onGameSelect: (game: ICustomModule) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ 
  games, 
  loading, 
  error, 
  selectedCategory, 
  onGameSelect 
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }} component="div">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 5, textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }
  
  if (games.length === 0) {
    return (
      <Typography 
        variant="h6" 
        sx={{ 
          mt: 5, 
          width: '100%', 
          textAlign: 'center',
          color: 'white'
        }}
      >
        {selectedCategory 
          ? 'No games found in this category. Try another filter!'
          : 'No games available. Check back later!'}
      </Typography>
    );
  }
  
  return (
    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
      {games.map((game, index) => (
        <Grid item xs={6} sm={6} md={4} lg={3} key={`${game.moduleId}-${index}`}>
          <GameCard game={game} onClick={onGameSelect} />
        </Grid>
      ))}
    </Grid>
  );
}; 