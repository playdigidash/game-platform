import GameImage from '../ui/GameImage';
import GameButton from '../ui/GameButton';
import {
  Badge,
  BadgeProps,
  Box,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { styled, alpha, Theme } from '@mui/material/styles';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import { useNavigate, useLocation } from 'react-router-dom';
import AchievementPopup from '../modals/AchievementPopup';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language';
import {
  ColorLabels,
  AppRoute,
  IGameUserModel,
  ICustomModule,
  IQuestData,
  IPlayedQuestionMap,
} from '@lidvizion/commonlib';
import { LoginIconBtn } from '../login/LoginIconBtn';
import { QrCodeModal } from './QrCodeModal';
import { useState, useEffect, useMemo } from 'react';
import { languageCodes } from '../google-translate/TranslateViewStore';
import { QuestLine } from '../quest/QuestLine';
import { IQuestLineProps } from '../quest/QuestLineProps';
import { motion } from 'framer-motion';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    color: 'white',
    background: 'black',
    height: 'fit-content',
    right: 15,
  },
}));

const SmokeBackground = styled('div')(({ theme }: { theme: Theme }) => ({
  width: '100vw',
  height: '100vh',
  backgroundSize: '180% 180%',
  animation: 'move-smoke 10s infinite',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',

  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    opacity: 0.6,
    animation: 'swirl 8s infinite linear',
  },
  '&::before': {
    background: `radial-gradient(circle, ${alpha(
      theme.palette.primary.main,
      0.5
    )}, transparent)`,
  },
  '&::after': {
    background: `radial-gradient(circle, ${alpha(
      theme.palette.secondary.main,
      0.5
    )}, transparent)`,
    animationDuration: '12s',
  },
  '@keyframes move-smoke': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
  '@keyframes swirl': {
    '0%': {
      transform: 'translate(-50%, -50%) rotate(0deg)',
    },
    '100%': {
      transform: 'translate(-50%, -50%) rotate(360deg)',
    },
  },
}));

interface TopRightContentProps {
  welcomeLabel: string;
  displayNameToShow: string | null;
  isAnonLogin: boolean;
  currUser: IGameUserModel | null;
  openProfileSettings: () => void;
  isTranslating: boolean;
  currentLanguage: string;
  handleTranslateGame: (langCode: string) => void;
}

