import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AudioContext } from '../context/AudioContext';
import NeomorphicControlButton from '../components/NeomorphicControlButton';
import NeomorphicSlider from '../components/NeomorphicSlider';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const SongPlayingPage = ({ route, navigation }) => {
  const { track, tracks, currentIndex, userId } = route.params;

  // Debugging logs
  console.log('Received track:', track);
  console.log('Received tracks:', tracks);
  console.log('Received currentIndex:', currentIndex);
  console.log('Received userId:', userId);

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

  const likeSong = async () => {
    const apiUrl = `${API_BASE_URL}/like-song` ;
    console.log('Liking song at:', apiUrl);

    try {
      const response = await axios.post(apiUrl, {
        userId: userId,
        trackId: currentTrack.id,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);
      alert('Song liked!');

      // Navigate back to update the liked songs list
      navigation.navigate('LikedSongs', { userId: userId });
    } catch (error) {
      console.error('Error liking song:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      alert('Error liking song.');
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {currentTrack?.image && <Image source={{ uri: currentTrack.image }} style={styles.image} />}
        <Text style={styles.trackText}>Now Playing: {currentTrack?.name}</Text>
        <Text style={styles.trackText}>Artist: {currentTrack?.artist_name}</Text>
        <Text style={styles.trackText}>Album: {currentTrack?.album_name}</Text>

        <NeomorphicSlider
          value={duration ? localPosition / duration : 0}
          onValueChange={handleSliderChange}
          style={styles.slider}
        />
        
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(localPosition)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

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
          <NeomorphicControlButton
            imageSource={require('../assets/Images/songplayingpage/like.png')}
            onPress={likeSong}
            style={styles.likeButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
    textAlign: 'center',
  },
  likeButton: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    marginBottom: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '110%',
    marginVertical: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'InriaSerif-Regular',
  },
});

export default SongPlayingPage;
