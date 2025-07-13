import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, 
  MenuItem, Select, IconButton, Menu, alpha } from '@mui/material';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { observer } from 'mobx-react';
import { languageCodes } from './TranslateViewStore';
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from 'react';

const menuItems = Object.entries(languageCodes).map(
  ([langCode, language]: [string, string]) => (
    <MenuItem key={langCode} value={langCode}>
      {language}
    </MenuItem>
  )
);

export const LanguageSwitcher: React.FC = observer(() => {
  const theme = useTheme();
  const { currentLanguage, handleTranslateGame, isTranslating } = useGameStore().translateViewStore;
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
        id="icon-language-button"
        aria-controls={openLanguageMenu ? 'icon-language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openLanguageMenu ? 'true' : undefined}
        onClick={handleLanguageMenuClick}
        size="medium"
        title="Change Language"
        disabled={isTranslating}
        sx={{
          color: 'grey',
          // bgcolor: alpha(theme.palette.primary.main, 0.3),
          backdropFilter: 'blur(5px)',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.5),
          },
        }}
      >
        <LanguageIcon sx={{ fontSize: '1.5rem' }} />
      </IconButton>
      <Menu
        id="icon-language-menu"
        anchorEl={anchorEl}
        open={openLanguageMenu}
        onClose={handleLanguageMenuClose}
        MenuListProps={{
          'aria-labelledby': 'icon-language-button',
        }}
        PaperProps={{
          style: {
            maxHeight: '18.75rem',
            width: '20ch',
            // backgroundColor: theme.palette.background.paper,
            borderRadius: '1rem',
          },
        }}
      >
        {Object.entries(languageCodes).map(([langCode, language]: [string, string]) => (
          <MenuItem 
            key={langCode} 
            selected={currentLanguage === langCode}
            onClick={() => handleLanguageSelect(langCode)}
            disabled={isTranslating}
          >
            {language}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});