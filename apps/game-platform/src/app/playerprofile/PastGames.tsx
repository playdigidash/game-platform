import { useTheme } from '@mui/material';
import { Card, GradientSection } from './PlayerProfile';
import pastGameData from './_pastGamesDummyData.json';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

const PastGames = () => {
  const theme = useTheme();
  return (
    <GradientSection>
      <div
        style={{
          width: '100%',
          maxWidth: '38rem',
          [theme.breakpoints.down('sm')]: {
            maxWidth: '100%',
          },
          margin: '0 auto',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
        }}
      >
        <h2>Past games</h2>
        {pastGameData.map(({ id, img, title, date, answers }) => (
          <Card
            style={{
              margin: 0,
              marginBlock: '0.5rem',
              flexDirection: 'column',
            }}
            key={id}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>{date}</span>
              <ChevronRightOutlinedIcon />
            </div>
            <h3>{title}</h3>
            <span
              style={{
                color: theme.palette.primary.main,
                fontSize: 'small',
                opacity: 0.7,
                marginBottom: '0.5rem',
              }}
            >
              {answers}
            </span>
            <div
              style={{
                width: '100%',
                height: '6.25rem',
                overflow: 'hidden',
              }}
            >
              <img
                src={img}
                style={{
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </GradientSection>
  );
};

export default PastGames;
