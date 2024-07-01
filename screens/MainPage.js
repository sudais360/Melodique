import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import MiniPlayer from '../components/MiniPlayer';
import { AudioContext } from '../context/AudioContext';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import Header from '../components/Header'; // Import the Header component
import { fetchHotHits, fetchTrackDetails } from '../context/api'; // Import the updated function

const MainPage = ({route,navigation }) => {
  const [hotHits, setHotHits] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [radioStations, setRadioStations] = useState([]);
  const [results, setResults] = useState([]);
  const { currentTrack, setTracks, setCurrentTrack } = useContext(AudioContext);
  const { userId } = route.params;

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
    fetchHotHitsList();
    fetchTopArtists();
    fetchPodcasts();
    fetchRadioStations();
  }, []);

  const fetchHotHitsList = async () => {
    try {
      const tracks = await fetchHotHits();
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
           'X-ListenAPI-Key': '6ef7b9fac096471fb0e0d51d78c3ca84'
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

  const handleSearch = async (query) => {
    const searchResults = await fetchTrackDetails(query);
    setResults(searchResults || []);
  };

  const handleClearSearch = () => {
    setResults([]); // Clear search results
  };

  const navigateToDetailPage = (track) => {
    setTracks([track]);
    setCurrentTrack(track);
    setResults([]); // Clear search results on selection
    navigation.navigate('SongPlayingPage', {
      track,
      tracks: [track],
      currentIndex: 0,
      userId: userId,
    });
  };

  const handleMenuPress = () => {
    navigation.openDrawer(); // Open the drawer
  };

  const handleSettingsPress = () => {
    navigation.navigate('SettingsPage'); // Ensure you have a SettingsPage component
  };

  const renderHotHitsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigateToDetailPage(item)}
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
      onPress={() => navigateToDetailPage(item)}
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
      onPress={() => navigateToDetailPage(item)}
    >
      <Image source={{ uri: item.favicon || 'default_image_url' }} style={styles.image} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Header onMenuPress={handleMenuPress} onSettingsPress={handleSettingsPress} />
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <SearchResults
              results={results}
              onSelect={navigateToDetailPage}
            />
          </View>
        )}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.listSection}>
            <Text style={styles.subtitle}>Hot Hits</Text>
            <FlatList
              horizontal
              data={hotHits}
              renderItem={renderHotHitsItem}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          <View style={styles.listSection}>
            <Text style={styles.subtitle}>Top Artists</Text>
            <FlatList
              horizontal
              data={topArtists}
              renderItem={renderTopArtistsItem}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          <View style={styles.listSection}>
            <Text style={styles.subtitle}>Podcast Genres</Text>
            <FlatList
              horizontal
              data={podcastGenres}
              renderItem={({ item }) => renderGenreItem({ item })}
              keyExtractor={item => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          <View style={styles.listSection}>
            <Text style={styles.subtitle}>Radio Stations</Text>
            <FlatList
              horizontal
              data={radioStations}
              renderItem={renderRadioStationItem}
              keyExtractor={item => item.stationuuid}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        </ScrollView>
        
        {currentTrack && <MiniPlayer navigation={navigation} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop:60,
    marginBottom:20,

  },
  innerContainer: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    marginTop:40,
    marginBottom:50,
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
  scrollViewContent: {
    paddingBottom: 20,
  },
  listSection: {
    marginBottom: 20,
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
  resultsContainer: {
    marginTop: 20,
    width: '100%',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  resultText: {
    fontSize: 16,
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
});

export default MainPage;
