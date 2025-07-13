import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { Toll, Quiz, DirectionsRun, EmojiEvents } from '@mui/icons-material';
import styled from 'styled-components';
import { Box, Fade, IconButton, Typography, useTheme, Modal, SxProps, Theme } from '@mui/material';


interface AchievementPopupProps {
  data?: {
    text: string;
    translatedText: string;
    position?: 'top' | 'middle' | 'bottom' | 'left';
    style?: React.CSSProperties;
    type?: AchievementType;
    duration?: number; // Duration in seconds for the achievement to stay visible
  };
}

// Define the supported achievement types
type AchievementType = 
  | 'hero'     // For hero selection
  | 'trivia'   // For trivia questions and related
  | 'coin'     // For coin collection 
  | 'penalty'  // For obstacle hits and penalties
  | 'positive' // For general positive achievements
  | 'default'; // Fallback

export default function AchievementPopup({ data }: AchievementPopupProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const gameStore = useGameStore();
  const { setAchievement } = gameStore.gamePlayViewStore;
    const theme = useTheme();


  // Parse the points value from achievement text
  const getPointsValue = () => {
    if (!data?.text) return '';
    
    // Try to find the number pattern with + or - prefix
    const match = data.text.match(/[+-]\d+/);
    if (match) return match[0];
    
    // Default value based on type
    if (data.text.includes('coin') || data.text.includes('Coin')) return '+100';
    if (data.text.includes('hit') || data.text.includes('Hit')) return '-50';
    return '';
  };

  // Determine achievement type from text
  const getAchievementType = () => {
    // If explicit type is provided, use it
    if (data?.type) {
      return data.type;
    }
    
    if (!data?.text) return 'default';
    
    // Special case for "Pick Your Hero" - gets its own type
    if (data.text.includes('Pick Your Hero')) {
      return 'hero';
    }
    
    // Special case messages that should be treated as trivia/primary style
    if (data.text.includes('Trivia Time') ||
        data.text.includes('Welcome')) {
      return 'trivia';
    }
    
    // Check for +/- prefixes for simple detection first
    if (data.text.startsWith('+')) {
      // Check if it's a coin notification specifically
      if (data.text.includes('coin') || data.text.includes('Coin') || 
          (data.text === '+100' && data.position === 'bottom')) {
        return 'coin';
      }
      // Other positive notifications
      return 'positive';
    }
    
    if (data.text.startsWith('-')) {
      return 'penalty';
    }
    
    // For point achievements (trivia/questions)
    if (data.text.includes('🎯') || 
        data.text.includes('⚡') || 
        data.text.includes('Third time') ||
        data.text.includes('Lightning fast') ||
        data.text.includes('try') ||
        data.text.includes('Try') ||
        data.text.includes('shot') ||
        data.text.includes('You got it') ||
        data.text.includes('Trivia')) {
      return 'trivia';
    }
    
    // For coin achievements
    if (data.text.includes('💰') || 
        data.text.includes('coin') ||
        data.text.includes('Coin')) {
      return 'coin';
    }
    
    // For penalties
    if (data.text.includes('❌') || 
        data.text.includes('hit') || 
        data.text.includes('Hit') ||
        data.text.includes('Obstacle') ||
        data.text.includes('penalty')) {
      return 'penalty';
    }
    
    // Check position as a fallback, but don't let position override special messages
    if (data.position === 'bottom') return 'coin';
    if (data.position === 'top' && !data.text.includes('Pick Your Hero')) return 'penalty';
    if (data.position === 'middle') return 'trivia';
    
    // Default
    return 'default';
  };

  // Get style based on achievement type
  const getAchievementStyle = () => {
    // If custom style is provided in data, use it
    if (data?.style) {
      return {
        backgroundColor: data.style.backgroundColor || 'rgba(0, 0, 0, 0.75)',
        border: data.style.border || `2px solid ${data.style.color || '#333'}`,
        color: data.style.color,
        fontSize: data.style.fontSize,
        fontWeight: data.style.fontWeight,
      };
    }

    const type = getAchievementType();
    
    switch (type) {
      case 'hero':
        return {
          backgroundColor: theme.palette.primary.main,
          border: theme.palette.primary.main,
        };
      case 'trivia':
        return {
          backgroundColor: theme.palette.primary.main,
          border: theme.palette.primary.main,
        };
      case 'coin':
        return {
          backgroundColor: 'rgba(52, 199, 89, 0.85)',
          border: '2px solid #2a8d4a',
        };
      case 'penalty':
        return {
          backgroundColor: 'rgba(255, 59, 48, 0.85)',
          border: '2px solid #c41e3a',
        };
      case 'positive':
        return {
          backgroundColor: data?.style?.backgroundColor || 'rgba(76, 175, 80, 0.2)',
          border: `2px solid ${data?.style?.color || '#4CAF50'}`,
          color: data?.style?.color || '#4CAF50',
        };
      default:
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          border: '2px solid #333',
        };
    }
  };

  // Get the appropriate duration based on achievement type
  const getAchievementDuration = (): number => {
    if (data?.duration) {
      // If explicitly provided, use that
      return data.duration;
    }
    
    // Default durations based on type
    const type = getAchievementType();
    switch (type) {
      case 'hero':
        return 4.0; // Longer duration for hero selection
      case 'trivia':
        return 3.0; // Medium duration for trivia
      case 'coin':
        return 2.0; // Shorter for common events like coins
      case 'penalty':
        return 1.0; // Shorter for penalties
      case 'positive':
        return 2.5; // Medium for positive achievements
      default:
        return 2.5; // Default duration
    }
  };

  useEffect(() => {
    if (!data) return;
    const currentTries = gameStore.questionViewStore.currentQTries;
    
    const currentBox = boxRef.current;
    if (!currentBox) return;

    // Kill previous animation if it exists
    timelineRef.current?.kill();

    // Get duration based on achievement type
    const displayDuration = getAchievementDuration();
    
    // Animation timings
    const fadeInDuration = 0.3;   // Time to fade in
    const fadeOutDuration = 0.8;  // Time to fade out
    // Hold duration is the total minus fade in/out times
    const holdDuration = Math.max(displayDuration - fadeInDuration - fadeOutDuration, 0.5);
    
    // Create new timeline for floating animation
    const tl = gsap.timeline({
      onComplete: () => {
        setAchievement(null);
      },
    });

    timelineRef.current = tl;

    // Start with opacity 0
    tl.set(currentBox, { opacity: 0, y: 0 })
      // Fade in
      .to(currentBox, {
        opacity: 1,
        duration: fadeInDuration,
        ease: 'power1.inOut',
      })
      // Hold visible
      .to(currentBox, {
        y: '-=20',  // Slight float while visible
        duration: holdDuration,
        ease: 'power1.inOut',
      })
      // Fade out while floating up
      .to(currentBox, {
        y: '-=60',
        opacity: 0,
        duration: fadeOutDuration,
        ease: 'power1.out',
      });

    return () => {
      tl.kill();
    };
  }, [data, gameStore, setAchievement]);

  if (!data) return <></>;

  // Position achievements based on type - coin and penalty on left, hero and trivia in center
  const getPositionStyles = () => {
    const type = getAchievementType();
    
    // For coin and penalty achievements - position on left side
    if (type === 'coin' || type === 'penalty') {
      return {
        left: '10%',
        top: '70%', // Near bottom left
        transform: 'translateX(0) translateY(-50%)'
      };
    }
    
    // For hero and trivia achievements - position in center
    const basePosition = {
      left: '50%',
      transform: 'translateX(-50%)',
    };
    
    switch (data.position) {
      case 'top':
        return { ...basePosition, top: '30%' };
      case 'bottom':
        return { ...basePosition, bottom: '20%' };
      case 'left':
        return { left: '10%', top: '70%', transform: 'translateX(0) translateY(-50%)' };
      case 'middle':
      default:
        return { ...basePosition, top: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  // Get appropriate icon based on achievement type
  const renderIcon = () => {
    const type = getAchievementType();
    const pointsValue = getPointsValue();
    
    switch (type) {
      case 'hero':
        return (
          <IconContainer>
            <DirectionsRun style={{ fontSize: '1.2rem', marginRight: '0.3rem', color: 'white' }} />
          </IconContainer>
        );
      case 'trivia':
        return (
          <IconContainer>
            <Quiz style={{ fontSize: '1.2rem', marginRight: '0.3rem', color: 'white' }} />
            <PointsText style={{ color: 'white' }}>{pointsValue || '+300'}</PointsText>
          </IconContainer>
        );
      case 'coin':
        return (
          <IconContainer>
            <Toll style={{ fontSize: '1.2rem', marginRight: '0.3rem', color: 'white' }} />
            <PointsText style={{ color: 'white' }}>{pointsValue || '+100'}</PointsText>
          </IconContainer>
        );
      case 'penalty':
        return (
          <IconContainer>
            <DirectionsRun style={{ fontSize: '1.2rem', marginRight: '0.3rem', color: 'white' }} />
            <PointsText style={{ color: 'white' }}>{pointsValue || '-50'}</PointsText>
          </IconContainer>
        );
      case 'positive':
        return (
          <IconContainer>
            <EmojiEvents style={{ fontSize: '1.2rem', marginRight: '0.3rem', color: 'white' }} />
            <PointsText style={{ color: 'white' }}>{pointsValue || '+'}</PointsText>
          </IconContainer>
        );
      default:
        // Fallback to providing some visual even for default type
        return (
          <IconContainer>
            <Quiz style={{ fontSize: '1.2rem', marginRight: '0.3rem' }} />
            <PointsText>{pointsValue || '!'}</PointsText>
          </IconContainer>
        );
    }
  };

  // Extract actual achievement message without the points
  const getAchievementMessage = () => {
    if (!data?.text) return '';
    
    // For simple point values, return an empty string - we just want to show the icon and points
    if (data.text === '+100' || data.text === '-50') return '';

    // Return translated text if provided
    if (data.translatedText) return data.translatedText;
    
    // Remove points notation and initial emoji if present
    // But preserve line breaks in the text
    const message = data.text
      .replace(/^[+-]\d+\s*/, '')
      .replace(/^[^\w\s]+ /, '');
    
    // If message is empty after removing points, provide a default
    if (!message.trim()) {
      const type = getAchievementType();
      
      // Don't provide defaults for coin or penalty - just show the points
      if (type === 'coin' || type === 'penalty') return '';
      if (type === 'trivia') return 'Correct answer!';
    }
    
    return message;
  };

  return (
    <AchievementContainer
      ref={boxRef}
      style={{ ...getPositionStyles(), ...data.style, ...getAchievementStyle() }}
      className={getAchievementType()}
    >
      {renderIcon()}
      {getAchievementMessage() && (
        <MessageText className={getAchievementType()}>{getAchievementMessage()}</MessageText>
      )}
    </AchievementContainer>
  );
}

const AchievementContainer = styled.div`
  position: fixed;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  z-index: 1400;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  max-width: 200px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(0); /* Initial position for animation */
  
  &.hero {
    max-width: 300px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.7);
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.3rem;
  
  .hero & {
    transform: scale(1.5);
    margin-bottom: 0.6rem;
  }
`;

const PointsText = styled.span`
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
`;

const MessageText = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-family: 'Orbitron', sans-serif;
  white-space: pre-line;
  text-align: center;
  width: 100%;
  
  &.hero {
    font-size: 1.2rem;
    letter-spacing: 0.05em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  }
`;
