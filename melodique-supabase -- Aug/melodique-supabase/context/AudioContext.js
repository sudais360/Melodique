import React, { createContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext();

const AudioProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const soundRef = useRef(null);
  const positionUpdateInterval = useRef(null);

  useEffect(() => {
    if (currentTrack) {
      loadAudio(currentTrack);
    }
  }, [currentTrack]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      clearInterval(positionUpdateInterval.current);
    };
  }, []);

  const loadAudio = async (track) => {
    if (isLoading || !track || !track.audio) {
      console.error('Invalid track or audio source', track);
      return;
    }
    setIsLoading(true);

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current.setOnPlaybackStatusUpdate(null);
      soundRef.current = null;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audio },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setSound(sound);

      sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);

      console.log('Audio loaded successfully:', track.audio);
      await sound.playAsync();
      startPositionUpdateInterval();
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlaybackStatus = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        handleNext();
        clearInterval(positionUpdateInterval.current);
      }
    } else if (status.error) {
      console.error(`Playback error: ${status.error}`);
    }
  };

  const playPauseAudio = async () => {
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        clearInterval(positionUpdateInterval.current);
      } else {
        await soundRef.current.playAsync();
        startPositionUpdateInterval();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = async () => {
    const currentIndex = tracks.findIndex(track => track.songs_id === currentTrack.songs_id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < tracks.length) {
      setCurrentTrack(tracks[nextIndex]);
    } else {
      console.log('No next track found');
    }
  };

  const handlePrevious = async () => {
    const currentIndex = tracks.findIndex(track => track.songs_id === currentTrack.songs_id);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      setCurrentTrack(tracks[prevIndex]);
    } else {
      console.log('No previous track found');
    }
  };

  const seekAudio = async (newPosition) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
      setCurrentTrack(null);
      clearInterval(positionUpdateInterval.current);
    }
  };

  const startPositionUpdateInterval = () => {
    clearInterval(positionUpdateInterval.current);
    positionUpdateInterval.current = setInterval(async () => {
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis);
        }
      }
    }, 1000); // Update every 1 second
  };

  return (
    <AudioContext.Provider
      value={{
        sound,
        isPlaying,
        duration,
        position,
        currentTrack,
        tracks,
        setTracks,
        setCurrentTrack,
        loadAudio,
        playPauseAudio,
        handleNext,
        handlePrevious,
        seekAudio,
        stopAudio
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export { AudioContext, AudioProvider };
