import {
  Button,
  Slider,
  Switch,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  FormGroup,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Avatar,
  Input,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  alpha,
  Menu,
  MenuItem,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useGameStore } from '../RootStore/RootStoreProvider';
import { useEffect, useRef, useState } from 'react';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  VolumeUp,
  VolumeDown,
  VolumeOff,
  ExpandMore,
  MusicNote,
  SportsEsports,
  AccountBox,
  WorkspacePremium,
  Language
} from '@mui/icons-material';
import SubscriptionComponent from './components/Subscription/Subscription';
import { languageCodes } from '../google-translate/TranslateViewStore';

declare global {
  interface Window {
    UserWay?: {
      widgetOpen: () => void;
    };
  }
}

// --- Component for Profile Image Action Buttons ---
interface ProfileImageActionsProps {
  isUploadingImage: boolean;
  selectedFile: File | null;
  currentUserProfileImgId: string | null;
  uploadProfileImageAction: () => Promise<void>; // Assuming async
  clearImageSelection: () => void;
  removeProfileImageAction: () => Promise<void>; // Assuming async
  triggerFileInput: () => void;
}

const ProfileImageActions: React.FC<ProfileImageActionsProps> = ({
  isUploadingImage,
  selectedFile,
  currentUserProfileImgId,
  uploadProfileImageAction,
  clearImageSelection,
  removeProfileImageAction,
  triggerFileInput,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    minHeight: '40px'
  };

  if (isUploadingImage) {
    return (
      <div data-testid="profile-image-actions" style={containerStyle}>
        <CircularProgress data-testid="profile-image-spinner" size={24} color="inherit" />
      </div>
    );
  }

  if (selectedFile) {
    return (
      <div data-testid="profile-image-actions" style={containerStyle}>
        <Button
          data-testid="profile-image-upload-button"
          variant="contained"
          size="small"
          onClick={uploadProfileImageAction}
          startIcon={<PhotoCamera />}
        >
          Upload
        </Button>
        <IconButton data-testid="profile-image-cancel-button" size="small" onClick={clearImageSelection} title="Cancel Selection">
          <CancelIcon />
        </IconButton>
      </div>
    );
  }

  // Default case (no upload, no file selected)
  return (
    <div data-testid="profile-image-actions" style={containerStyle}>
      <Button
        data-testid="profile-image-add-change-button"
        variant="outlined"
        size="small"
        onClick={triggerFileInput}
        startIcon={<PhotoCamera />}
        sx={{ color: '#fff', borderColor: '#aaa' }} // sx might be okay on Button
      >
        {currentUserProfileImgId ? 'Change' : 'Add Image'}
      </Button>
      {currentUserProfileImgId && (
        <IconButton
          data-testid="profile-image-remove-button"
          size="small"
          onClick={removeProfileImageAction}
          title="Remove Image"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      )}
    </div>
  );
};
// --- End Component ---

