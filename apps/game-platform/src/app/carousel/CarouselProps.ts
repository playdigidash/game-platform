import { SystemStyleObject, Theme } from '@mui/system';

/**
 * Style definitions for the Carousel component
 */
export const loadingContainerStyles: SystemStyleObject<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '15rem',
  width: '100%',
  backgroundColor: 'transparent',
};

export const carouselContainerStyles: SystemStyleObject<Theme> = {
  height: 'auto',
  minHeight: '15rem',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: 'transparent',
  padding: '1rem',
  borderRadius: '0.5rem',
  boxSizing: 'border-box'
};

export const carouselWrapperStyles: SystemStyleObject<Theme> = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  userSelect: 'none',
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing',
  },
};

export const navigationButtonStyles: SystemStyleObject<Theme> = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  borderRadius: '50%',
  width: '3rem',
  height: '3rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const carouselContentStyles: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  gap: '1.5rem',
  padding: '0.5rem',
  height: '100%',
  alignItems: 'center',
  width: 'max-content',
  willChange: 'transform',
};

export const gameCardStyles = (isActive: boolean): SystemStyleObject<Theme> => ({
  position: 'relative',
  minWidth: '20rem',
  height: '12rem',
  margin: '0 0.5rem',
  padding: '0',
  borderRadius: '1rem',
  overflow: 'hidden',
  cursor: 'pointer',
  backgroundColor: 'white',
  boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-0.25rem)',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.3)',
  },
});

export const gameImageStyles: SystemStyleObject<Theme> = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
};

export const titleOverlayStyles: SystemStyleObject<Theme> = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '1rem',
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
  color: 'white',
  textAlign: 'center',
  zIndex: 1,
  textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.5)',
};

export const playButtonStyles: SystemStyleObject<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1.5rem',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  borderRadius: '1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    transform: 'translate(-50%, -50%) scale(1.1)',
  },
};

export const createButtonStyles: SystemStyleObject<Theme> = {
  position: 'relative',
  padding: '1rem',
  borderRadius: '1rem',
  backgroundColor: 'white',
  color: '#ad00ff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.2)',
  minWidth: { md: '12rem' },
  maxWidth: '20rem',
  height: { md: '15rem' },
  '&:hover': {
    backgroundColor: 'white',
    transform: 'translateY(-0.25rem)',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.2)',
  },
};

export const createIconStyles: SystemStyleObject<Theme> = {
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: '50%',
  backgroundColor: '#ad00ff',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1rem',
  fontSize: '2rem',
};

/**
 * Navigation arrow button styles
 */
export const navArrowStyles: SystemStyleObject<Theme> = {
  position: 'absolute',
  zIndex: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  width: '2.5rem',
  height: '2.5rem',
  boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.2)',
};

/**
 * Animation constants
 */
export const ANIMATION_CONSTANTS = {
  NORMAL_SPEED: 0.1,
  HOVER_SPEED: 0.05,
  ITEM_WIDTH: 22,
};

/**
 * Type for create button props
 */
export interface CreateButtonProps {
  onClick: () => void;
} 