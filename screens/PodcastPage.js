import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

const PodcastPage = ({ route, navigation }) => {
  const { genre } = route.params;
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    fetchPodcastsByGenre();
  }, [genre]);

  const fetchPodcastsByGenre = async () => {
    try {
      const response = await axios.get('https://listen-api.listennotes.com/api/v2/search', {
        headers: {
          'X-ListenAPI-Key': '8dbfc02302db418ba98a4bc6f8cfd6ae'
        },
        params: {
          q: genre,
          audio: true,
          type: 'episode',
          limit: 10
        }
      });
      setPodcasts(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const renderPodcastItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate('SongPlayingPage', { 
        track: {
          name: item.title_original || 'Unknown Title',
          artist_name: item.publisher_original || 'Unknown Publisher',
          album_name: item.publisher_original || 'Unknown Album',
          image: item.thumbnail || 'default_image_url',
          audio: item.audio || 'audio_url_placeholder',
        } 
      })}
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
      <FlatList
        data={podcasts}
        renderItem={renderPodcastItem}
        keyExtractor={item => item.id}
      />
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
    flexDirection: 'row', // Add this to arrange items horizontally
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 12, // Add some vertical margin for better spacing
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
    marginLeft: 16, // Add some spacing between the image and the text
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