export const Settings: React.FC = observer(() => {
  const { settingsViewStore, gamePlayViewStore, gameLoginViewStore, translateViewStore } = useGameStore();
  
  // Language dropdown state
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const openLanguageMenu = Boolean(languageAnchorEl);

  // Language menu handlers
  const handleLanguageMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageSelect = (langCode: string) => {
    if (translateViewStore.currentLanguage !== langCode) {
      translateViewStore.handleTranslateGame(langCode);
    }
    handleLanguageMenuClose();
  };

  // No-op function for accordion that shouldn't expand
  const noOpFunction = () => {};

  const {
    handleVolumeChange,
    volume,
    soundEffectsVolume,
    handleSoundEffectsVolumeChange,
    isMusicChecked,
    isSoundEffectsChecked,
    handleMusicToggle,
    handleSoundEffectsToggle,
    expandedSection,
    handleAccordionChange,
    isMasterAudioEnabled,
    handleMasterAudioToggle,
    audioRef,
    currentUserProfileImgId,
    selectedFile,
    imagePreviewUrl,
    isUploadingImage,
    imageUpdateError,
    imageUpdateSuccess,
    setCurrentUserProfileImgId,
    handleFileSelect,
    uploadProfileImageAction,
    removeProfileImageAction,
    clearImageSelection,
    clearImageStatus,
  } = settingsViewStore;

  const {
    displayNameInput,
    setDisplayNameInput,
    updateUserDisplayName,
    currUser,
    isUpdatingDisplayName,
    displayNameUpdateError,
    displayNameUpdateSuccess,
    setIsUpdatingDisplayName,
    setDisplayNameUpdateError,
    setDisplayNameUpdateSuccess
  } = gameLoginViewStore;

  const { setSensitivity, sensitivity } = gamePlayViewStore;

  // --- Destructure translated labels from translateViewStore --- 
  const { translatedGameData, currentLanguage, handleTranslateGame, isTranslating } = translateViewStore;
  const profileLabel = translatedGameData?.profileTabLabel || 'Profile';
  const displayNameLabel = translatedGameData?.profileTabLabel || 'Display Name';
  const savingLabel = translatedGameData?.savingLabel || 'Saving';
  const saveNameLabel = translatedGameData?.saveNameLabel || 'Save Name';
  const audioLabel = translatedGameData?.audioTabLabel || 'Audio';
  const movementLabel = translatedGameData?.movementTabLabel || 'Movement';
  const subscriptionLabel = translatedGameData?.subscriptionTabLabel || 'Subscription';
  const accessibilityLabel = translatedGameData?.accessibilityTabLabel || 'Accessibility';
  const settingsLabel = translatedGameData?.settingsLabel || 'Settings';
  // Use fallback for languageLabel since it's not in IGameData interface
  const languageLabel = 'Language';
  // TODO: Add keys/translations for other static text within this component if needed 
  // (e.g., "Display Name", "Master Audio", "Music", "Sound Effects", "Sensitivity", etc.)
  const masterAudioLabel = translatedGameData?.masterAudioLabel || 'Master Audio';
  const musicLabel = translatedGameData?.musicLabel || 'Music';
  const soundEffectsLabel = translatedGameData?.soundEffectsLabel || 'Sound Effects';
  const openAccessibilityWidgetLabel = translatedGameData?.openAccessibilityWidgetLabel || 'Open Accessibility Widget';

  useEffect(() => {
    if (audioRef) {
      audioRef.volume = volume / 200;
      handleVolumeChange(volume);
    }
  }, [audioRef, handleVolumeChange, volume]);

  // Ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Construct image source URL (replace with your actual logic/API endpoint)
  const profileImageUrl = currentUserProfileImgId
    ? `/api/images/${currentUserProfileImgId}` // Example endpoint
    : null;

  const getMusicVolumeIcon = () => {
    if (!isMusicChecked || volume === 0) return <VolumeOff />;
    if (volume < 50) return <VolumeDown />;
    return <VolumeUp />;
  };

  const getSoundEffectsVolumeIcon = () => {
    if (!isSoundEffectsChecked || soundEffectsVolume === 0)
      return <VolumeOff />;
    if (soundEffectsVolume < 50) return <VolumeDown />;
    return <VolumeUp />;
  };

  const isFreeMovementEnabled = false;

  const handleDisplayNameUpdate = async () => {
    // Always ensure loading state is turned on
    setIsUpdatingDisplayName(true);
    setDisplayNameUpdateError(null);
    setDisplayNameUpdateSuccess(null);

    try {
      const result = await updateUserDisplayName(displayNameInput);

      if (result.success) {
        setDisplayNameUpdateSuccess('Display name updated successfully!');
      } else {
        // Check if it's the specific profanity error message
        if (result.message === 'Display name contains inappropriate language.') {
          setDisplayNameUpdateError('Bad language detected. Try another name');
        } else {
          // Handle other potential failure messages from the store if added later
          setDisplayNameUpdateError(result.message || 'An unknown error occurred');
        }
      }
    } catch (error) {
      console.error("[Settings] Unexpected error calling updateUserDisplayName:", error);
      setDisplayNameUpdateError("An unexpected error occurred.");
    } finally {
      // Always ensure loading state is turned off
      setIsUpdatingDisplayName(false);
    }
  };

  return (
    <div
      data-testid="settings-container"
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1em',
        color: '#fff',
        padding: '1em',
        width: '100%',
        backgroundColor: 'transparent',
        overflowY: 'auto',
      }}
    >
      {/* --- Use translated settings label --- */}
      <Typography data-testid="settings-title" variant="h5">{settingsLabel}</Typography>

      {/* Profile Accordion */}
      <Accordion
        data-testid="profile-accordion"
        expanded={expandedSection === 'profile'}
        onChange={() => handleAccordionChange('profile')}
        sx={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <AccordionSummary
          data-testid="profile-accordion-summary"
          expandIcon={<ExpandMore />}
          aria-controls="profile-content"
          id="profile-header"
          sx={{ color: '#fff' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AccountBox />
            {/* --- Use translated profile label --- */}
            <Typography variant="h6">{profileLabel}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* --- Profile Image Section --- */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {/* <Typography data-testid="profile-image-title" variant="subtitle1" sx={{ mb: 1 }}>Profile Picture</Typography> */}
            {/* <Avatar
              data-testid="profile-image-avatar"
              src={imagePreviewUrl || profileImageUrl || undefined} // Show preview, then current, then default
              sx={{ width: 80, height: 80, mb: 1, bgcolor: 'primary.main' }}
            >
              {/* Fallback Icon if no src */}
            {/*  {!imagePreviewUrl && !profileImageUrl && <AccountCircleIcon sx={{ fontSize: 50 }} />}
            </Avatar> */}

            {/* Hidden File Input */}
            {/* <Input
              type="file"
              inputRef={fileInputRef}
              onChange={handleFileSelect}
              sx={{ display: 'none' }}
              inputProps={{ accept: 'image/*' }}
            /> */}

            {/* Conditional Buttons based on selection/upload state */}
            {/* <ProfileImageActions
              data-testid="profile-image-actions-component"
              isUploadingImage={isUploadingImage}
              selectedFile={selectedFile}
              currentUserProfileImgId={currentUserProfileImgId}
              uploadProfileImageAction={uploadProfileImageAction}
              clearImageSelection={clearImageSelection}
              removeProfileImageAction={removeProfileImageAction}
              triggerFileInput={() => fileInputRef.current?.click()}
            /> */}

            {/* Image Status Messages */}
            {/* {imageUpdateError && <Alert data-testid="profile-image-error" severity="error" sx={{ mt: 1, width: '100%' }}>{imageUpdateError}</Alert>} */}
            {/* {imageUpdateSuccess && <Alert data-testid="profile-image-success" severity="success" sx={{ mt: 1, width: '100%' }}>{imageUpdateSuccess}</Alert>} */}
          </div>

          {/* --- Display Name Section --- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography data-testid="display-name-title" variant="subtitle1">{displayNameLabel}</Typography>
            <TextField
              data-testid="display-name-input"
              label={displayNameLabel}
              variant="outlined"
              value={displayNameInput}
              onChange={(e) => setDisplayNameInput(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' } }}
              disabled={isUpdatingDisplayName}
            />
            {/* --- CHANGE START: Conditional Severity --- */}
            {displayNameUpdateError && 
              <Alert 
                data-testid="display-name-error" 
                severity={displayNameUpdateError === 'Bad language detected. Try another name' ? 'error' : 'warning'}
              >
                {displayNameUpdateError}
              </Alert>}
            {/* --- CHANGE END --- */}
            {displayNameUpdateSuccess && <Alert data-testid="display-name-success" severity="success">{displayNameUpdateSuccess}</Alert>}
            <Button
              data-testid="display-name-save-button"
              variant="contained"
              onClick={handleDisplayNameUpdate}
              disabled={isUpdatingDisplayName || displayNameInput === currUser?.displayName}
              sx={{ color: '#fff', bgcolor: 'primary.main', alignSelf: 'flex-start' }}
              startIcon={isUpdatingDisplayName ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isUpdatingDisplayName ? `${savingLabel}...` : saveNameLabel}
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Audio Controls Accordion */}
      <Accordion
        data-testid="audio-accordion"
        expanded={expandedSection === 'audio'}
        onChange={() => handleAccordionChange('audio')}
        sx={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <AccordionSummary
          data-testid="audio-accordion-summary"
          expandIcon={<ExpandMore />}
          aria-controls="audio-content"
          id="audio-header"
          sx={{ color: '#fff' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MusicNote />
            {/* --- Use translated audio label --- */}
            <Typography variant="h6">{audioLabel}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {/* Master Audio Toggle */}
            <FormControlLabel
              data-testid="master-audio-switch-label"
              control={
                <Switch
                  data-testid="master-audio-switch"
                  checked={isMasterAudioEnabled}
                  onChange={(e) => handleMasterAudioToggle(e.target.checked)}
                />
              }
              label={masterAudioLabel}
              sx={{ mb: 2 }}
            />

            {/* Master Audio Slider */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px',
                opacity: isMasterAudioEnabled ? 1 : 0.6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1">Master Volume</Typography>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {getMusicVolumeIcon()}
                  <Typography variant="body2">{Math.round(volume)}%</Typography>
                </div>
              </div>
              <Slider
                data-testid="master-volume-slider"
                value={volume}
                onChange={(_, value) => handleVolumeChange(value as number)}
                aria-label="Master Volume"
                min={0}
                max={100}
                disabled={!isMasterAudioEnabled}
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: (theme) =>
                        `0 0 0 8px ${theme.palette.primary.main}33`,
                    },
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.28,
                  },
                }}
              />
            </div>

            {/* Music Controls - Commented out for now */}
            {/* <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px',
                opacity: isMasterAudioEnabled ? 1 : 0.6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FormControlLabel
                  data-testid="music-switch-label"
                  control={
                    <Switch
                      data-testid="music-switch"
                      checked={isMusicChecked}
                      onChange={(e) => handleMusicToggle(e.target.checked)}
                      disabled={!isMasterAudioEnabled}
                    />
                  }
                  label={musicLabel}
                />
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {getMusicVolumeIcon()}
                  <Typography variant="body2">{Math.round(volume)}%</Typography>
                </div>
              </div>
              <Slider
                data-testid="music-slider"
                value={volume}
                onChange={(_, value) => handleVolumeChange(value as number)}
                aria-label="Music Volume"
                min={0}
                max={100}
                disabled={!isMusicChecked || !isMasterAudioEnabled}
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: (theme) =>
                        `0 0 0 8px ${theme.palette.primary.main}33`,
                    },
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.28,
                  },
                }}
              />
            </div> */}

            {/* Sound Effects Controls - Commented out for now */}
            {/* <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                opacity: isMasterAudioEnabled ? 1 : 0.6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FormControlLabel
                  data-testid="sfx-switch-label"
                  control={
                    <Switch
                      data-testid="sfx-switch"
                      checked={isSoundEffectsChecked}
                      onChange={(e) =>
                        handleSoundEffectsToggle(e.target.checked)
                      }
                      disabled={!isMasterAudioEnabled}
                    />
                  }
                  label={soundEffectsLabel}
                />
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {getSoundEffectsVolumeIcon()}
                  <Typography variant="body2">
                    {Math.round(soundEffectsVolume)}%
                  </Typography>
                </div>
              </div>
              <Slider
                data-testid="sfx-slider"
                value={soundEffectsVolume}
                onChange={(_, value) =>
                  handleSoundEffectsVolumeChange(value as number)
                }
                aria-label="Sound Effects Volume"
                min={0}
                max={100}
                disabled={!isSoundEffectsChecked || !isMasterAudioEnabled}
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: (theme) =>
                        `0 0 0 8px ${theme.palette.primary.main}33`,
                    },
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.28,
                  },
                }}
              />
            </div> */}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Movement Controls Accordion - Temporarily Hidden */}
      {false && (
        <Accordion
          expanded={expandedSection === 'movement'}
          onChange={() => handleAccordionChange('movement')}
          sx={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="movement-content"
            id="movement-header"
            sx={{ color: '#fff' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SportsEsports />
              {/* --- Use translated movement label --- */}
              <Typography variant="h6">{movementLabel}</Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {/* Free Movement Toggle */}
              {/* <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: '16px'
                }}
              >
                <Typography variant="body1">Free Movement</Typography>
                <Switch
                  checked={isFreeMovementEnabled}
                  onChange={(e) => toggleFreeMovement(e.target.checked)}
                />
              </div> */}

              {/* Sensitivity Slider */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  opacity: isFreeMovementEnabled ? 1 : 0.6,
                }}
              >
                <Typography variant="body1">Sensitivity</Typography>
                <Slider
                  step={0.1}
                  size="small"
                  value={sensitivity}
                  max={2}
                  min={0.1}
                  onChange={(_, value) => setSensitivity(value as number)}
                  aria-label="Sensitivity"
                  valueLabelDisplay="auto"
                  disabled={!isFreeMovementEnabled}
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: (theme) =>
                          `0 0 0 8px ${theme.palette.primary.main}33`,
                      },
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.28,
                    },
                  }}
                />
              </div>
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Subscription Plans Accordion - Temporarily Hidden */}
      {false && (
        <Accordion
          expanded={expandedSection === 'subscription'}
          onChange={() => handleAccordionChange('subscription')}
          sx={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="subscription-content"
            id="subscription-header"
            sx={{ color: '#fff' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <WorkspacePremium />
              {/* --- Use translated subscription label --- */}
              <Typography variant="h6">{subscriptionLabel}</Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <SubscriptionComponent title="Subscription Plans" />
          </AccordionDetails>
        </Accordion>
      )}

      {/* Language Controls Accordion */}
      <Accordion
        data-testid="language-accordion"
        expanded={false}
        sx={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <AccordionSummary
          data-testid="language-accordion-summary"
          expandIcon={null}
          aria-controls="language-content"
          id="language-header"
          sx={{ color: '#fff', cursor: 'pointer' }}
          onClick={handleLanguageMenuClick}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Language />
            <Typography variant="h6">
              {`${languageCodes[translateViewStore.currentLanguage] || 'English'}`}
              {translateViewStore.isTranslating && ' (Translating...)'}
            </Typography>
          </div>
        </AccordionSummary>
      </Accordion>

      {/* Language Menu */}
      <Menu
        anchorEl={null}
        open={openLanguageMenu}
        onClose={handleLanguageMenuClose}
        anchorReference="none"
        PaperProps={{
          style: {
            maxHeight: '80vh',
            width: '300px',
            borderRadius: '1rem',
            position: 'fixed',
            top: '10vh',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100vw - 2rem)',
            overflow: 'hidden',
          },
        }}
        MenuListProps={{
          style: {
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            maxHeight: '70vh',
            overflowY: 'auto',
          },
        }}
      >
        {Object.entries(languageCodes).map(([langCode, language]: [string, string]) => (
          <MenuItem 
            key={langCode} 
            selected={translateViewStore.currentLanguage === langCode}
            onClick={() => handleLanguageSelect(langCode)}
            disabled={translateViewStore.isTranslating}
          >
            {language}
          </MenuItem>
        ))}
      </Menu>

      {/* Accessibility Controls at the bottom */}
      <Accordion
        data-testid="accessibility-accordion"
        expanded={expandedSection === 'accessibility'}
        onChange={() => handleAccordionChange('accessibility')}
        sx={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', mt: 'auto' }}
      >
        <AccordionSummary
          data-testid="accessibility-accordion-summary"
          expandIcon={<ExpandMore />}
          aria-controls="accessibility-content"
          id="accessibility-header"
          sx={{ color: '#fff' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AccessibilityNewIcon />
            {/* --- Use translated accessibility label --- */}
            <Typography variant="h6">{accessibilityLabel}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              data-testid="accessibility-widget-button"
              variant="contained"
              startIcon={<AccessibilityNewIcon />}
              onClick={() => {
                if (window.UserWay) {
                  window.UserWay.widgetOpen();
                }
              }}
              sx={{ color: '#fff', bgcolor: 'rgba(0,0,0,0.3)' }}
            >
              {openAccessibilityWidgetLabel}
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
});
