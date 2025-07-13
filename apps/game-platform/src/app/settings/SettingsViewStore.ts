import { action, makeAutoObservable, observable, reaction } from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import CancelIcon from '@mui/icons-material/Cancel'; // Icon for cancel selection
import { VolumeUp, VolumeDown } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { updateGameUser } from '@lidvizion/commonlib'; // Import the update function

export class SettingsViewStore {
  root: RootStore;
  isMusicChecked = true;
  isSoundEffectsChecked = true;
  isLimitedEffects = false;
  isLimitedAnimations = false;
  volume = 1.5; // This will be normalized to 0.0075 (1.5/200)
  soundEffectsVolume = 1.5;
  previousVolume = 1.5;
  previousSoundEffectsVolume = 1.5;
  maxVolume = 100;
  // Accordion state management
  expandedSection: string | false = false;
  isMasterAudioEnabled = true;
  // Moving audioRef from mainSceneViewStore
  audioRef: HTMLAudioElement | null = null;

  // --- Profile Image State ---
  currentUserProfileImgId: string | null = null; // Stores ID/UUID from user_game_profile.profileImg
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  isUploadingImage = false;
  imageUpdateError: string | null = null;
  imageUpdateSuccess: string | null = null;
  // --- End Profile Image State ---

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this, {
      // No need to list simple observables when using makeAutoObservable
      // unless you need specific options like { deep: false }
      // audioRef might need special handling if it's complex, but let's assume not for now.
      // Explicitly marking actions if needed for older MobX or complex cases:
      // setAudioRef: action,
      // handleAccordionChange: action,
      // ... etc.
    });
  }

  // Method to set audio reference
  setAudioRef = (ref: HTMLAudioElement | null) => {
    action(() => {
      this.audioRef = ref;
      if (ref) {
        // Initialize volume
        ref.volume = this.volume / 200;
      }
    })();
  };

  // Accordion management
  handleAccordionChange = (section: string) => {
    action(() => {
      this.expandedSection = this.expandedSection === section ? false : section;
    })();
  };

  resetExpandedSections = () => {
    action(() => {
      this.expandedSection = false;
    })();
  };
  setVolume = (newVolume: number) => {
    action(() => {
      const limitedVolume = Math.min(newVolume, this.maxVolume);
      this.volume = limitedVolume;
      if (this.audioRef) {
        const normalizedVolume = limitedVolume / 200; // Convert to 0-0.5 range
        this.adjustVolume(this.audioRef, normalizedVolume);
      }
      this.setIsMusicChecked(limitedVolume > 0);

      // Update master audio state based on both music and sound effects state
      this.updateMasterAudioState();
    })();
  };

  openProfileSettings = action(() => {
    this.root.pauseMenuViewStore.setShowPauseModal(true);
    this.handleAccordionChange('profile');
  });

  // Add method to handle master audio toggle
  handleMasterAudioToggle = (isEnabled: boolean) => {
    action(() => {
      this.isMasterAudioEnabled = isEnabled;

      if (isEnabled) {
        // Turn both music and sound effects back on
        if (this.previousVolume > 0) {
          this.handleMusicToggle(true);
        }
        if (this.previousSoundEffectsVolume > 0) {
          this.handleSoundEffectsToggle(true);
        }
      } else {
        // Store current states before turning off
        if (this.volume > 0) {
          this.updatePreviousVolume();
        }
        if (this.soundEffectsVolume > 0) {
          this.updatePreviousSoundEffectsVolume();
        }

        // Turn both music and sound effects off
        this.handleMusicToggle(false);
        this.handleSoundEffectsToggle(false);
      }
    })();
  };

  // Helper method to update master audio state based on music and sound effects
  updateMasterAudioState = () => {
    action(() => {
      this.isMasterAudioEnabled =
        this.isMusicChecked || this.isSoundEffectsChecked;
    })();
  };

  // Method to check if sensitivity slider should be enabled
  isSensitivityEnabled = () => {
    // No state change, just a check - action wrapper likely not needed
    return false;
  };

  // Method to toggle free movement and handle sensitivity
  // toggleFreeMovement = action((isEnabled: boolean) => {
  //   const laneSelection = isEnabled ? 'Free movement' : 'Three Lane';
  //   this.root.gamePlayViewStore.setLaneSelection(laneSelection);
  // });

  setSoundEffectsVolume = (newVolume: number) => {
    action(() => {
      const limitedVolume = Math.min(newVolume, this.maxVolume);
      this.soundEffectsVolume = limitedVolume;

      this.setIsSoundEffectsChecked(limitedVolume > 0);

      // Update master audio state
      this.updateMasterAudioState();
    })();
  };

  getVolume = () => {
    // Simple getter, action wrapper not needed
    return this.volume;
  };

  getSoundEffectsVolume = () => {
    // Simple getter, action wrapper not needed
    return this.soundEffectsVolume;
  };

  updatePreviousVolume = () => {
    action(() => {
      this.previousVolume = this.volume;
    })();
  };

  updatePreviousSoundEffectsVolume = () => {
    action(() => {
      this.previousSoundEffectsVolume = this.soundEffectsVolume;
    })();
  };

  isMute = () => {
    // Simple getter, action wrapper not needed
    return this.volume === 0;
  };

  isSoundEffectsMute = () => {
    // Simple getter, action wrapper not needed
    return this.soundEffectsVolume === 0;
  };

  setIsMusicChecked = (bool: boolean) => {
    action(() => {
      this.isMusicChecked = bool;

      // Update master audio state
      this.updateMasterAudioState();
    })();
  };

  setIsSoundEffectsChecked = (bool: boolean) => {
    action(() => {
      this.isSoundEffectsChecked = bool;

      // Update master audio state
      this.updateMasterAudioState();
    })();
  };

  setIsLimitedEffects = (bool: boolean) => {
    action(() => {
      this.isLimitedEffects = bool;
    })();
  };

  setIsLimitedAnimations = (bool: boolean) => {
    action(() => {
      this.isLimitedAnimations = bool;
    })();
  };

  handleMusicToggle = (bool: boolean) => {
    action(() => {
      const audio = this.audioRef;
      this.setIsMusicChecked(bool);

      if (bool) {
        if (audio) {
          this.adjustVolume(audio, this.volume / 200, { duration: 1000 });
        }
      } else {
        if (audio) {
          this.adjustVolume(audio, 0, { duration: 750 });
        }
      }
    })();
  };

  handleSoundEffectsToggle = (bool: boolean) => {
    action(() => {
      this.setIsSoundEffectsChecked(bool);

      if (bool) {
        // Re-enable sound effects at the current volume
        if (this.soundEffectsVolume === 0) {
          this.soundEffectsVolume =
            this.previousSoundEffectsVolume > 0
              ? this.previousSoundEffectsVolume
              : 100;
        }
      } else {
        // Store current volume before muting
        if (this.soundEffectsVolume > 0) {
          this.updatePreviousSoundEffectsVolume();
        }
        // We don't set volume to 0 here to allow the slider to remember its value
        // Just the toggle state indicates whether sound effects should play
      }

      // Update master audio state
      this.updateMasterAudioState();
    })();
  };

  adjustVolume = (
    element: HTMLMediaElement,
    newVolume: number,
    {
      duration = 1000,
      easing = this.swing,
      interval = 13,
    }: {
      duration?: number;
      easing?: (n: number) => number;
      interval?: number;
    } = {}
  ) => {
    const originalVolume = element.volume;
    const delta = newVolume - originalVolume;

    if (!this.isMusicChecked && newVolume > 0) {
      element.volume = 0;
      return Promise.resolve();
    }

    if (!delta || !duration || !easing || !interval) {
      element.volume = newVolume;
      return Promise.resolve();
    }

    const ticks = Math.floor(duration / interval);
    let tick = 1;

    return new Promise((resolve) => {
      const timer = setInterval(() => {
        const currentVolume = originalVolume + easing(tick / ticks) * delta;
        element.volume = currentVolume;

        if (++tick === ticks + 1) {
          clearInterval(timer);
          resolve(null);
        }
      }, interval);
    });
  };

  adjustSoundEffectsVolume = (soundElement: HTMLAudioElement) => {
    // No state change directly, just setting volume on external element
    // Action wrapper likely not needed
    if (!this.isSoundEffectsChecked) {
      soundElement.volume = 0;
    } else {
      const normalizedVolume = this.soundEffectsVolume / 200;
      soundElement.volume = normalizedVolume;
    }
  };

  swing = (p: number) => {
    // Pure function, no state change, action wrapper not needed
    return 0.5 - Math.cos(p * Math.PI) / 2;
  };

  handleVolumeChange = (newVolume: number) => {
    this.setVolume(newVolume);

    if (this.audioRef) {
      const normalizedVolume = newVolume / 200;
      this.adjustVolume(this.audioRef, normalizedVolume);
    }
    this.isMusicChecked = newVolume > 0;
  };

  handleSoundEffectsVolumeChange = (newVolume: number) => {
    this.setSoundEffectsVolume(newVolume);
    this.isSoundEffectsChecked = newVolume > 0;
  };

  handleToggleMute = () => {
    // Toggle the master audio based on current state
    this.handleMasterAudioToggle(!this.isMasterAudioEnabled);
  };

  handleToggleSoundEffectsMute = () => {
    action(() => {
      if (this.soundEffectsVolume > 0) {
        this.updatePreviousSoundEffectsVolume();
        this.soundEffectsVolume = 0;
        this.isSoundEffectsChecked = false;
      } else {
        this.soundEffectsVolume =
          this.previousSoundEffectsVolume > 0
            ? this.previousSoundEffectsVolume
            : 100;
        this.isSoundEffectsChecked = true;
      }
    })();
  };

  playSoundEffect = (soundPath: string) => {
    // Primarily side effect (playing audio), action wrapper likely not needed
    if (!this.isSoundEffectsChecked) {
      return;
    }

    const normalizedVolume = this.soundEffectsVolume / 200;
    const soundEffect = new Audio(soundPath);
    soundEffect.volume = normalizedVolume;

    soundEffect.play().catch(() => {
      // Silently handle autoplay restrictions
      return;
    });
  };

  // Get sound effects icon name based on current state
  getSoundEffectsIconName = () => {
    return this.isSoundEffectsChecked
      ? 'NotificationsActive'
      : 'NotificationsOff';
  };

  // Get volume icon name based on current state
  getVolumeIconName = () => {
    if (this.volume === 0) return 'VolumeOff';
    if (this.volume < 50) return 'VolumeDown';
    return 'VolumeUp';
  };

  // --- Profile Image Actions ---
  setCurrentUserProfileImgId = (imgId: string | null) => {
    action(() => {
      this.currentUserProfileImgId = imgId;
    })();
  };

  handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    action(() => {
      this.imageUpdateError = null;
      this.imageUpdateSuccess = null;
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        // Basic validation (e.g., file type, size)
        if (!file.type.startsWith('image/')) {
          this.imageUpdateError = 'Please select an image file.';
          this.selectedFile = null;
          this.imagePreviewUrl = null;
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          // Example: 5MB limit
          this.imageUpdateError = 'Image size should not exceed 5MB.';
          this.selectedFile = null;
          this.imagePreviewUrl = null;
          return;
        }

        this.selectedFile = file;
        // Create a preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imagePreviewUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.selectedFile = null;
        this.imagePreviewUrl = null;
      }
    })();
  };

  clearImageSelection = () => {
    action(() => {
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      this.imageUpdateError = null;
      this.imageUpdateSuccess = null;
    })();
  };

  // Placeholder - Replace with actual upload logic (e.g., Realm Function call)
  uploadProfileImageAction = action(async () => {
    if (!this.selectedFile) {
      this.imageUpdateError = 'No image selected to upload.';
      return;
    }

    this.isUploadingImage = true;
    this.imageUpdateError = null;
    this.imageUpdateSuccess = null;

    try {
      console.log(`Simulating upload for: ${this.selectedFile.name}`);
      // *** Replace with actual backend call ***
      // const formData = new FormData();
      // formData.append('profileImage', this.selectedFile);
      // const result = await this.root.realmStore.callFunction('uploadUserProfileImage', formData); // Example
      // const newImageId = result.imageId;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
      const newImageId = `simulated-${Date.now()}`; // Simulate getting a new ID
      // *** End Replace ***

      // If successful:
      this.currentUserProfileImgId = newImageId; // Update current ID
      this.selectedFile = null; // Clear selection
      this.imagePreviewUrl = null;
      this.imageUpdateSuccess = 'Profile image updated!';
    } catch (err: any) {
      console.error('Error uploading profile image:', err);
      this.imageUpdateError = err.message || 'Failed to upload image.';
    } finally {
      this.isUploadingImage = false;
    }
  });

  // Placeholder - Replace with actual remove logic (e.g., Realm Function call)
  removeProfileImageAction = action(async () => {
    if (!this.currentUserProfileImgId) {
      this.imageUpdateError = 'No profile image to remove.';
      return;
    }
    this.isUploadingImage = true; // Use same loading state for simplicity
    this.imageUpdateError = null;
    this.imageUpdateSuccess = null;

    try {
      console.log(
        `Simulating removal of image ID: ${this.currentUserProfileImgId}`
      );
      // *** Replace with actual backend call ***
      // await this.root.realmStore.callFunction('removeUserProfileImage'); // Example
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      // *** End Replace ***

      // If successful:
      this.currentUserProfileImgId = null; // Clear current ID
      this.imageUpdateSuccess = 'Profile image removed.';
    } catch (err: any) {
      console.error('Error removing profile image:', err);
      this.imageUpdateError = err.message || 'Failed to remove image.';
    } finally {
      this.isUploadingImage = false;
    }
  });

  clearImageStatus = () => {
    action(() => {
      this.isUploadingImage = false;
      this.imageUpdateError = null;
      this.imageUpdateSuccess = null;
    })();
  };
  // --- End Profile Image Actions ---
}
