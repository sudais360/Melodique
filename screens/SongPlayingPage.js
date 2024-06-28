import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AudioContext } from '../context/AudioContext';
import NeomorphicControlButton from '../components/NeomorphicControlButton';
import NeomorphicSlider from '../components/NeomorphicSlider';

const SongPlayingPage = ({ route }) => {
  const { track, tracks, currentIndex } = route.params;
  const {
    currentTrack,
    isPlaying,
    duration,
    position,
    playPauseAudio,
    handleNext,
    handlePrevious,
    seekAudio,
    setTracks,
    setCurrentTrack,
  } = useContext(AudioContext);

  const [localPosition, setLocalPosition] = useState(0);

  useEffect(() => {
    if (tracks && tracks.length > 0) {
      setTracks(tracks);
    }
    if (currentTrack?.audio !== track.audio) {
      setCurrentTrack(track);
    }
  }, [track]);

  useEffect(() => {
    setLocalPosition(position);
  }, [position]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setLocalPosition((prevPosition) => Math.min(prevPosition + 1000, duration));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handleSliderChange = async (value) => {
    const newPosition = value * duration;
    await seekAudio(newPosition);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SongPlayingPage</Text>
      {currentTrack?.image && <Image source={{ uri: currentTrack.image }} style={styles.image} />}
      <Text style={styles.trackText}>Now Playing: {currentTrack?.name}</Text>
      <Text style={styles.trackText}>Artist: {currentTrack?.artist_name}</Text>
      <Text style={styles.trackText}>Album: {currentTrack?.album_name}</Text>

      <View style={styles.controlsContainer}>
        <NeomorphicControlButton title="Prev" onPress={handlePrevious} />
        <NeomorphicControlButton title={isPlaying ? 'Pause' : 'Play'} onPress={playPauseAudio} />
        <NeomorphicControlButton title="Next" onPress={handleNext} />
      </View>

      <NeomorphicSlider
        value={duration ? localPosition / duration : 0}
        onValueChange={handleSliderChange}
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(localPosition)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

const formatTime = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'InriaSerif-Regular',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  trackText: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'InriaSerif-Regular',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'InriaSerif-Regular',
  },
});

export default SongPlayingPage;
