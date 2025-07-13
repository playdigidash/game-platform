import { observer } from 'mobx-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../RootStore/RootStoreProvider';

// List of available music tracks
const musicTracks = [
  'assets/audio/backgroundmusic/sunnyhiphop.mp3',
  'assets/audio/backgroundmusic/upbeat2.mp3',
  'assets/audio/backgroundmusic/rock.mp3',
  'assets/audio/backgroundmusic/HipHop2.mp3',
  'assets/audio/backgroundmusic/Funk.mp3',
  'assets/audio/backgroundmusic/Upbeat.mp3'
];

export const AudioPlayer: React.FC = observer(() => {
  const settingsStore = useGameStore().settingsViewStore;
  const { audioRef, setAudioRef, volume, isMusicChecked } = settingsStore;
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => 
    Math.floor(Math.random() * musicTracks.length)
  );

  // Function to get a random track index different from the current one
  const getNextRandomTrack = useCallback(() => {
    if (musicTracks.length === 1) return 0;
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * musicTracks.length);
    } while (nextIndex === currentTrackIndex);
    return nextIndex;
  }, [currentTrackIndex]);

  // Handle track ended event
  const handleTrackEnded = useCallback(() => {
    const nextIndex = getNextRandomTrack();
    setCurrentTrackIndex(nextIndex);
    if (audioRef) {
      audioRef.src = musicTracks[nextIndex];
      audioRef.play().catch(() => {
        // Silently handle autoplay restrictions
        return;
      });
    }
  }, [audioRef, getNextRandomTrack]);

  // Set up audio event listeners
  useEffect(() => {
    const cleanup = () => {
      if (audioRef) {
        audioRef.removeEventListener('ended', handleTrackEnded);
      }
    };

    if (audioRef) {
      audioRef.addEventListener('ended', handleTrackEnded);
      
      // Volume change handler
      const volumeChangeHandler = () => {
        // Volume change is handled by the settings store
        return;
      };
      audioRef.addEventListener('volumechange', volumeChangeHandler);
      
      return () => {
        cleanup();
        audioRef.removeEventListener('volumechange', volumeChangeHandler);
      };
    }

    return cleanup;
  }, [audioRef, handleTrackEnded, isMusicChecked, volume]);

  return (
    <audio
      ref={(r) => {
        if (r && !audioRef) {
          setAudioRef(r);
        }
      }}
      src={musicTracks[currentTrackIndex]}
    >
      Your browser does not support the audio element.
    </audio>
  );
});
