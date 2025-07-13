import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useTheme } from '@mui/material/styles';

interface ReviewProgressRingProps {
  progress: number;
  reviewedCount: number;
  totalCount: number;
  size?: number;
  strokeWidth?: number;
}

export const ReviewProgressRing: React.FC<ReviewProgressRingProps> = observer(({
  progress,
  reviewedCount,
  totalCount,
  size = 60,
  strokeWidth = 4
}) => {
  const theme = useTheme();

  return (
    <Box
      component="div"
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Background circle (white) */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={strokeWidth}
        sx={{
          color: 'rgba(255, 255, 255, 0.3)',
          position: 'absolute',
        }}
      />
      {/* Progress circle (green) */}
      <CircularProgress
        variant="determinate"
        value={progress}
        size={size}
        thickness={strokeWidth}
        sx={{
          color: theme.palette.success.main,
          position: 'absolute',
          '& .MuiCircularProgress-circle': {
            strokeWidth: 2,
          },
        }}
      />
      <Box
        component="div"
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{
            color: 'white',
            fontSize: size > 50 ? '1rem' : '0.75rem',
          }}
        >
          {`${reviewedCount}/${totalCount}`}
        </Typography>
      </Box>
    </Box>
  );
});

export default ReviewProgressRing; 