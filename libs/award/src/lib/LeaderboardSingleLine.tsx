import { ILeaderboardUserModel } from '@lidvizion/commonlib';
import { Card, Box, Typography, Avatar } from '@mui/material';
import { observer } from 'mobx-react-lite';
import milksvg from './assets/milk.svg';

interface ILeaderboardSingleLine {
  user: ILeaderboardUserModel | null;
  bgColor?: string;
  txtColor?: string;
}

export const LeaderboardSingleLine: React.FC<ILeaderboardSingleLine> = observer(
  ({ user, bgColor, txtColor }) => {
    const textNameStyle = {
      color: txtColor || '',
    };

    return (
      <Card
        sx={{
          display: 'flex',
          alignSelf: 'stretch',
          margin: 2,
          borderRadius: 10,
          alignItems: 'center',
          background: bgColor || '',
        }}
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            gap: 2,
            margin: 1,
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" sx={textNameStyle}>
            {user?.currentRank}
          </Typography>
          <Avatar sx={{ height: 50, width: 50 }} src={user?.icon || milksvg} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            ...textNameStyle,
            flex: 1,
            textAlign: 'center',
          }}
        >
          {user?.name}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            ...textNameStyle,
            flex: 2,
            textAlign: 'right',
            marginRight: 10,
          }}
        >
          {`${user?.points} pts`}
        </Typography>
      </Card>
    );
  }
);
