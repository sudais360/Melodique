import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

const MainPage = ({ navigation }) => {
  const [hotHits, setHotHits] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    fetchHotHits();
    fetchTopAlbums();
    fetchTopArtists();
    fetchPodcasts();
  }, []);

  const fetchHotHits = async () => {
    try {
      const response = await axios.get('https://api.jamendo.com/v3.0/tracks?client_id=c36a1722&format=json&limit=5&order=popularity_total');
      const tracks = response.data.results.map(track => ({
        id: track.id,
        name: track.name,
        audio: track.audio, // Ensure this field is available
        image: track.album_image,
        artist_name: track.artist_name,
        album_name: track.album_name
      }));
      setHotHits(tracks);
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const fetchTopAlbums = async () => {
    try {
      const response = await axios.get('https://api.jamendo.com/v3.0/albums?client_id=c36a1722&format=json&limit=5&order=popularity_total');
      setTopAlbums(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopArtists = async () => {
    try {
      const response = await axios.get('https://api.jamendo.com/v3.0/artists?client_id=c36a1722&format=json&limit=5&order=popularity_total');
      setTopArtists(response.data.results.filter(artist => artist.image));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPodcasts = async () => {
    try {
      const response = await axios.get('https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=68', {
        headers: {
          'X-ListenAPI-Key': '8dbfc02302db418ba98a4bc6f8cfd6ae'
        }
      });
      setPodcasts(response.data.podcasts);
    } catch (error) {
      console.error(error);
    }
  };

  const renderHotHitsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate('SongPlayingPage', { 
        track: {
          name: item.name || 'Unknown Name',
          artist_name: item.artist_name || 'Unknown Artist',
          album_name: item.album_name || 'Unknown Album',
          image: item.image || 'default_image_url',
          audio: item.audio // Ensure the audio URL is passed
        } 
      })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );
  

  const renderTopAlbumsItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('AlbumPage', { album: item })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTopArtistsItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('ArtistPage', { artist: item })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPodcastItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('PodcastPage', { podcast: item })}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Melodique</Text>
      <Text style={styles.subtitle}>Hot Hits</Text>
      <FlatList
        horizontal
        data={hotHits}
        renderItem={renderHotHitsItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.subtitle}>Top Albums</Text>
      <FlatList
        horizontal
        data={topAlbums}
        renderItem={renderTopAlbumsItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.subtitle}>Top Artists</Text>
      <FlatList
        horizontal
        data={topArtists}
        renderItem={renderTopArtistsItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.subtitle}>Podcasts</Text>
      <FlatList
        horizontal
        data={podcasts}
        renderItem={renderPodcastItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 16,
  },
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MainPage;
