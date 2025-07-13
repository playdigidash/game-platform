import { useTheme } from '@mui/material/styles';
import CircleIcon from '@mui/icons-material/Circle';
import { Card, GradientSection } from './PlayerProfile';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

export const GameSummary = () => {
  const theme = useTheme();
  return (
    <GradientSection
      style={{
        justifyContent: 'center',
      }}
    >
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
        <ReviewCard theme={theme} />
        <ReviewQuestion />
      </div>
    </GradientSection>
  );
};

export const ReviewCard = ({ theme }: any) => {
  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Game summary</h2>
      <Card
        style={{
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h4
            style={{
              margin: 0,
            }}
          >
            Mental Health Resources at FIU
          </h4>
          <p style={{ opacity: 0.6, fontSize: '0.75rem', margin: 0 }}>
            10/10/24
          </p>
          <span
            style={{
              opacity: 0.6,
              fontSize: '0.75rem',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Accurate rate
            <CircleIcon
              style={{ fontSize: '0.75rem', marginLeft: '0.4rem' }}
              color="info"
            />
          </span>
        </div>

        <div
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            position: 'relative',
          }}
        >
          <CircularProgress
            color="info"
            variant="determinate"
            value={75}
            size={75}
          />
          <Typography
            variant="caption"
            component="div"
            sx={{
              position: 'absolute',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            75%
          </Typography>
        </div>
      </Card>
    </>
  );
};

const ReviewQuestion = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={false}
      >
        <Tab label="Overview" />
        <Tab label="Correct" />
        <Tab label="Incorrect" />
        <Tab label="First Timers" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <AccordionContent
          title="Overview Content"
          details="This is the overview of the questions."
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AccordionContent
          title="Correct Answers"
          details="These are the correct answers."
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AccordionContent
          title="Incorrect Answers"
          details="These are the incorrect answers."
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AccordionContent
          title="First Timers"
          details="These are the questions attempted for the first time."
        />
      </TabPanel>
    </div>
  );
};

const TabPanel = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => {
  return <div>{value === index && <div>{children}</div>}</div>;
};

const AccordionContent = ({
  title,
  details,
}: {
  title: string;
  details: string;
}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{details}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};
export default GameSummary;
