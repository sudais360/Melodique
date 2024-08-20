import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { AudioContext } from '../context/AudioContext';
import NeomorphicControlButton from './NeomorphicControlButton';
import supabase from '../supabaseClient';

const { height } = Dimensions.get('window');

const MiniPlayer = ({ navigation }) => {
  const {
    isPlaying,
    playPauseAudio,
    handleNext,
    handlePrevious,
    stopAudio,
    currentTrack,
    setCurrentTrack,
    loadAudio,
    tracks,
    setTracks
  } = useContext(AudioContext);

  const [source, setSource] = useState('database');
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");

      if (source === 'database') {
        const { data, error } = await supabase
          .from('Songs')
          .select('*')
          .order('order', { ascending: true });

        if (error) {
          console.error('Error fetching from Supabase:', error);
        } else if (data && data.length > 0) {
          setTracks(data);
          setCurrentTrack(data[0]);  // Set the first track as the current track
        }
      } else if (source === 'api') {
        try {
          const response = await fetch('https://your-api-endpoint.com/songs');
          const data = await response.json();
          if (data && data.length > 0) {
            setTracks(data);
            setCurrentTrack(data[0]);  // Set the first track as the current track
          }
        } catch (error) {
          console.error('Error fetching from API:', error);
        }
      }
    };

    fetchData();
  }, [source]);

  useEffect(() => {
    if (currentTrack) {
      loadAudio(currentTrack);
    }
  }, [currentTrack]);

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
          Animated.timing(translateY, {
            toValue: height,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            stopAudio();
            translateY.setValue(0);
          });
        } else {
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
    return <View><Text>Loading...</Text></View>;  // Add a temporary loading text
  }

  const imageUrl = currentTrack.image || 'https://your-fallback-image-url.com/fallback.png';

  return (
    <Animated.View
      style={[
        styles.miniPlayerContainer,
        { transform: [{ translateY }] },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.miniPlayerContent} onPress={handlePress}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{currentTrack.title || 'Unknown Title'}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist || 'Unknown Artist'}</Text>
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
    marginBottom: 0,
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
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  trackArtist: {
    fontSize: 10,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MiniPlayer;
