import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import MiniPlayer from '../components/MiniPlayer';
import { AudioContext } from '../context/AudioContext';

const MainPage = ({ navigation }) => {
  const [hotHits, setHotHits] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [radioStations, setRadioStations] = useState([]);
  const { currentTrack } = useContext(AudioContext);

  const podcastGenres = [
    'Technology', 'Business', 'Comedy', 'Education', 'Health', 'News', 'Science', 'Sports', 'History', 'Music'
  ];

  const genreImages = {
    Technology: require('../assets/Images/podcastgenre/Technology.png'),  
    Business: require('../assets/Images/podcastgenre/Business.png'),
    Comedy: require('../assets/Images/podcastgenre/Comedy.png'),
    Education: require('../assets/Images/podcastgenre/Education.png'),
    Health: require('../assets/Images/podcastgenre/Health.png'),
    News: require('../assets/Images/podcastgenre/News.png'),
    Science: require('../assets/Images/podcastgenre/Science.png'),
    Sports: require('../assets/Images/podcastgenre/Sports.png'),
    History: require('../assets/Images/podcastgenre/History.png'),
    Music: require('../assets/Images/podcastgenre/Music.png')
  };

  useEffect(() => {
    fetchHotHits();
    fetchTopArtists();
    fetchPodcasts();
    fetchRadioStations();
  }, []);

  const fetchHotHits = async () => {
    try {
      const response = await axios.get('https://api.jamendo.com/v3.0/tracks?client_id=c36a1722&format=json&limit=10&order=popularity_total');
      const tracks = response.data.results.map(track => ({
        id: track.id,
        name: track.name,
        audio: track.audio,
        image: track.album_image,
        artist_name: track.artist_name,
        album_name: track.album_name,
        album_id: track.album_id,
      }));
      setHotHits(tracks);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopArtists = async () => {
    try {
      const response = await axios.get('https://api.jamendo.com/v3.0/artists?client_id=c36a1722&format=json&limit=10&order=popularity_total');
      setTopArtists(response.data.results.filter(artist => artist.image));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPodcasts = async () => {
    try {
      const response = await axios.get('https://listen-api.listennotes.com/api/v2/search', {
        headers: {
          'X-ListenAPI-Key': '8dbfc02302db418ba98a4bc6f8cfd6ae'
        },
        params: {
          q: 'movie',
          audio: true,
          type: 'episode',
        }
      });
      setPodcasts(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRadioStations = async () => {
    try {
      const response = await axios.get('https://de1.api.radio-browser.info/json/stations/search?limit=10&country=Singapore');
      setRadioStations(response.data);
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
          audio: item.audio,
        } 
      })}
    >
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
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate('SongPlayingPage', { 
        track: {
          name: item.title_original || 'Unknown Title',
          artist_name: item.publisher_original || 'Unknown Publisher',
          image: item.thumbnail || 'default_image_url',
          audio: item.audio || 'audio_url_placeholder',
        } 
      })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <Text style={styles.itemText}>{item.title_original}</Text>
    </TouchableOpacity>
  );

  const renderGenreItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.genreItemContainer} 
      onPress={() => navigation.navigate('PodcastPage', { genre: item })}
    >
      <Image source={genreImages[item]} style={styles.image} />
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderRadioStationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate('SongPlayingPage', { 
        track: {
          name: item.name || 'Unknown Name',
          image: item.favicon || 'default_image_url',
          audio: item.url,
        } 
      })}
    >
      <Image source={{ uri: item.favicon || 'default_image_url' }} style={styles.image} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Melodique</Text>

        <Text style={styles.subtitle}>Hot Hits</Text>
        <FlatList
          horizontal
          data={hotHits}
          renderItem={renderHotHitsItem}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        <Text style={styles.subtitle}>Top Artists</Text>
        <FlatList
          horizontal
          data={topArtists}
          renderItem={renderTopArtistsItem}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        <Text style={styles.subtitle}>Podcast Genres</Text>
        <FlatList
          horizontal
          data={podcastGenres}
          renderItem={renderGenreItem}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        <Text style={styles.subtitle}>Radio Stations</Text>
        <FlatList
          horizontal
          data={radioStations}
          renderItem={renderRadioStationItem}
          keyExtractor={item => item.stationuuid}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </ScrollView>
      {currentTrack && <MiniPlayer navigation={navigation} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 16,
    color: '#333',
  },
  horizontalList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowColor: '#000',
    elevation: 5,
    padding: 16,
  },
  genreItemContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowColor: '#000',
    elevation: 5,
    padding: 10,
    width: 140,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  itemText: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
});

export default MainPage;
