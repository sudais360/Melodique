import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, SectionList, TouchableOpacity } from 'react-native';
import axios from 'axios';

const PlaylistPage = ({ navigation }) => {
  const [moodPlaylists, setMoodPlaylists] = useState([]);
  const [activityPlaylists, setActivityPlaylists] = useState([]);
  const [genrePlaylists, setGenrePlaylists] = useState([]);
  const [topCharts, setTopCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const moodResponse = await axios.get('https://api.jamendo.com/v3.0/playlists', {
          params: {
            client_id: 'YOUR_JAMENDO_CLIENT_ID',
            limit: 10,
            tags: 'mood',
          },
        });
        setMoodPlaylists(moodResponse.data.results);

        const activityResponse = await axios.get('https://api.jamendo.com/v3.0/playlists', {
          params: {
            client_id: 'YOUR_JAMENDO_CLIENT_ID',
            limit: 10,
            tags: 'activity',
          },
        });
        setActivityPlaylists(activityResponse.data.results);

        const genreResponse = await axios.get('https://api.jamendo.com/v3.0/playlists', {
          params: {
            client_id: 'YOUR_JAMENDO_CLIENT_ID',
            limit: 10,
            tags: 'genre',
          },
        });
        setGenrePlaylists(genreResponse.data.results);

        const topChartsResponse = await axios.get('https://api.jamendo.com/v3.0/tracks', {
          params: {
            client_id: 'YOUR_JAMENDO_CLIENT_ID',
            limit: 10,
            order: 'popularity_week',
          },
        });
        setTopCharts(topChartsResponse.data.results);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaylists();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchResponse = await axios.get('https://api.jamendo.com/v3.0/playlists', {
        params: {
          client_id: 'YOUR_JAMENDO_CLIENT_ID',
          limit: 10,
          name: searchQuery,
        },
      });
      setMoodPlaylists(searchResponse.data.results);
      setActivityPlaylists(searchResponse.data.results);
      setGenrePlaylists(searchResponse.data.results);
      setTopCharts(searchResponse.data.results);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const renderPlaylist = ({ item }) => (
    <TouchableOpacity
      style={styles.playlistContainer}
      onPress={() => navigation.navigate('PlaylistDetails', { playlist: item })}
    >
      <Text style={styles.playlistName}>{item.name}</Text>
    </TouchableOpacity>
  );

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
        placeholder="Search Playlists"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <SectionList
        sections={[
          { title: 'Mood-Based Playlists', data: moodPlaylists },
          { title: 'Activity-Based Playlists', data: activityPlaylists },
          { title: 'Genre-Based Playlists', data: genrePlaylists },
          { title: 'Top Charts', data: topCharts },
        ]}
        renderItem={renderPlaylist}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.title}>{title}</Text>
        )}
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
  playlistContainer: {
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
  playlistName: {
    fontSize: 18,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default PlaylistPage;
