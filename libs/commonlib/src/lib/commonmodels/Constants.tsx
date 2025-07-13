import { createTheme, PaletteMode } from '@mui/material';

export const defaultModalStyle = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 250,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  button: {
    // backgroundColor: '#AD00FF',
  },
};

export enum ResponseType {
  recycle = 'recycle',
  trash = 'trash',
  dropoff = 'dropoff',
}

//TODO: replace logintype with PROVIDERTYPE
export enum LoginType {
  anonymous = 'anon-user',
  email_phone = 'local-userpass',
  oauth2_google = 'oauth2-google',
}

//TODO: split routes by app
export enum AppRoute {
  default = '/',
  homepage = '/:org',
  searchwithorg = 'Search/:org',
  search = 'Search',
  settings = 'Settings',
  map = 'Map',
  dopath = 'DoPath',
  dopathid = 'DoPath/:id',
  detailmodal = 'DetailModal',
  knowledge = 'Knowledge',
  knowledgeWithOrg = 'Knowledge/:org',
  award = 'Award',
  learnWithOrg = 'Learn/:org',
  learn = 'Learn',
  account = 'Account',
  verifyEmail = 'VerifyEmail',
  calendar = 'Calendar',
  slidesWithOrg = 'Slides/:org',
  slides = 'Slides',
  scanWithOrg = 'Scan/:org',
  scan = 'Scan',
  feedback = 'Feedback',
  faqWithOrg = 'FAQ/:org',
  faq = 'FAQ',
  locationWithOrg = 'Location/:org',
  location = 'Location',
  ecoRunnerWithOrg = 'EcoRunner/:org',
  ecoRunner = 'EcoRunner',
  dashWithOrg = 'Dash/org/:org',
  dashWithPlayer = 'Dash/profile',
  playerPastGames = 'Dash/profile/pastgames',
  playerGameSummary = 'Dash/profile/game-summary',
  dashWithModule = '/:module',
  appSettings = 'AppSettings',
  appSettingsWithOrg = 'AppSettings/:org',
  trivia = 'Module/Trivia',
  triviaWithOrg = 'Trivia/:org',
  module = 'Module',
  scratch = 'Module/Scratch',
  hero = 'Module/Hero',
  moduleById = 'Module/:id',
  verifyMagicLink = 'verify-token',
  login = 'login',
  play = 'Module/Play',
  reports = 'Reports',
  gameplayScreen = ':module/dash',
  carousel = 'carousel',
  games = 'games',
  orgHandle = 'org/:orgHandle',
  orgSettings = 'org-settings',
  wikiwidget = 'wikiwidget',
  subscription = 'subscription',
  actions = 'Actions',
  pages = 'Pages',
}

export enum ThemeNames {
  DARK = 'dark',
  LIGHT = 'light',
}

const getDesignTokens = (
  mode: PaletteMode,
  primaryColor?: string,
  secColor?: string
) => ({
  palette: {
    mode,
    ...(mode === ThemeNames.LIGHT
      ? {
          // palette values for light mode
          background: {
            default: '#f9f9f9', // Light gray for background
            paper: '#ffffff', // White for paper elements
          },
          primary: {
            warning: '#D0342C', //A bright and vibrant red-orange. Such shades are often used for warnings or alerts.
            main: primaryColor || '#3B94FF', // Brand blue
            dark: '#005BBB', // Muted blue for primary.dark
            white: '#ffffff', //Pure white.
            text: '#333333', //
            light: '#85C7FF', // Softer blue
            contrastText: '#ffffff', // White text for buttons
          },
          secondary: {
            main: secColor || '#222222', // dark grey
            lGreen: '#00FF00', // Green
            ///#90EE90 - Light green
// #98FB98 - Pale green
// #CCFFCC - Very light mint
// #8FBC8F - Dark sea green
// #ADFF2F - Green yellow
// A softer light green like #90EE90 would be more visually comfortable in most interfaces.
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: '#121212', // Dark gray for background
            paper: '#1e1e1e', // Slightly lighter dark gray for paper elements
          },
          primary: {
            main: primaryColor || '#ad00ff', //// Purple
            dark: '#6B0086', // Muted purple for primary.dark
            warning: '#D0342C', ///(Same as in Light Mode) A bright and vibrant red-orange.
            text: '#333333', //light grey
            white: '#ffffff', //Pure white.
            light: '#FE79B9', // Brand pink
            contrastText: '#ffffff', // White text for buttons
            blue: '#3b94ff', // Brand blue
          },
          text: {
            primary: '#ffffff', // White for primary text
            secondary: '#b3b3b3', // Light gray for secondary text
          },
          secondary: {
            main: secColor || '#222222', // dark grey
            lGreen: '#00FF00', 
          },
        }),
  },
});

export const currentCounty = {
  county: 'Polk',
  state: 'Florida',
};

export enum IImgType {
  slider = 'slider',
  icon = 'icon',
}

export const createCustomTheme = (
  mode: PaletteMode,
  primaryColor: string,
  secColor: string
) => {
  return createTheme(getDesignTokens(mode, primaryColor, secColor));
};

export const darkModeTheme = createTheme(getDesignTokens('dark'));
export const lightModeTheme = createTheme(getDesignTokens('light'));

export enum CalendarTabValue {
  community = 0,
  personal = 1,
}

export interface IQuote {
  quote?: string;
  author?: string;
  id?: number;
}

export const avatarStyle = {
  marginTop: '-65px',
  bgcolor: '#ffffff',
  alignSelf: 'center',
  height: 65,
  width: 65,
};

export enum ModalBackgroundColor {
  red = `linear-gradient(195deg, rgb(255, 0, 0), rgb(255, 50, 50))`,
  green = `linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))`,
  orange = `linear-gradient(195deg, rgb(255, 167, 38), rgb(251, 140, 0))`,
}

export enum ModalBoxColor {
  red = 'rgb(0 0 0 / 14%) 0rem 0.25rem 1.25rem 0rem, rgb(255 0 0 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem',
  green = 'rgb(0 0 0 / 14%) 0rem 0.25rem 1.25rem 0rem, rgb(76 175 79 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem',
  orange = 'rgb(0 0 0 / 14%) 0rem 0.25rem 1.25rem 0rem, rgb(255, 167, 38 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem',
}
