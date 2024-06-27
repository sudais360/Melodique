import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import NeomorphicControlButton from '../components/NeomorphicControlButton';

const SongPlayingPage = ({ route }) => {
  const { track } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (track && track.audio) {
      console.log(track);
      loadAudio();
    } else {
      console.error('Invalid audio URL');
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [track]);

  const loadAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audio },
        { shouldPlay: false }
      );
      setSound(sound);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const playPauseAudio = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SongPlayingPage</Text>
      {track.image && <Image source={{ uri: track.image }} style={styles.image} />}
      <Text style={styles.trackText}>Now Playing: {track.name}</Text>
      <Text style={styles.trackText}>Artist: {track.artist_name}</Text>
      <Text style={styles.trackText}>Album: {track.album_name}</Text>

      <View style={styles.controlsContainer}>
        <NeomorphicControlButton title="Prev" onPress={() => {}} />
        <NeomorphicControlButton title={isPlaying ? 'Pause' : 'Play'} onPress={playPauseAudio} />
        <NeomorphicControlButton title="Next" onPress={() => {}} />
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
    </View>
  );
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
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 20,
  },
  slider: {
    width: 300,
    height: 40,
  },
});

export default SongPlayingPage;
