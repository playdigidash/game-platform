import { Box, Button, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react';
import React, { ReactNode } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

// SVG path data for arrow icons
const SVG_ARROW_LEFT = "M11.52 3.43L5.45 9.5l6.07 6.07 1.41-1.41-4.66-4.66 4.66-4.66z";
const SVG_ARROW_RIGHT = "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z";
const SVG_ARROW_UP = "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z";
const SVG_ARROW_DOWN = "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z";

// SVG Arrow component with proper types
const ArrowSVG: React.FC<{path: string, color: string}> = ({path, color}) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d={path} />
  </svg>
);

// Double Arrow component that shows two arrow SVGs
const DoubleArrow: React.FC<{path: string, color: string}> = ({path, color}) => (
  <div style={{ display: 'flex' }}>
    <ArrowSVG path={path} color={color} />
    <ArrowSVG path={path} color={color} />
  </div>
);

// Keyframe animation for blinking effect
const blinkAnimation = keyframes`
  0%, 30% { opacity: 0.3; }
  45%, 75% { opacity: 1; }
  90%, 100% { opacity: 0.3; }
`;

// Arrow indicator with animation
const AnimatedArrow = styled('div')(({ theme }) => ({
  animation: `${blinkAnimation} 1.2s infinite`,
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  fontSize: '2rem',
}));

interface DirectionBoxProps {
  icon: ReactNode;
  text: string;
}

// Instruction box with arrow and text
const DirectionBox: React.FC<DirectionBoxProps> = ({ icon, text }) => {
  const theme = useTheme();
  return (
    <Box
      component="div"
      display={'flex'}
      flexDirection={'row'}
      alignItems={'center'}
      gap={'1em'}
    >
      <AnimatedArrow>{icon}</AnimatedArrow>
      <Typography
        sx={{
          fontSize: '1em',
          color: 'white',
          backgroundColor: theme.palette.primary.main,
          borderRadius: '0.5em',
          padding: '0.2em 0.5em',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export const TutorialScreen: React.FC = observer(() => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  return (
    <Box
      component="div"
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      flex={1}
      gap={'3em'}
      margin={'2em'}
    >
      <Box
        component={'div'}
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={'1.5em'}
        flexGrow={1}
        sx={{ backgroundColor: 'transparent' }}
      >
        <Box
          component="div"
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={'1em'}
        >
          <DirectionBox 
            icon={<div style={{ display: 'flex' }}>
              <DoubleArrow path={SVG_ARROW_LEFT} color={primaryColor} />
              <DoubleArrow path={SVG_ARROW_RIGHT} color={primaryColor} />
            </div>} 
            text="Dodge Obstacles" 
          />
          
          <DirectionBox 
            icon={<DoubleArrow path={SVG_ARROW_UP} color={primaryColor} />} 
            text="Jump" 
          />
          
          <DirectionBox 
            icon={<DoubleArrow path={SVG_ARROW_DOWN} color={primaryColor} />} 
            text="Slide" 
          />
        </Box>

        <Box
          component="div"
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          gap={'1em'}
        >
          <SchoolIcon sx={{ color: 'white' }} />
          <Typography
            sx={{
              fontSize: '1em',
              color: 'white',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '0.5em',
              padding: '0.2em 0.5em',
            }}
          >
            Collect Coins, Earn Score
          </Typography>
        </Box>
        <Box
          component="div"
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          gap={'1em'}
        >
          <HelpOutlineIcon sx={{ color: 'white' }} />
          <Typography
            sx={{
              fontSize: '1em',
              color: 'white',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '0.5em',
              padding: '0.2em 0.5em',
            }}
          >
            Collect Hints for Help
          </Typography>
        </Box>
      </Box>
      <Box component="div" display={'flex'} alignItems={'center'} gap={'1em'}>
        <Button variant={'contained'} startIcon={<DirectionsRunIcon />}>
          Let's Dash!
        </Button>
      </Box>
    </Box>
    // <BasicModal
    //   supportButton={
    //     !isTutorial
    //       ? {
    //           text: 'Start Tutorial!',
    //           action: () => {
    //             setIsTutorialCompleted(false);
    //             setIsTutorial(true);
    //             setPaused(false);
    //           },
    //         }
    //       : undefined
    //   }
    //   actionButton={{
    //     text: "Let's Play!",
    //     action: handleLetsGoClick,
    //   }}
    // >

    // </BasicModal>
  );
});
