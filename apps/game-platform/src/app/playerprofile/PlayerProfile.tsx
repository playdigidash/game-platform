import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import PlayerData from './_dummyPlayerProfile.json';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';

const data = PlayerData;

const PlayerProfile = () => {
  const theme = useTheme();
  return (
    <GradientSection theme={theme} component="section">
      <div
        style={{
          width: '100%',
          maxWidth: '38rem',
          [theme.breakpoints.down('sm')]: {
            maxWidth: '100%',
          },
          margin: '0 auto',
        }}
      >
        <PlayerHeaderSection name="Player" />
        <AcheivementSection />
        <StrikeSection theme={theme} />
        <MenuSection />
      </div>
    </GradientSection>
  );
};

const PlayerHeaderSection = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '0.5rem',
      }}
    >
      <Typography variant="h4">{props.name || 'Player'}</Typography>
    </div>
  );
};

const AcheivementSection = () => {
  return (
    <Card
      style={{
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        margin: 0,
      }}
    >
      {data.achievements.map(({ id, name, value }) => (
        <div
          key={id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ElectricBoltIcon color={'primary'} />
          <p style={{ fontSize: 'small', margin: 5 }}>{name}</p>
          <p style={{ fontWeight: 'bold', margin: 0 }}>{value}</p>
        </div>
      ))}
    </Card>
  );
};

const StrikeSection = ({ theme }: any) => {
  return (
    <Card
      style={{
        flexDirection: 'column',
        width: '100%',
        margin: 0,
        marginTop: '0.5rem',
      }}
    >
      <p>3 days strike!</p>
      <StyledProgress
        value={0.6}
        style={{
          color: theme.palette.primary.main,
          width: '100%',
        }}
      />
    </Card>
  );
};

const MenuSection = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        gap: '1rem',
        marginTop: '0.75rem',
      }}
    >
      <Card
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          margin: 0,
        }}
      >
        <PlayCircleOutlinedIcon
          style={{
            fontSize: '5rem',
            color: '',
          }}
          color="primary"
        />
        <p>Play</p>
      </Card>

      <Card
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          margin: 0,
        }}
      >
        <BarChartOutlinedIcon
          style={{
            fontSize: '5rem',
            color: '',
          }}
          color="info"
        />
        <p>Progress</p>
      </Card>

      <Card
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          margin: 0,
        }}
      >
        <RestoreOutlinedIcon
          style={{
            fontSize: '5rem',
            color: '',
          }}
          color="warning"
        />
        <p>Past games</p>
      </Card>

      <Card
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          margin: 0,
        }}
      >
        <QuestionMarkOutlinedIcon
          style={{
            fontSize: '5rem',
            color: '',
          }}
          color="success"
        />
        <p>Help</p>
      </Card>
    </div>
  );
};

export default PlayerProfile;

export const GradientSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.background.default} 40%)`,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'end',
  padding: '1rem 0.5rem',
}));

export const Card = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: '1rem',
  borderRadius: '1rem',
  border: `0.1rem solid ${alpha(theme.palette.grey[300], 0.2)}`,
  display: 'flex',
  margin: '0.5rem',
}));

export const StyledProgress = styled('progress')(({ theme }) => ({
  width: '100%',
  height: '0.75rem',
  border: 'none',
  borderRadius: '0.3rem',
  backgroundColor: theme.palette.grey[300],
  overflow: 'hidden',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',

  // Background bar
  '&::-webkit-progress-bar': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: '0.3rem',
  },

  // Value bar - WebKit
  '&::-webkit-progress-value': {
    backgroundColor: 'currentColor',
    borderRadius: '0.3rem',
    transition: 'all 1.5s ease-out',
  },

  // Value bar - Firefox
  '&::-moz-progress-bar': {
    backgroundColor: 'currentColor',
    borderRadius: '0.3rem',
    transition: 'all 1.5s ease-out',
  },

  // Value bar - IE/Edge
  '&::-ms-fill': {
    backgroundColor: 'currentColor',
    border: 0,
    transition: 'all 1.5s ease-out',
  }
}));
