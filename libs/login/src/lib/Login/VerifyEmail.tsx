import { AppRoute } from '@lidvizion/commonlib';
import { Box, Card, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const VerifyEmail: React.FC = observer(() => {
  let countdown = 2;
  const navigate = useNavigate();

  setInterval(() => {
    if (countdown === 0) {
      navigate(`/${AppRoute.account}`);
    }

    countdown -= 1;
  }, 1000);

  return (
    <Box
      component="div"
      display="flex"
      flexDirection={'column'}
      gap={2}
      alignItems={'center'}
      margin={3}
      justifyContent={'space-evenly'}
      height={'100%'}
    >
      <Typography variant="h2">Email Verification</Typography>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          margin: 3,
          padding: 3,
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Box component="div" display={'flex'} gap={2}>
          <Typography variant="h4">Your Email has been verified</Typography>
          <CheckCircleIcon fontSize="large" color="success" />
        </Box>
        <Typography variant="h6">{`Redirecting to Account Page`}</Typography>
      </Card>
    </Box>
  );
});
