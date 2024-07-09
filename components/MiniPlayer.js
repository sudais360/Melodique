import React, { useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { AudioContext } from '../context/AudioContext';
import NeomorphicControlButton from './NeomorphicControlButton';

const { height, width  } = Dimensions.get('window');

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
        if (gestureState.dy > 50) {
          // User swiped down - stop audio and hide mini player
          Animated.timing(translateY, {
            toValue: height,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            stopAudio();
            translateY.setValue(0);
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
      translateY.setValue(0);
    });
  };

  if (!currentTrack) {
    return null;
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
    width: '113%' ,
    zIndex: 1,
    backgroundColor: '#E5E5E5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 0
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  trackArtist: {
    fontSize: 12,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: '#ddd',
  },
  progressBar: {
    height: 2,
    backgroundColor: '#1DB954',
  },
});

export default MiniPlayer;
