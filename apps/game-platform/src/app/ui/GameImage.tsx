import React from 'react';
import { gsap } from 'gsap';
import { CircularProgress } from '@mui/material';

interface GameImageProps {
  src: string; // Source of the image
  alt?: string; // Alt text for the image
  width?: string | number; // Width of the image (responsive)
  height?: string | number; // Height of the image (responsive)
  sx?: any; // Additional styles (simplified)
  hoverEffect?: boolean; // Whether the image has a hover effect
  useImgTag?: boolean; // Whether to use img tag instead of background image
}

const GameImage: React.FC<GameImageProps> = ({
  src,
  alt = '',
  width = 'auto',
  height = 'auto',
  sx,
  hoverEffect = true,
  useImgTag = false,
}) => {
  const imageRef = React.useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!src) {
      setImageError(true);
      setIsLoading(false);
      return;
    }

    // Reset state when src changes
    setImageLoaded(false);
    setImageError(false);
    setIsLoading(true);

    // Clean the URL - remove any surrounding quotes
    const cleanSrc = src.replace(/^"|"$/g, '');

    // Test if the URL is accessible via fetch first
    const testUrlAccessibility = async () => {
      try {
        // Try HEAD request first (most efficient)
        let response;
        try {
          response = await fetch(cleanSrc, { 
            method: 'HEAD',
            mode: 'cors'
          });
        } catch (corsError) {
          response = await fetch(cleanSrc, { 
            method: 'GET',
            mode: 'no-cors'
          });
        }
        
        // Fix Headers.entries() compatibility issue
        try {
          const headers: Record<string, string> = {};
          response.headers.forEach((value, key) => {
            headers[key] = value;
          });
        } catch (headerError) {
          // Headers not readable
        }
      } catch (fetchError) {
        // Fetch test failed
      }
    };

    testUrlAccessibility();

    // Test image loading with multiple approaches
    const testImageLoading = async () => {
      let imageLoadAttempts = 0;
      const maxAttempts = 3;
      const approaches = [
        { crossOrigin: 'anonymous', description: 'with CORS anonymous' },
        { crossOrigin: null, description: 'without CORS' },
        { src: cleanSrc, crossOrigin: 'use-credentials', description: 'with CORS credentials' }
      ];

      for (const approach of approaches) {
        if (imageLoadAttempts >= maxAttempts) break;
        
        const testImage = new Image();
        if (approach.crossOrigin) {
          testImage.crossOrigin = approach.crossOrigin;
        }
        
        const promise = new Promise<boolean>((resolve) => {
          testImage.onload = () => {
            setImageLoaded(true);
            setImageError(false);
            setIsLoading(false);
            resolve(true);
          };
          
          testImage.onerror = (error) => {
            resolve(false);
          };
          
          testImage.src = approach.src || cleanSrc;
        });

        const success = await promise;
        if (success) {
          return; // Stop trying other approaches if one succeeds
        }
        
        imageLoadAttempts++;
      }

      // All approaches failed
      setImageError(true);
      setIsLoading(false);
    };

    testImageLoading();
  }, [src]);

  React.useEffect(() => {
    if (hoverEffect && imageRef.current && imageLoaded) {
      const element = imageRef.current;
      
      const handleMouseEnter = () => {
        gsap.to(element, { scale: 1.05, duration: 0.3 });
      };
      
      const handleMouseLeave = () => {
        gsap.to(element, { scale: 1, duration: 0.3 });
      };
      
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
    // Return undefined for cases where no cleanup is needed
    return undefined;
  }, [hoverEffect, imageLoaded]);

  const handleImgError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImgLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    setIsLoading(false);
  };

  // Convert width/height to CSS values
  const getSize = (value: string | number) => 
    typeof value === 'number' ? `${value}px` : value;

  // Base styles for all states
  const baseStyle: React.CSSProperties = {
    width: getSize(width),
    height: getSize(height),
    ...sx,
  };

  if (isLoading) {
    return (
      <div 
        ref={imageRef}
        style={{
          ...baseStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (imageError) {
    return (
      <div 
        ref={imageRef}
        style={{
          ...baseStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffebee',
          border: '2px dashed #f44336',
          color: '#f44336',
          fontSize: '0.875rem',
          textAlign: 'center',
          padding: '8px',
          flexDirection: 'column',
        }}
      >
        <div>Image Failed to Load</div>
        <small>Check console for details</small>
      </div>
    );
  }

  if (useImgTag) {
    return (
      <div 
        ref={imageRef}
        style={{
          ...baseStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden', // Ensure overflow is hidden on container
        }}
      >
        <img
          src={src}
          alt={alt}
          onError={handleImgError}
          onLoad={handleImgLoad}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Changed from contain to cover for better appearance
            borderRadius: sx?.borderRadius || '0', // Apply border radius to img
          }}
        />
      </div>
    );
  }

  return (
    <div 
      ref={imageRef}
      style={{
        ...baseStyle,
        backgroundImage: `url(${src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />
  );
};

export default GameImage;
