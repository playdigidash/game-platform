import { ILeaderboardUserModel } from '@lidvizion/commonlib';
import { Avatar, Box, Card, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react';
import crown from './assets/crown.svg';
import { LeaderboardSingleLine } from './LeaderboardSingleLine';
import { TimeTabs } from './TimeTabs';
import milksvg from './assets/milk.svg';

interface ILeaderboard {
  leaderboardList: ILeaderboardUserModel[];
  currentLeaderboardUser: ILeaderboardUserModel | null;
}

export const Leaderboard: React.FC<ILeaderboard> = observer(
  ({ leaderboardList, currentLeaderboardUser }) => {
    const theme = useTheme();

    const iconBoxStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    };

    const avatarBoxStyle = {
      height: 65,
      display: 'flex',
      alignItems: 'center',
    };

    const textNameStyle = {
      color: theme.palette.secondary.contrastText,
    };

    const textPtStyle = {
      color: theme.palette.grey[700],
    };

    return (
      <Box
        component="div"
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        alignSelf={'stretch'}
        marginBottom={10}
      >
        <Typography variant="h5">Leaderboard</Typography>
        <TimeTabs />
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'stretch',
            margin: 2,
            borderRadius: 10,
            background: `linear-gradient(105deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          }}
        >
          <Box
            component="div"
            display={'flex'}
            gap={2}
            marginBottom={2}
            alignItems={'center'}
          >
            <Box
              component="div"
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <img src={crown} alt="crown-first-place" width={40} height={40} />
              <Box
                component="div"
                display={'flex'}
                alignItems={'center'}
                gap={2}
              >
                <Box component="div" sx={iconBoxStyle}>
                  <Box component="div" sx={avatarBoxStyle}>
                    <Avatar sx={{ height: 65, width: 65 }} />
                  </Box>
                  <Typography variant={'h6'} sx={textNameStyle}>
                    {leaderboardList[1]?.name || 'no name'}
                  </Typography>
                  <Typography sx={textPtStyle}>
                    {`${leaderboardList[1]?.points || 'no'} pts`}
                  </Typography>
                </Box>
                <Box component="div" sx={iconBoxStyle}>
                  <Box
                    component="div"
                    sx={{
                      ...avatarBoxStyle,
                      marginBottom: 3,
                      marginTop: 2,
                    }}
                  >
                    <Avatar
                      src={leaderboardList[0]?.icon || milksvg}
                      sx={{ height: 85, width: 85 }}
                    />
                  </Box>
                  <Typography sx={textNameStyle} variant={'h6'}>
                    {leaderboardList[0]?.name || 'no name'}
                  </Typography>
                  <Typography sx={textPtStyle}>
                    {`${leaderboardList[0]?.points || 'no'} pts`}
                  </Typography>
                </Box>
                <Box component="div" sx={iconBoxStyle}>
                  <Box component="div" sx={avatarBoxStyle}>
                    <Avatar sx={{ height: 45, width: 45 }} />
                  </Box>
                  <Typography sx={textNameStyle} variant={'h6'}>
                    {leaderboardList[2]?.name || 'no name'}
                  </Typography>
                  <Typography sx={textPtStyle}>
                    {`${leaderboardList[2]?.points || 'no'} pts`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
        <LeaderboardSingleLine
          bgColor={'green'}
          txtColor={theme.palette.secondary.contrastText}
          user={currentLeaderboardUser}
        />
        {leaderboardList.map(
          (leaderboardUser: ILeaderboardUserModel, index: number) => {
            return <LeaderboardSingleLine user={leaderboardUser} />;
          }
        )}
      </Box>
    );
  }
);
