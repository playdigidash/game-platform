import React, { useRef } from 'react';
import { Button, ButtonProps, Box, Typography, useTheme } from '@mui/material';
import { gsap } from 'gsap';
import { darkenColor } from '@lidvizion/commonlib';

interface GameButtonProps extends ButtonProps {
  label: string;
  icon: any;
  small?: boolean;
  isTranslateButton?: boolean;
}

const GameButton: React.FC<GameButtonProps> = ({
  label,
  icon,
  small,
  isTranslateButton,
  onClick,
  disabled,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const darkerPrimaryColor = darkenColor(primaryColor, -20);

  const handleMouseDown = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, { scale: 0.95, duration: 0.1 });
    }
  };

  const handleMouseUp = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, { scale: 1, duration: 0.1 });
    }
  };

  return (
    <Button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onClick={onClick}
      disabled={disabled}
      variant="contained"
      sx={{
        padding: 0,
        fontSize: small ? '1rem' : '1.5rem',
        borderRadius: '1rem',
        textTransform: 'none',
        width: '100%',
        maxWidth: small ? '15rem' : '20rem',
        height: 'clamp(3.5rem, 8vh, 4.5rem)',
        transform: 'scale(1)',
        transition: 'all 0.3s ease',
        background: `linear-gradient(145deg, ${darkerPrimaryColor}, ${primaryColor})`,
        boxShadow: `0.25rem 0.25rem 0.5rem black`,
        ':hover': {
          transform: 'scale(1.02)',
          boxShadow: `0.375rem 0.375rem 0.75rem ${darkerPrimaryColor}, -0.375rem -0.375rem 0.75rem ${primaryColor}`,
        },
        ':active': {
          transform: 'scale(0.98)',
          boxShadow: `inset 0.25rem 0.25rem 0.5rem ${darkerPrimaryColor}, inset -0.25rem -0.25rem 0.5rem ${primaryColor}`,
        },
        ':disabled': {
          backgroundColor: 'gray',
          boxShadow: 'none',
        },
        position: 'relative',
      }}
      {...props}
    >
      <Box
        component={'div'}
        display={'flex'}
        alignItems={'center'}
        flex={1}
        justifyContent={'center'}
        sx={{
          height: '100%',
          background: (theme) => theme.palette.secondary.main,
          padding: '0.5em',
          position: 'relative',
          borderBottomRightRadius: '50%',
          borderBottomLeftRadius: '15%',
          borderTopLeftRadius: '15%',
          boxShadow: `0.25rem 0.25rem 0.5rem #151515`,
        }}
      >
        {icon}
      </Box>
      <Box
        component={'div'}
        display={'flex'}
        flex={3}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography 
          sx={{ 
            fontSize: (small || isTranslateButton) ? '1.2rem' : '1.8rem',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}
        >
          {label}
        </Typography>
      </Box>
    </Button>
  );
};

export default GameButton;
