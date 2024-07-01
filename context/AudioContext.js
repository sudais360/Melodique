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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const soundRef = useRef(null);

  useEffect(() => {
    if (currentTrack) {
      loadAudio(currentTrack);
    }
  }, [currentTrack]);

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
        { shouldPlay: false }
      );

      soundRef.current = sound;
      setSound(sound);

      sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);

      if (isPlaying) {
        await sound.playAsync();
      }
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

      if (status.didJustFinish) {
        handleNext();
      }
    } else if (status.error) {
      console.error(`Playback error: ${status.error}`);
    }
  };

  const playPauseAudio = async () => {
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = async () => {
    if (tracks.length > 0) {
      const nextIndex = (currentIndex + 1) % tracks.length;
      setCurrentIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);
      setPosition(0);
      setIsPlaying(true);
    }
  };

  const handlePrevious = async () => {
    if (tracks.length > 0) {
      const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      setCurrentIndex(prevIndex);
      setCurrentTrack(tracks[prevIndex]);
      setPosition(0);
      setIsPlaying(true);
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
    }
  };

  return (
    <AudioContext.Provider
      value={{
        sound,
        isPlaying,
        duration,
        position,
        currentTrack,
        setTracks,
        currentIndex,
        setCurrentTrack,
        loadAudio,
        playPauseAudio,
        handleNext,
        handlePrevious,
        seekAudio,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export { AudioContext, AudioProvider };
