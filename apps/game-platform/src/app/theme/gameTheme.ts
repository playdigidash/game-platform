import { createTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    gameHeading: React.CSSProperties;
    gameText: React.CSSProperties;
    gameCaption: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    gameHeading?: React.CSSProperties;
    gameText?: React.CSSProperties;
    gameCaption?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    gameHeading: true;
    gameText: true;
    gameCaption: true;
  }
}

const gameTheme = createTheme({
  typography: {
    fontFamily: "'Orbitron', sans-serif",
    gameHeading: {
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 700,
      fontSize: 'clamp(2rem, 6vw, 4rem)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    gameText: {
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 500,
      fontSize: 'clamp(1rem, 3vw, 1.5rem)',
      letterSpacing: '0.05em',
    },
    gameCaption: {
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 400,
      fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
      letterSpacing: '0.03em',
    },
    h1: {
      fontFamily: "'Orbitron', sans-serif",
    },
    h2: {
      fontFamily: "'Orbitron', sans-serif",
    },
    h3: {
      fontFamily: "'Orbitron', sans-serif",
    },
    h4: {
      fontFamily: "'Orbitron', sans-serif",
    },
    h5: {
      fontFamily: "'Orbitron', sans-serif",
    },
    h6: {
      fontFamily: "'Orbitron', sans-serif",
    },
    body1: {
      fontFamily: "'Orbitron', sans-serif",
    },
    body2: {
      fontFamily: "'Orbitron', sans-serif",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');
      `,
    },
  },
});

export default gameTheme; 