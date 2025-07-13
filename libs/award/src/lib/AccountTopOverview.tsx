import { Avatar, Box, Typography, useTheme } from '@mui/material';
import plasticsvg from './assets/plastic.svg';
import { observer } from 'mobx-react';
import { ICurrentUserModel } from '@lidvizion/commonlib';
import { CustomDivider } from '@lidvizion/Search';

interface IAccountTopOverview {
  user: ICurrentUserModel;
}

export const AccountTopOverview: React.FC<IAccountTopOverview> = observer(
  ({ user }) => {
    const theme = useTheme();
    return (
      <>
        <Box
          component="div"
          display={'flex'}
          justifyContent={'center'}
          flexDirection={'column'}
          alignItems={'center'}
          flex={0.5}
          margin={2}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: theme.palette.secondary.main,
            }}
            src={plasticsvg}
          />
        </Box>
        <Box
          component="div"
          display={'flex'}
          alignItems={'center'}
          flexDirection={'column'}
          margin={2}
        >
          <Typography variant="h5">{user?.displayName}</Typography>
          <Typography sx={{ marginBottom: 2 }} color={'GrayText'}>{`Level ${
            user?.stats?.level || 1
          }`}</Typography>
          <CustomDivider />
        </Box>
      </>
    );
  }
);
