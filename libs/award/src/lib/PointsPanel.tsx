import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from '@mui/material';
import { History } from './History';

export interface IPointsPanel {
  currentProgress: number;
}

export const PointsPanel: React.FC<IPointsPanel> = ({ currentProgress }) => {
  return (
    <Box component="div" style={{ flex: 2 }}>
      <Box
        component="div"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <Typography margin={2} variant="h5">
          Progress
        </Typography>
        <LinearProgress variant="determinate" value={currentProgress} />
      </Box>
      <Box component="div">
        <Typography margin={2} variant="h5">
          History
        </Typography>
        <History />
      </Box>
    </Box>
  );
};