const TopRightContent: React.FC<TopRightContentProps> = ({
  welcomeLabel,
  displayNameToShow,
  isAnonLogin,
  currUser,
  openProfileSettings,
  isTranslating,
  currentLanguage,
  handleTranslateGame,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openLanguageMenu = Boolean(anchorEl);

  const handleLanguageMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (langCode: string) => {
    if (currentLanguage !== langCode) {
      handleTranslateGame(langCode);
    }
    handleLanguageMenuClose();
  };

  return (
    <>
      <IconButton
        onClick={() => openProfileSettings()}
        size="small"
        title="Settings"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '2px',
          mr: 1,
          '&:hover': {
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <SettingsIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>

      <IconButton
        id="language-button"
        aria-controls={openLanguageMenu ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openLanguageMenu ? 'true' : undefined}
        onClick={handleLanguageMenuClick}
        size="small"
        title="Change Language"
        disabled={isTranslating}
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '2px',
          mr: 1,
          '&:hover': {
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <LanguageIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={openLanguageMenu}
        onClose={handleLanguageMenuClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        PaperProps={{
          style: {
            maxHeight: '18.75rem',
            width: '20ch',
            backgroundColor: theme.palette.background.paper,
            borderRadius: '1rem',
          },
        }}
      >
        <List dense sx={{ padding: 0 }}>
          {Object.entries(languageCodes).map(
            ([langCode, language]: [string, string]) => (
              <ListItem
                key={langCode}
                disablePadding
                sx={{
                  borderRadius: '0.5rem',
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                  padding: '0 8px',
                }}
              >
                <ListItemButton
                  selected={currentLanguage === langCode}
                  onClick={() => handleLanguageSelect(langCode)}
                  sx={{
                    borderRadius: '0.5rem',
                    padding: '0.4rem 0.8rem',
                  }}
                  disabled={isTranslating}
                >
                  <ListItemText
                    primary={language}
                    sx={{ color: theme.palette.text.primary }}
                  />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Menu>

      {displayNameToShow && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Typography variant="body2" style={{ opacity: 0.9 }}>
            {welcomeLabel} {displayNameToShow}!
          </Typography>
          {!isAnonLogin && currUser?.displayName && (
            <IconButton
              onClick={openProfileSettings}
              size="small"
              title="Edit Profile"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '2px',
                '&:hover': {
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <EditIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          )}
        </div>
      )}

      {isAnonLogin && <LoginIconBtn />}

      {!isAnonLogin && !currUser?.displayName && (
        <IconButton
          onClick={openProfileSettings}
          size="small"
          title="Set your display name"
          sx={{
            color: 'white',
            background: (theme) => alpha(theme.palette.secondary.main, 0.3),
            '&:hover': {
              background: (theme) => alpha(theme.palette.secondary.main, 0.5),
            },
          }}
        >
          <PersonAddIcon fontSize="small" />
        </IconButton>
      )}
    </>
  );
};

export const MainScreen = observer(() => {
  const theme = useTheme();
  const {
    setShowMenuScreen,
    logoSrc,
    bannerSrc,
    hasBanner,
    hasLogo,
    imageDebugInfo,
    settings,
    showMenuScreen,
    playedQuestions,
    getApiQuestions,
    setQuestAttempt,
    questData,
    questReset,
    totalQuestParts,
    gameSession,
  } = useGameStore().gameViewStore;
  const { playGame, setPlayGame, gotAchievement } =
    useGameStore().gamePlayViewStore;
  const { setShowPauseModal } = useGameStore().pauseMenuViewStore;
  const { isAnonLogin, currUser } = useGameStore().gameLoginViewStore;
  const { handleAccordionChange: handleSettingsAccordionChange } =
    useGameStore().settingsViewStore;
  const guestDisplayName = 'GuestPlayer123';
  const navigate = useNavigate();
  const location = useLocation();
  const { shouldShowQrCodeModal, setShowQrCodeModal } =
    useGameStore().gamePlayViewStore;
  const [currentUrl, setCurrentUrl] = useState('');
  const {
    isTranslating,
    translatedGameData,
    currentLanguage,
    handleTranslateGame,
  } = useGameStore().translateViewStore;
  const [isQuestTransitioning, setIsQuestTransitioning] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleDescriptionClick = (
    event: React.MouseEvent<HTMLDivElement>,
    description: string | undefined
  ) => {
    if (!description) return;

    const target = event.currentTarget;
    const popover = document.createElement('div');
    popover.style.position = 'fixed';
    popover.style.left = `${target.getBoundingClientRect().left}px`;
    popover.style.top = `${target.getBoundingClientRect().bottom + 8}px`;
    popover.style.padding = '1rem';
    popover.style.background = 'rgba(0, 0, 0, 0.9)';
    popover.style.borderRadius = '0.5rem';
    popover.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.2)';
    popover.style.maxWidth = '80vw';
    popover.style.zIndex = '1000';
    popover.style.fontFamily = "'Orbitron', sans-serif";
    popover.style.color = '#fff';
    popover.innerText = description;

    const closePopover = () => {
      if (document.body.contains(popover)) {
        document.body.removeChild(popover);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!popover.contains(e.target as Node)) {
        closePopover();
      }
    };

    document.body.appendChild(popover);
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
  };

  const displayNameToShow = isAnonLogin
    ? 'Guest' // Placeholder for guest name
    : currUser?.displayName || 'Anonymous User'; // Fallback if display name is empty

  const openProfileSettings = () => {
    setShowPauseModal(true);
    handleSettingsAccordionChange('profile');
  };

  // --- Define defaults for labels used in this component ---
  const welcomeLabel = translatedGameData?.welcomeLabel || 'Welcome,';

  return showMenuScreen ? (
    <SmokeBackground theme={theme}>
      <Box
        component="div"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: `${hasBanner ? 'flex-start' : 'center'}`,
          height: '100vh',
          width: '100vw',
          maxHeight: '100vh',
          overflow: 'hidden', // Changed from 'auto' to 'hidden'
          position: 'relative',
          paddingTop: '5rem', // Reduced from 6rem to 5rem
          paddingBottom: '1rem',
        }}
      >
        {hasBanner && (
          <Box
            component="div"
            style={{
              position: 'relative',
              width: '100%',
              marginTop: '1rem',
              marginBottom: '2rem',
            }}
          >
            <GameImage
              width="100%"
              height={'15vh'}
              src={bannerSrc}
              alt="Sponsored Banner"
            />
            <Typography
              sx={{
                textAlign: 'center',
                opacity: 0.7,
                marginTop: '-1rem',
                position: 'absolute',
                background: 'black',
                borderTopRightRadius: '1rem',
                p: '0.2rem 0.5rem',
                bottom: 0,
                left: 0,
              }}
            >
              Presented by
            </Typography>
          </Box>
        )}

        <Box
          className="settings-main-screen"
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            background: 'rgba(0, 0, 50, 0.3)',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            backdropFilter: 'blur(0.3125rem)',
            boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
            color: 'white',
            width: '100%',
            marginBottom: '0.5rem',
          }}
        >
          {/* Left side - Home button */}
          <IconButton
            onClick={() => navigate('/' + AppRoute.games)}
            size="small"
            title="Home"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              padding: '2px',
              '&:hover': {
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <HomeIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>

          {/* Right side - Settings, Language, Display Name */}
          <TopRightContent
            welcomeLabel={welcomeLabel}
            displayNameToShow={displayNameToShow}
            isAnonLogin={isAnonLogin}
            currUser={currUser}
            openProfileSettings={openProfileSettings}
            isTranslating={isTranslating}
            currentLanguage={currentLanguage}
            handleTranslateGame={handleTranslateGame}
          />
        </Box>

        <Box
          component="div"
          sx={{
            width: '100%',
            padding: '0.75rem',
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.2
              )}, ${alpha(theme.palette.secondary.main, 0.2)})`,
            borderRadius: '1rem',
            backdropFilter: 'blur(0.625rem)',
            boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.2)',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="gameHeading"
            sx={{
              textAlign: 'center',
              background: (theme) =>
                `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[300]} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: (theme) =>
                `drop-shadow(0 0 0.5rem ${theme.palette.common.white}30)`,
              fontSize: {
                xs: 'clamp(1rem, 5vw, 2.5rem)',
                md: 'clamp(1.5rem, 4vw, 3rem)',
              },
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '95%',
            }}
          >
            {translatedGameData?.title}
          </Typography>
        </Box>

        {(settings.gDesc || translatedGameData?.desc) && (
          <Box
            component="div"
            sx={{
              width: '100%',
              padding: '1.5rem',
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.1
                )}, ${alpha(theme.palette.secondary.main, 0.1)})`,
              borderRadius: '0.75rem',
              backdropFilter: 'blur(0.3125rem)',
              boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
              marginBottom: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              justifyContent: 'center',
              '&:hover': {
                background: (theme) =>
                  `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.15
                  )}, ${alpha(theme.palette.secondary.main, 0.15)})`,
                transform: 'translateY(-0.125rem)',
                boxShadow: '0 0.35rem 0.7rem rgba(0,0,0,0.2)',
              },
            }}
            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
              handleDescriptionClick(
                event,
                translatedGameData?.desc || settings.gDesc
              )
            }
          >
            <Typography
              variant="gameText"
              sx={{
                textAlign: 'center',
                opacity: 0.9,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: (theme) => theme.palette.common.white,
                letterSpacing: '0.05em',
                fontWeight: 500,
                maxWidth: '95%',
              }}
            >
              {translatedGameData?.desc || settings.gDesc || ''}
            </Typography>
          </Box>
        )}

        <Box
          component="div"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '40rem',
            margin: '0 auto',
          }}
        >
          {(() => {
            const gameImageSx = {
              borderRadius: '2rem',
              overflow: 'hidden',
              boxShadow: '0 0.5rem 2rem rgba(0,0,0,0.3)',
              maxWidth: '80vw',
              maxHeight: '35vh',
              objectFit: 'cover',
            };

            return (
              <GameImage
                width={'22rem'}
                height={'22rem'}
                src={logoSrc}
                alt="Digi Dash Loading Logo"
                useImgTag={true}
                sx={gameImageSx}
              />
            );
          })()}

          {totalQuestParts.parts > 0 && (
            <QuestLine currentQuestPart={gameSession.questPart} />
          )}
        </Box>
      </Box>
      {shouldShowQrCodeModal && (
        <QrCodeModal
          url={currentUrl}
          open={true}
          onClose={() => setShowQrCodeModal(false)}
        />
      )}
    </SmokeBackground>
  ) : null;
});
