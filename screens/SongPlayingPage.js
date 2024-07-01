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
      setCurrentTrack(tracks[currentIndex]);
    }
  }, [track, tracks, currentIndex, setTracks, setCurrentTrack]);

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
      {currentTrack?.image && <Image source={{ uri: currentTrack.image }} style={styles.image} />}
      <Text style={styles.trackText}>Now Playing: {currentTrack?.name}</Text>
      <Text style={styles.trackText}>Artist: {currentTrack?.artist_name}</Text>
      <Text style={styles.trackText}>Album: {currentTrack?.album_name}</Text>

      <View style={styles.controlsContainer}>
        <NeomorphicControlButton
          imageSource={require('../assets/Images/songplayingpage/previous.png')}
          onPress={handlePrevious}
        />
        <NeomorphicControlButton
          imageSource={isPlaying ? require('../assets/Images/songplayingpage/pause.png') : require('../assets/Images/songplayingpage/play.png')}
          onPress={playPauseAudio}
        />
        <NeomorphicControlButton
          imageSource={require('../assets/Images/songplayingpage/next.png')}
          onPress={handleNext}
        />
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
    padding: 20,
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
