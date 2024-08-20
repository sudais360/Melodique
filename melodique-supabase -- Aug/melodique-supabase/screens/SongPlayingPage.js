import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { AudioContext } from '../context/AudioContext';
import NeomorphicControlButton from '../components/NeomorphicControlButton';
import NeomorphicSlider from '../components/NeomorphicSlider';
import { UserContext } from '../context/UserContext';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import supabase from '../supabaseClient'; // Import Supabase client
import CustomLoadingAnimation from '../components/CustomLoadingAnimation';

const SongPlayingPage = ({ route, navigation }) => {
  const { track, tracks, currentIndex } = route.params;
  const { userId } = useContext(UserContext);
  const {
    currentTrack,
    setCurrentTrack,
    setTracks,
    playPauseAudio,
    isPlaying,
    duration,
    position,
    handleNext,
    handlePrevious,
    seekAudio,
  } = useContext(AudioContext);

  const [sliderPosition, setSliderPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (track) {
      setCurrentTrack(track);
      setTracks(tracks);
    }
  }, [track, tracks]);

  useEffect(() => {
    if (!isSeeking && duration > 0) {
      setSliderPosition(position / duration);
    }
  }, [position, duration, isSeeking]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSeeking && duration > 0) {
        setSliderPosition(position / duration);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [position, duration, isSeeking]);

  const handleSliderChange = async (value) => {
    const newPosition = value * duration;
    setIsSeeking(true);
    setSliderPosition(value);
    await seekAudio(newPosition);
    setIsSeeking(false);
  };

  const handleLikeSong = async () => {
    try {
      const { data, error } = await supabase
        .from('liked_songs')
        .insert([
          {
            user_id: userId,
            song_id: currentTrack.songs_id,
            liked_at: new Date(),
          },
        ]);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Song liked!');
      navigation.navigate('LikedSongs');
    } catch (error) {
      console.error('Error liking song:', error);
      Alert.alert('Error', 'Failed to like the song.');
    }
  };

  const handleSaveToBackup = async () => {
    try {
      const { data: userSongs, error: fetchError } = await supabase
        .from('backup_songs')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) {
        throw fetchError;
      }

      if (userSongs.length >= 10) {
        Alert.alert('Limit Reached', 'You can only add up to 10 backup songs.');
        return;
      }

      const { data, error } = await supabase.from('backup_songs').insert([
        {
          user_id: userId,
          title: currentTrack.name || currentTrack.title,
          artist: currentTrack.artist_name || currentTrack.artist,
          album_name: currentTrack.album_name,
          image: currentTrack.image,
          audio: currentTrack.audio,
          saved_at: new Date(),
        },
      ]);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Song saved to backup!');
    } catch (error) {
      console.error('Error saving song to backup:', error);
      Alert.alert('Error', 'Failed to save the song to backup.');
    }
  };

  const handleDownloadSong = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Permission to access storage was denied.'
      );
      return;
    }

    setIsLoading(true);
    const fileUri = FileSystem.documentDirectory + currentTrack.name + '.mp3';
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        currentTrack.audio,
        fileUri,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      const { uri } = await downloadResumable.downloadAsync();

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert(
        'Success',
        'Song downloaded and saved to your Downloads folder!'
      );
    } catch (error) {
      console.error('Error downloading song:', error);
      Alert.alert('Error', 'Failed to download the song.');
    } finally {
      setIsLoading(false);
      setDownloadProgress(0);
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      {isLoading && <CustomLoadingAnimation />}
      <View style={styles.content}>
        {currentTrack?.image && (
          <Image source={{ uri: currentTrack.image }} style={styles.image} />
        )}
        <Text style={styles.trackText}>
          Now Playing: {currentTrack?.name || currentTrack?.title}
        </Text>
        <Text style={styles.trackText}>
          Artist: {currentTrack?.artist_name || currentTrack?.artist}
        </Text>
        <Text style={styles.trackText}>Album: {currentTrack?.album_name}</Text>

        <NeomorphicSlider
          value={sliderPosition}
          onValueChange={handleSliderChange}
          onSlidingComplete={handleSliderChange}
          style={styles.slider}
        />

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <NeomorphicControlButton
            imageSource={require('../assets/Images/songplayingpage/previous.png')}
            onPress={handlePrevious}
          />
          <NeomorphicControlButton
            imageSource={
              isPlaying
                ? require('../assets/Images/songplayingpage/pause.png')
                : require('../assets/Images/songplayingpage/play.png')
            }
            onPress={playPauseAudio}
          />
          <NeomorphicControlButton
            imageSource={require('../assets/Images/songplayingpage/next.png')}
            onPress={handleNext}
          />
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Downloading: {Math.round(downloadProgress * 100)}%</Text>
          </View>
        )}

        <View style={styles.extraControlsContainer}>
          <TouchableOpacity onPress={handleLikeSong} style={styles.iconButton}>
            <Image
              source={require('../assets/Images/songplayingpage/like.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSaveToBackup}
            style={styles.iconButton}>
            <Image
              source={require('../assets/Images/songplayingpage/cloud.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDownloadSong}
            style={styles.iconButton}>
            <Image
              source={require('../assets/Images/songplayingpage/download.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
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
    alignItems: 'flex-start', // Align content to the left
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
    alignSelf: 'center', // Keep image centered
  },
  trackText: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'InriaSerif-Regular',
    textAlign: 'left', // Align text to the left
    width: '100%', // Ensure text takes full width
  },
  slider: {
    width: '100%',
    marginBottom: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  extraControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
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
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default SongPlayingPage;
