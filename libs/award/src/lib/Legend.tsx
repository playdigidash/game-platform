import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import CircleIcon from '@mui/icons-material/Circle';

interface IOpts {
  text: string;
  color: string;
}

interface ILegend {
  opts: IOpts[];
}

export const Legend: React.FC<ILegend> = observer(({ opts }) => {
  const listStyle = {
    display: 'flex',
    gap: 1,
  };

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 2,
        gap: 2,
      }}
    >
      {opts.map((opt) => {
        return (
          <Box
            component="div"
            sx={{
              ...listStyle,
              color: opt.color,
            }}
          >
            <CircleIcon />
            <Typography>{opt.text}</Typography>
          </Box>
        );
      })}
    </Box>
  );
});
