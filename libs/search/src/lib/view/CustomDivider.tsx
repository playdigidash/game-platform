import { Divider, useTheme } from '@mui/material';
import { observer } from 'mobx-react';

export const CustomDivider: React.FC = observer(() => {
  const theme = useTheme();
  return (
    <Divider
      sx={{
        border: 'none',
        width: '90%',
        height: '50px',
        marginTop: 0,
        boxShadow: `0 20px 20px -20px ${theme.palette.background.paper}`,
        margin: '-50px auto 10px',
      }}
    />
  );
});
