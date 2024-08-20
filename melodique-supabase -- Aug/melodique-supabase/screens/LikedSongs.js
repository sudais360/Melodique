import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { fetchLikedSongs, dislikeSong } from '../context/api';
import { UserContext } from '../context/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const LikedSongs = ({ navigation }) => {
  const { userId } = useContext(UserContext);
  const [likedSongs, setLikedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userId) {
      loadLikedSongs();
    }
  }, [userId]);

  const loadLikedSongs = async () => {
    try {
      const songs = await fetchLikedSongs(userId);
      setLikedSongs(songs);
    } catch (error) {
      console.error('Error loading liked songs:', error);
    }
  };

  const handleDislike = async (songId) => {
    try {
      await dislikeSong(userId, songId);
      setLikedSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
    } catch (error) {
      console.error('Error disliking song:', error);
    }
  };

  const handleSongPress = (track, tracks, index) => {
    navigation.navigate('SongPlayingPage', {
      track: {
        name: track.name,
        artist_name: track.artist_name,
        album_name: track.album_name,
        image: track.album_image,
        audio: track.audio,
      },
      tracks: tracks,
      currentIndex: index,
      userId: userId
    });
  };

  const handleDownloadSong = async (track) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access storage was denied.');
      return;
    }

    setIsLoading(true);
    const fileUri = FileSystem.documentDirectory + track.name + '.mp3';
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        track.audio,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
          console.log(`Downloading: ${progress * 100}%`);
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      console.log('Finished downloading to ', uri);

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert('Success', 'Song downloaded and saved to your Downloads folder!');
    } catch (error) {
      console.error('Error downloading song:', error);
      Alert.alert('Error', 'Failed to download the song.');
    } finally {
      setIsLoading(false);
      setDownloadProgress(0);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLikedSongs();
    setRefreshing(false);
  };

  const renderSongItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.songInfo}
        onPress={() => handleSongPress(item, likedSongs, index)}
      >
        <Image source={{ uri: item.album_image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemSubText}>{item.artist_name}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.dislikeButton}
        onPress={() => {
          Alert.alert(
            'Dislike Song',
            'Are you sure you want to remove this song from your liked songs?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'OK', onPress: () => handleDislike(item.id) }
            ],
            { cancelable: true }
          );
        }}
      >
        <MaterialIcons name="thumb-down" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => handleDownloadSong(item)}
      >
        <MaterialIcons name="file-download" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liked Songs</Text>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Downloading: {Math.round(downloadProgress * 100)}%</Text>
        </View>
      )}
      <FlatList
        data={likedSongs}
        renderItem={renderSongItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemSubText: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  dislikeButton: {
    backgroundColor: '#ff0000',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  downloadButton: {
    backgroundColor: '#0000ff',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default LikedSongs;
