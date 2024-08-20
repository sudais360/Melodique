import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const ArtistPage = ({ route, navigation }) => {
  const { artist } = route.params;
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetchArtistTracks();
  }, []);

  const fetchArtistTracks = async () => {
    try {
      const response = await fetch(`https://api.jamendo.com/v3.0/artists/tracks?client_id=c36a1722&format=json&id=${artist.id}`);
      const data = await response.json();
      setTracks(data.results[0].tracks);
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
          image: item.album_image || 'default_image_url',  // Use track's album image
          audio: item.audio,
        },
        tracks: tracks,
        currentIndex: index,
      })}
    >
      <Image source={{ uri: item.album_image || 'default_image_url' }} style={styles.trackImage} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      ListHeaderComponent={() => (
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{artist.name}</Text>
        </View>
      )}
      data={tracks}
      renderItem={renderTrackItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0E5EC',
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ArtistPage;
