import { Box, Card, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react';

// interface IBadgePanel {
//   allRewardEvents: IAwardEvent[];
// }

export const BadgePanel: React.FC = observer(() => {
  const theme = useTheme();

  return (
    <Box
      component="div"
      style={{
        flex: 1,
        display: 'flex',
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flex: 1,
          margin: 2,
          marginBottom: 10,
        }}
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            margin: 3,
          }}
        >
          {/* {allRewardEvents.map((val: IAwardEvent) => {
              return (
                <Box component="div" 
                  sx={{
                    width: 100,
                    margin: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 1,
                  }}
                >
                  {val.hasUserEarned ? (
                    <Avatar
                      sx={{
                        border: `5px solid ${val.level}`,
                        width: 60,
                        height: 60,
                        // bgcolor: currentAwardedBadge?.level
                      }}
                      src={val.icon}
                      // alt={'badge-icon'}
                      // width={60}
                    />
                  ) : (
                    <BlurOnIcon sx={{ fontSize: 45 }} />
                  )}
                  <Typography
                    color={val.hasUserEarned ? '' : theme.palette.text.disabled}
                    variant="caption"
                  >
                    {val.title}
                  </Typography>
                </Box>
              );
            })} */}
        </Box>
      </Card>
    </Box>
  );
});
