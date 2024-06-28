import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

const ArtistPage = ({ route, navigation }) => {
  const { artist } = route.params;
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetchArtistTracks();
  }, []);

  const fetchArtistTracks = async () => {
    try {
      const response = await axios.get(`https://api.jamendo.com/v3.0/artists/tracks?client_id=c36a1722&format=json&id=${artist.id}`);
      setTracks(response.data.results[0].tracks);
    } catch (error) {
      console.error(error);
    }
  };

  const renderTrackItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate('SongPlayingPage', { 
        track: {
          name: item.name || 'Unknown Name',
          artist_name: artist.name || 'Unknown Artist',
          album_name: item.album_name || 'Unknown Album',
          image: artist.image || 'default_image_url',
          audio: item.audio,
        },
        tracks: tracks,
        currentIndex: index,
      })}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{artist.name}</Text>
      <FlatList
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={item => item.id}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default ArtistPage;
