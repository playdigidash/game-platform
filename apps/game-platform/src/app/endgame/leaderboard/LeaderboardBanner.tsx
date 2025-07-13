import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { TrophyCanvas } from './trophy/TrophyCanvas';
import { LoginIconBtn } from '../../login/LoginIconBtn';
import { alpha } from '@mui/material/styles';

interface Top3ScoresBannerProps {
  module: string;
}

const Top3ScoresBanner: React.FC<Top3ScoresBannerProps> = ({ module }) => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { translatedGameData } = useGameStore().translateViewStore;

  const topScoresLabel = translatedGameData?.topScoresLabel || 'Top Scores';
  const noPlayerYetLabel = translatedGameData?.noPlayerYetLabel || 'No player yet';

  const {
    topProfiles,
    setTopProfiles,
    fetchTop3Profiles,
    allTimeProfiles,
  } = useGameStore().leaderboardViewStore;
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchTop3Profiles();
      setIsCollapsed(false);
    };
    fetchData();
  }, [
    fetchTop3Profiles]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      component="div"
      sx={{
        position: 'fixed',
        top: '0.5rem',
        left: '0.5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '0.5rem',
        boxShadow: theme.shadows[4],
        overflow: 'hidden',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'fit-content',
        transition: 'width 0.3s ease',
      }}
    >
      <Box
        component="div"
        onClick={toggleCollapse}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
      >
        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{
              fontSize: '0.875rem',
              color: theme.palette.text.primary,
              paddingLeft: '1em',
            }}
          >
            {topScoresLabel}
          </Typography>
        )}
        {isCollapsed && (
          <IconButton
            sx={{
              background: (theme) => alpha(theme.palette.primary.main, 0.2),
              backdropFilter: 'blur(0.3125rem)',
              '&:hover': {
                background: (theme) => alpha(theme.palette.primary.main, 0.3),
              },
              boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
              margin: '0.5rem',
            }}
          >
            <EmojiEventsIcon
              sx={{
                color: 'white',
                fontSize: '1.75rem',
              }}
            />
          </IconButton>
        )}
        <Box 
          component={'div'} 
          display={'flex'}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} 
        >
          <IconButton size="small" onClick={toggleCollapse}>
            {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
          <LoginIconBtn />
        </Box>
      </Box>
      {!isCollapsed && (
        <Box
          component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            px: '0.25rem',
            pb: '1rem',
          }}
        >
          {[
            {
              modelPath: '/assets/models/First_place_gold.glb',
              scale: [2.6, 2.6, 2.6],
              trophyName: 'Gold Trophy',
            },
            {
              modelPath: '/assets/models/Second_place_silver.glb',
              scale: [2, 2, 2],
              trophyName: 'Silver Trophy',
            },
            {
              modelPath: '/assets/models/third_place_bronze.glb',
              scale: [1.6, 1.6, 1.6],
              trophyName: 'Bronze Trophy',
            },
          ].map((trophy, index) => (
            <Box
              key={trophy.trophyName}
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <TrophyCanvas modelPath={trophy.modelPath} scale={trophy.scale} />

              {topProfiles[index] && (
                <Box component="div" sx={{ marginTop: '0.15rem' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1rem',
                      color: theme.palette.text.primary,
                      maxWidth: '30vw',
                      whitespace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {topProfiles[index].displayName || `Player ${String(topProfiles[index].uid).substring(0, 6)}`}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: theme.palette.text.primary,
                    }}
                  >
                    {Math.round(topProfiles[index].score || 0)} pts
                  </Typography>
                </Box>
              )}
              {!topProfiles[index] && (
                <Box component="div" sx={{ marginTop: '0.15rem' }}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: theme.palette.text.secondary,
                      fontStyle: 'italic'
                    }}
                  >
                    {noPlayerYetLabel}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default observer(Top3ScoresBanner);
