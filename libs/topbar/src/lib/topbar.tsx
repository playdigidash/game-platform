import { AppBar, Box, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './topbar.module.scss';
import HomeIcon from '@mui/icons-material/Home';

/* eslint-disable-next-line */
export interface TopbarProps {
  title: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box component="div" sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          height: 70,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          background: theme.palette.grey[800],
        }}
      >
        <HomeIcon
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            navigate('/Homepage');
          }}
        />
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <div></div>
      </AppBar>
    </Box>
  );
};
