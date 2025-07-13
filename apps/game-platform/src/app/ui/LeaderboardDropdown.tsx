import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Box, Typography, useTheme, Collapse } from '@mui/material';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { TrophyCanvas } from '../endgame/leaderboard/trophy/TrophyCanvas';

interface LeaderboardDropdownProps {
  module: string;
  isOpen: boolean;
}

export const LeaderboardDropdown: React.FC<LeaderboardDropdownProps> = observer(({ module, isOpen }) => {
  const theme = useTheme();
  const { translatedGameData } = useGameStore().translateViewStore;

  const topScoresLabel = translatedGameData?.topScoresLabel || 'Top Scores';
  const noPlayerYetLabel = translatedGameData?.noPlayerYetLabel || 'No player yet';

  const {
    topProfiles,
    fetchTop3Profiles,
  } = useGameStore().leaderboardViewStore;
  
  useEffect(() => {
    if (isOpen) {
      fetchTop3Profiles();
    }
  }, [isOpen, fetchTop3Profiles]);

  return (
    <Collapse in={isOpen}>
             <Box
         component="div"
         sx={{
           position: 'absolute',
           top: '100%',
           right: 0,
           mt: '0.5rem',
           backgroundColor: 'rgba(0, 0, 50, 0.9)',
           borderRadius: '1rem',
           backdropFilter: 'blur(0.3125rem)',
           boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
           overflow: 'hidden',
           zIndex: 1001,
           minWidth: '22rem',
           maxWidth: '28rem',
           width: 'max-content',
         }}
       >
        {/* Header */}
        <Box
          component="div"
          sx={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '0.875rem',
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {topScoresLabel}
          </Typography>
        </Box>

        {/* Leaderboard Content */}
        <Box
          component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '1rem',
            maxHeight: '20rem',
            overflowY: 'auto',
          }}
        >
          {[
            {
              modelPath: '/assets/models/First_place_gold.glb',
              scale: [2.6, 2.6, 2.6],
              trophyName: 'Gold Trophy',
              position: '1st',
            },
            {
              modelPath: '/assets/models/Second_place_silver.glb',
              scale: [2, 2, 2],
              trophyName: 'Silver Trophy',
              position: '2nd',
            },
            {
              modelPath: '/assets/models/third_place_bronze.glb',
              scale: [1.6, 1.6, 1.6],
              trophyName: 'Bronze Trophy',
              position: '3rd',
            },
          ].map((trophy, index) => (
            <Box
              key={trophy.trophyName}
              component="div"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {/* Trophy */}
              <Box
                component="div"
                sx={{
                  width: '3rem',
                  height: '3rem',
                  flexShrink: 0,
                }}
              >
                <TrophyCanvas modelPath={trophy.modelPath} scale={trophy.scale} />
              </Box>

              {/* Player Info */}
              <Box
                component="div"
                sx={{
                  flex: 1,
                  minWidth: 0, // Allow text to truncate properly
                }}
              >
                {topProfiles[index] ? (
                  <>
                                         <Typography
                       variant="h6"
                       sx={{
                         fontSize: '0.875rem',
                         color: 'white',
                         fontWeight: 'bold',
                         marginBottom: '0.25rem',
                         wordBreak: 'break-word',
                         lineHeight: 1.2,
                       }}
                     >
                       {topProfiles[index].displayName || `Player ${String(topProfiles[index].uid).substring(0, 6)}`}
                     </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {Math.round(topProfiles[index].score || 0)} pts
                    </Typography>
                  </>
                ) : (
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontStyle: 'italic',
                    }}
                  >
                    {noPlayerYetLabel}
                  </Typography>
                )}
              </Box>

              {/* Position */}
              <Box
                component="div"
                sx={{
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 'bold',
                  }}
                >
                  {trophy.position}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Collapse>
  );
}); 