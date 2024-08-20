import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';

const PRIMARY_API_KEY = '8dbfc02302db418ba98a4bc6f8cfd6ae';
const SECONDARY_API_KEY = '6ef7b9fac096471fb0e0d51d78c3ca84';
const API_URL = 'https://listen-api.listennotes.com/api/v2/search';

const fetchWithFallback = async (url, options) => {
  let response = await fetch(url, { ...options, headers: { 'X-ListenAPI-Key': PRIMARY_API_KEY, ...options.headers } });
  if (!response.ok) {
    console.warn('Primary API key failed, trying with secondary API key');
    response = await fetch(url, { ...options, headers: { 'X-ListenAPI-Key': SECONDARY_API_KEY, ...options.headers } });
  }

  if (!response.ok) {
    throw new Error('Network response was not ok with both API keys');
  }

  return response.json();
};

const PodcastPage = ({ route, navigation }) => {
  const { genre, userId } = route.params;  // Extract userId from route params
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPodcastsByGenre();
  }, [genre]);

  const fetchPodcastsByGenre = async () => {
    try {
      const data = await fetchWithFallback(`${API_URL}?q=${genre}&type=episode&audio=1&limit=10`, {
        method: 'GET'
      });
      setPodcasts(data.results);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load podcasts');
    } finally {
      setLoading(false);
    }
  };

  const renderPodcastItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => {
        console.log('Navigating to SongPlayingPage with track:', item); // Debug log
        navigation.navigate('SongPlayingPage', { 
          track: {
            name: item.title_original || 'Unknown Title',
            artist_name: item.publisher_original || 'Unknown Publisher',
            album_name: item.publisher_original || 'Unknown Album',
            image: item.thumbnail || 'default_image_url',
            audio: item.audio || 'audio_url_placeholder',
          },
          tracks: podcasts, // Pass the entire podcast list if needed
          currentIndex: podcasts.indexOf(item), // Find the index of the current item
          userId: userId  // Pass userId
        });
      }}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{item.title_original}</Text>
        <Text style={styles.publisherText}>{item.publisher_original}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{genre} Podcasts</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={podcasts}
          renderItem={renderPodcastItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text>No podcasts available</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E5EC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 12,
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
    padding: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  publisherText: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default PodcastPage;
