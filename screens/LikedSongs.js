import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const LikedSongs = ({ route, navigation }) => {
  const { userId } = route.params;
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchLikedSongs();
    }
  }, [userId]);

  const fetchLikedSongs = async () => {
    try {
      // Fetch liked song IDs from the backend
      const response = await axios.get(`http://192.168.1.17:5000/liked-songs/${userId}`);
      const likedSongIds = response.data;

      // Fetch detailed information for each liked song from Jamendo API
      const songDetailsPromises = likedSongIds.map(songId =>
        axios.get(`https://api.jamendo.com/v3.0/tracks?client_id=c36a1722&format=json&id=${songId}`)
      );

      const songDetailsResponses = await Promise.all(songDetailsPromises);
      const detailedSongs = songDetailsResponses.map(res => res.data.results[0]);

      setLikedSongs(detailedSongs);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
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
      userId: userId  // Pass userId here
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={likedSongs}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.itemContainer} 
            onPress={() => handleSongPress(item, likedSongs, index)}
          >
            <Image source={{ uri: item.album_image }} style={styles.trackImage} />
            <View style={styles.trackDetails}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemText}>{item.artist_name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E5EC',
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#E0E5EC',
    borderRadius: 10,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowColor: '#ffffff',
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowColor: '#000000',
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  trackDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default LikedSongs;
