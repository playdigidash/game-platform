import { alpha } from '@mui/material/styles';

import { IGameUserModel } from '@lidvizion/commonlib';
import AchievementPopup from '../modals/AchievementPopup';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language';
import { languageCodes } from '../google-translate/TranslateViewStore';
import { LoginIconBtn } from '../login/LoginIconBtn';

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

import { useState } from 'react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react';

const topRightDivStyle: React.CSSProperties = {
  position: 'fixed',
  top: '1rem',
  right: '1rem',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: 'rgba(0, 0, 50, 0.3)',
  padding: '0.25rem 0.75rem',
  borderRadius: '1rem',
  backdropFilter: 'blur(0.3125rem)',
  boxShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.15)',
  color: 'white',
};

export const TopRightMainScreen: React.FC = observer(() => {
  const theme = useTheme();
  const { handleTranslateGame, currentLanguage, isTranslating } =
    useGameStore().translateViewStore;
  const { openProfileSettings } = useGameStore().settingsViewStore;
  const { isAnonLogin, currUser } = useGameStore().gameLoginViewStore;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openLanguageMenu = Boolean(anchorEl);
  const { displayNameToShow, welcomeLabel } = useGameStore().gameViewStore;

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
    <div style={topRightDivStyle}>
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
    </div>
  );
});
