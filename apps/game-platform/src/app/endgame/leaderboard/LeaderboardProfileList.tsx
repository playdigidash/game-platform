import React, { useEffect } from 'react';
import { Box, Typography, alpha, Tooltip } from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../../RootStore/RootStoreProvider';
import { useTheme } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { IGameProfile } from '@lidvizion/commonlib';

// Define an interface for the part object
interface ProfilePart {
  part: number;
  score: number;
}

interface LeaderboardProfileListProps {
  selectedLeaderboardPart: number;
}

export const LeaderboardProfileList: React.FC<LeaderboardProfileListProps> = observer(
  ({ selectedLeaderboardPart }) => {
    const { currUser } = useGameStore().gameLoginViewStore;
    const { 
      fetchAllTimeProfiles, 
      setAllTimeProfiles, 
      allTimeProfiles,
      sortedProfiles,
      setIsProfilesLoading,
      isProfilesLoading
    } = useGameStore().leaderboardViewStore;
    const { gameSession } = useGameStore().gameViewStore;
    const theme = useTheme();

    useEffect(() => {
      const fetchData = async () => {
        const allTimeProfiles = await fetchAllTimeProfiles();
        setAllTimeProfiles(allTimeProfiles);
      };
      fetchData();
    }, [fetchAllTimeProfiles, setAllTimeProfiles]);

    // Check if the displayed score is from current game session or a past high score
    const isCurrentGameScore = (profile: any, score: number): boolean => {
      if (!currUser?.uid || profile.uid !== currUser.uid || !gameSession) {
        return true; // Not current user or no game session
      }

      // For part-specific view, check if the current part score matches displayed score
      if (selectedLeaderboardPart > 0) {
        const currentSessionScore = gameSession.score;
        // If scores are within a small threshold (rounding differences), consider them the same
        return Math.abs(currentSessionScore - score) < 1;
      }
      
      // For total score view
      return Math.abs(gameSession.score - score) < 1;
    };

    // Get the appropriate score based on selected part
    const getScore = (profile: IGameProfile & { parts?: ProfilePart[] }): number => {
      if (selectedLeaderboardPart > 0) {
        // Find the score for the specific part
        const partData = profile.parts?.find(part => part.part === selectedLeaderboardPart);
        const score = partData ? Math.round(partData.score) : 0;
        return score;
      }
      
      // Return total score for all parts view
      const score = Math.round(profile.score || 0);
      return score;
    };

    
    return (
      <Box
        component="div"
        sx={{
          flex: '1 1 auto',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {sortedProfiles.map((profile: IGameProfile, index: number) => {
          const isCurrentUser = currUser?.uid && profile.uid === currUser.uid;
          const score = getScore(profile);
          
          // Check if this is a past high score for current user  
          const isPastHighScore = isCurrentUser && !isCurrentGameScore(profile, score);
          
          
          return (
            <Box
              component="div"
              key={`profile-${profile.uid}-${index}-${score}`}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                borderRadius: '0.5rem',
                backgroundColor: isCurrentUser 
                  ? alpha(theme.palette['primary'].main, 0.2) // Darker background for current user
                  : 'rgba(0, 0, 0, 0.1)',
                marginBottom: '0.5rem',
                padding: '0.5rem',
                border: isCurrentUser
                  ? `1px dashed ${alpha(theme.palette['primary'].main, 0.5)}`
                  : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: isCurrentUser ? 'bold' : 'normal',
                  color: theme.palette['text'].primary,
                }}
              >
                {index + 1}
              </Typography>
              <Box 
                component="div"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '60%',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: isCurrentUser ? 'bold' : 'normal',
                    color: theme.palette['text'].primary,
                    textAlign: 'center',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {profile.displayName}
                </Typography>
                
                {/* Show tooltip when displaying a past high score for current user */}
                {isPastHighScore && (
                  <Tooltip
                    title="The leaderboard lists your highest score!"
                    arrow
                    placement="top"
                  >
                    <HelpOutlineIcon 
                      sx={{ 
                        fontSize: '1rem', 
                        color: theme.palette['text'].secondary,
                        marginLeft: '0.25rem' 
                      }} 
                    />
                  </Tooltip>
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: isCurrentUser ? 'bold' : 'normal',
                  color: theme.palette['text'].primary,
                }}
              >
                {score} pts
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }
); 