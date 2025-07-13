import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

export const SearchAppBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box component="div" sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          height: 70,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          background: theme.palette.background.default,
        }}
      >
        <HomeIcon
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            navigate('/Homepage');
          }}
        />
        <Typography variant="h6" component="div">
          Quick Find
        </Typography>
        <div></div>
      </AppBar>
    </Box>
  );
};
