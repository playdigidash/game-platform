import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { Typography, useTheme, Box } from '@mui/material';
import { useGameStore } from '../RootStore/RootStoreProvider';
import gsap from 'gsap';
import Confetti from './confetti';
import { Canvas } from '@react-three/fiber';
import { waitForSpecifiedTime } from '@lidvizion/commonlib';
import { HurtEffect } from './HurtEffect';
import { EmojiEvents, Toll } from '@mui/icons-material';

// Add this at the top after imports
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

  .game-text {
    font-family: 'Orbitron', sans-serif;
    text-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.3);
    letter-spacing: 0.1em;
    font-weight: 600;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export const InfoDisplay: React.FC = observer(() => {
  const { coinCnt, scoreFlash, totalCnt } = useGameStore().collectableViewStore;
  const {
    score,
    scorePerQuestion,
    triesPerQuestion,
    setScorePerQuestion,
    showPenaltyBubble,
  } = useGameStore().scoreViewStore;
  const { showFollowupTxt, setShowFollowupTxt } =
    useGameStore().gamePlayViewStore;

  const scoreRef = useRef<HTMLDivElement>(null);
  const penaltyRef = useRef<HTMLDivElement>(null);
  const followUpTextRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Helper function to set initial styles
  const setInitialStyles = (scale: number, color: string) => {
    gsap.set(scoreRef.current, { scale, color, opacity: 1 });
    gsap.set(followUpTextRef.current, { color, opacity: 1 });
  };

  const animateElements = (yOffset: number, duration: number) => {
    const tl = gsap.timeline({
      defaults: { duration, ease: 'power2.out' },
      onComplete: () => {
        setShowConfetti(false);
        setScorePerQuestion(0);
      },
    });

    setShowConfetti(true);

    tl.fromTo(scoreRef.current, { y: -yOffset }, { y: 0, scale: 1 });
    tl.fromTo(followUpTextRef.current, { y: -yOffset }, { y: 0 }, '<');

    tl.to([scoreRef.current, followUpTextRef.current], {
      opacity: 0,
      duration: 1,
      delay: 1,
    });
  };

  // Animate penalty bubble when it appears
  useEffect(() => {
    if (showPenaltyBubble && penaltyRef.current) {
      gsap.fromTo(
        penaltyRef.current,
        {
          opacity: 0,
          scale: 0.5,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'back.out',
        }
      );
    }
  }, [showPenaltyBubble]);

  useEffect(() => {
    const runTxtAnim = async () => {
      // Skip this animation since we're now using achievements for score display
      // If needed in the future, this can be re-enabled by removing the early return
      return;

      // Check if score and followup text elements exist and score is greater than 0
      if (scoreRef.current && followUpTextRef.current && scorePerQuestion > 0) {
        setShowFollowupTxt(true);
        switch (triesPerQuestion) {
          case 1:
            setInitialStyles(1.5, 'green');
            animateElements(50, 1);
            break;
          case 2:
            setInitialStyles(1.2, 'yellow');
            animateElements(30, 1);
            break;
          case 3:
            setInitialStyles(1, 'orange');
            animateElements(20, 0.8);
            break;
          case 4:
            setInitialStyles(1, 'brown');
            animateElements(10, 0.6);
            break;
          default:
            break;
        }

        await waitForSpecifiedTime(3);
        setShowFollowupTxt(false);
      }
    };

    runTxtAnim();
  }, [animateElements, scorePerQuestion, setShowFollowupTxt, triesPerQuestion]);

  const followUpTextHandler = (tries: number) => {
    switch (tries) {
      case 1:
        return 'Max Points!';
      case 2:
        return 'Great Job!';
      case 3:
        return 'Keep Going!';
      case 4:
        return 'Maybe Next Time!';
      default:
        return '';
    }
  };

  const StatDisplay = ({
    icon,
    value,
    type,
  }: {
    icon: React.ReactNode;
    value: string;
    type: 'score' | 'coins';
  }) => {
    const theme = useTheme();

    return (
      <Box component="div" sx={{ position: 'relative' }}>
        <Typography
          variant={'h5'}
          color={'white'}
          className={`game-text ${
            type === 'score' && scoreFlash ? 'flash-green' : ''
          }`}
          sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Box
            component="span"
            sx={{
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>{' '}
          {value}
        </Typography>
        {type === 'score' && showPenaltyBubble && (
          <div
            ref={penaltyRef}
            style={{
              position: 'absolute',
              right: '-60px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              opacity: 0,
            }}
          >
            -50
          </div>
        )}
      </Box>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        userSelect: 'none',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        padding: '1rem',
      }}
    >
      <HurtEffect />

      {false && scorePerQuestion > 0 && (
        <div ref={scoreRef}>
          <Typography variant="h4" className="game-text">
            +{Math.round(scorePerQuestion)}
          </Typography>
        </div>
      )}
      <div ref={followUpTextRef}>
        {showFollowupTxt && (
          <Typography variant="h4" className="game-text">
            {followUpTextHandler(triesPerQuestion)}
          </Typography>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <StatDisplay
          icon={<EmojiEvents fontSize="medium" />}
          value={`${Math.round(score)}`}
          type="score"
        />
        {showConfetti && (
          <Canvas
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <Confetti />
          </Canvas>
        )}
      </div>

      <StatDisplay
        icon={<Toll fontSize="medium" />}
        value={`${coinCnt}`}
        type="coins"
      />

      <style>{`
        @keyframes flash {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .flash-green {
          animation: flash 0.5s;
          color: #00FF00;
        }
      `}</style>
    </div>
  );
});
