import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const MainPage = ({ route, navigation }) => {
  const { userId } = route.params;
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`http://192.168.1.17:5000/playlists/${userId}`); // Replace with your local IP address
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Melodique</Text>
      <Text style={styles.subtitle}>Your Playlists</Text>
      {playlists.length === 0 ? (
        <Text style={styles.noPlaylists}>No playlists available</Text>
      ) : (
        playlists.map((playlist) => (
          <View key={playlist.id} style={styles.playlistContainer}>
            <Text style={styles.playlistName}>{playlist.name}</Text>
          </View>
        ))
      )}
      <Button title="Create New Playlist" onPress={() => navigation.navigate('CreatePlaylist', { userId })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  noPlaylists: {
    fontSize: 16,
    color: '#666',
  },
  playlistContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  playlistName: {
    fontSize: 16,
  },
});

export default MainPage;
