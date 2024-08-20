import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Button, Alert, TextInput, RefreshControl } from 'react-native';
import { fetchBackupSongs, removeBackupSong } from '../context/api';
import { UserContext } from '../context/UserContext';

const preloadedBackupSongs = [
  {
    backup_songs_id: 'pre1',
    title: "J'm'e FPM",
    artist: "TriFace",
    album_name: "Premiers Jets",
    image: "https://usercontent.jamendo.com?type=album&id=24&width=300&trackid=168",
    audio: "https://prod-1.storage.jamendo.com/?trackid=168&format=mp31&from=6F1T613Gp3G3c%2BjU%2FVq2UA%3D%3D%7C7Cg%2FjfarwHfx%2BGqNnMNCFA%3D%3D",
  },
  {
    backup_songs_id: 'pre2',
    title: "Preloaded Song 2",
    artist: "TriFace",
    album_name: "Premiers Jets",
    image: "https://usercontent.jamendo.com?type=album&id=24&width=300&trackid=169",
    audio: "https://prod-1.storage.jamendo.com/?trackid=169&format=mp31&from=C6usR1%2BVrBVln33ICIuG%2Bg%3D%3D%7CR8s6sSVAlse0sZp4Ctkv4w%3D%3D",
  },
  {
    backup_songs_id: 'pre3',
    title: "Preloaded Song 3",
    artist: "TriFace",
    album_name: "Premiers Jets",
    image: "https://usercontent.jamendo.com?type=album&id=24&width=300&trackid=170",
    audio: "https://prod-1.storage.jamendo.com/?trackid=170&format=mp31&from=5%2B5ZmMVK4%2F6%2Fwr6l2wWUIg%3D%3D%7C9M%2BxYEo3Nq%2BQCmFwtwf4dg%3D%3D",
  },
];

const BackupSongs = ({ navigation }) => {
  const { userId } = useContext(UserContext);
  const [userBackupSongs, setUserBackupSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBackupSongs();
  }, []);

  const loadBackupSongs = async () => {
    try {
      const userSongs = await fetchBackupSongs(userId);
      console.log("Fetched Backup Songs:", userSongs); // Debug log
      setUserBackupSongs(userSongs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading backup songs:', error);
      setLoading(false);
    }
  };

  const handleRemoveFromBackup = async (backup_songs_id) => {
    try {
      await removeBackupSong(userId, backup_songs_id);
      loadBackupSongs(); // Refresh the list
      Alert.alert('Success', 'The song has been removed from your backup.');
    } catch (error) {
      console.error('Error removing song from backup:', error);
      Alert.alert('Error', 'Failed to remove the song from backup.');
    }
  };

  const handleSongPress = (track, tracks, index) => {
    navigation.navigate('SongPlayingPage', { 
      track: {
        name: track.title,
        artist_name: track.artist,
        album_name: track.album_name,
        image: track.image,
        audio: track.audio || track.url,
      },
      tracks: tracks,
      currentIndex: index,
      userId: userId  // Pass userId here
    });
  };

  const renderPreloadedSongItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.songInfo}
        onPress={() => handleSongPress(item, preloadedBackupSongs, index)}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>{item.title}</Text>
          <Text style={styles.itemSubText}>{item.artist}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderUserSongItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.songInfo}
        onPress={() => handleSongPress(item, userBackupSongs, index)}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>{item.title}</Text>
          <Text style={styles.itemSubText}>{item.artist}</Text>
        </View>
      </TouchableOpacity>
      <Button 
        title="Remove" 
        onPress={() => handleRemoveFromBackup(item.backup_songs_id)} 
        color="#FF0000"
      />
    </View>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBackupSongs();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Backup Songs"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.sectionTitle}>Preloaded Backup Songs</Text>
      <FlatList
        data={preloadedBackupSongs.filter(song => song.title.toLowerCase().includes(searchQuery.toLowerCase()))}
        renderItem={renderPreloadedSongItem}
        keyExtractor={item => item.backup_songs_id.toString()}
        ListEmptyComponent={<Text>No Preloaded Backup Songs Available</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Text style={styles.sectionTitle}>User Backup Songs</Text>
      <FlatList
        data={userBackupSongs.filter(song => song.title.toLowerCase().includes(searchQuery.toLowerCase()))}
        renderItem={renderUserSongItem}
        keyExtractor={item => item.backup_songs_id.toString()}
        ListEmptyComponent={<Text>No User Backup Songs Available</Text>}
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
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 10,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default BackupSongs;
