import React, { useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { AudioContext } from '../context/AudioContext';
import NeomorphicControlButton from './NeomorphicControlButton';

const { height } = Dimensions.get('window');

const MiniPlayer = ({ navigation }) => {
  const {
    currentTrack,
    isPlaying,
    playPauseAudio,
    handleNext,
    handlePrevious,
    stopAudio
  } = useContext(AudioContext);

  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: Animated.event(
        [null, { dy: translateY }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {  // Reduced threshold for easier swipe detection
          // User swiped down - stop audio and hide mini player
          Animated.timing(translateY, {
            toValue: height,
            duration: 200,  // Adjusted duration for a smoother animation
            useNativeDriver: true,
          }).start(() => {
            stopAudio();
            translateY.setValue(0); // Reset position for next appearance
          });
        } else {
          // User did not swipe down enough - reset position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handlePress = () => {
    Animated.timing(translateY, {
      toValue: -height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('SongPlayingPage', { track: currentTrack });
      translateY.setValue(0); // Reset the animation
    });
  };

  if (!currentTrack) {
    return null; // Don't show the mini player if no track is currently playing
  }

  return (
    <Animated.View
      style={[
        styles.miniPlayerContainer,
        { transform: [{ translateY }] },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.miniPlayerContent} onPress={handlePress}>
        <Image source={{ uri: currentTrack.image }} style={styles.image} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{currentTrack.name}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist_name}</Text>
        </View>
        <View style={styles.controls}>
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
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1,
    backgroundColor: '#f0f4f8',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 10,
  },
  trackName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MiniPlayer;
