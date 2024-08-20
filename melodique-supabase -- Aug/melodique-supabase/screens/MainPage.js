import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import MiniPlayer from '../components/MiniPlayer';
import { AudioContext } from '../context/AudioContext';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import Header from '../components/Header';
import { fetchHotHitsSongs, fetchTopArtists, fetchTrackDetails } from '../context/api';
import RefreshableScrollView from '../components/RefreshableScrollView';
import CustomLoadingAnimation from '../components/CustomLoadingAnimation';

const MainPage = ({ route, navigation }) => {
  const [hotHits, setHotHits] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [results, setResults] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setTracks, setCurrentTrack, currentTrack } = useContext(AudioContext);
  const userId = route.params?.userId;

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
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await fetchHotHitsList();
      const artists = await fetchTopArtists();
      setTopArtists(artists);
      await fetchSongsList();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotHitsList = async () => {
    try {
      console.log('Fetching Hot Hits...');
      const tracks = await fetchHotHitsSongs();
      console.log('Fetched Hot Hits:', tracks);
      setHotHits(tracks);
    } catch (error) {
      console.error('Error fetching Hot Hits:', error);
    }
  };

  const fetchSongsList = async () => {
    try {
      // Placeholder for fetching songs if needed
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleSearch = async (query) => {
    const searchResults = await fetchTrackDetails(query);
    setResults(searchResults || []);
  };

  const handleClearSearch = () => {
    setResults([]);
  };

  const navigateToDetailPage = (track) => {
    const updatedTracks = hotHits.map((t, index) => ({ ...t, order_id: index }));
    const currentIndex = updatedTracks.findIndex(t => t.songs_id === track.songs_id);
    setTracks(updatedTracks);
    setCurrentTrack(track);
    setResults([]);
    navigation.navigate('SongPlayingPage', {
      track,
      tracks: updatedTracks,
      currentIndex,
      userId: userId,
    });
  };

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleSettingsPress = () => {
    navigation.navigate('SettingsPage');
  };

  const renderHotHitsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigateToDetailPage(item)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderTopArtistsItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('ArtistPage', { artist: item })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.outerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
     {loading && <CustomLoadingAnimation />}
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
        <RefreshableScrollView onRefresh={fetchAllData} style={styles.scrollViewContent}>
          <View style={styles.listSection}>
            <Text style={styles.subtitle}>Hot Hits</Text>
            <FlatList
              horizontal
              data={hotHits}
              renderItem={renderHotHitsItem}
              keyExtractor={item => item.songs_id.toString()}
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
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          <View style={styles.listSection}>
            <Text style={styles.subtitle}>Podcast Genres</Text>
            <FlatList
              horizontal
              data={podcastGenres}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.genreItemContainer}
                  onPress={() => navigation.navigate('PodcastPage', { genre: item })}
                >
                  <Image source={genreImages[item]} style={styles.image} />
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        </RefreshableScrollView>

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
    marginTop: 60,
    marginBottom: 20,
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
    marginTop: 40,
    marginBottom: 50,
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
