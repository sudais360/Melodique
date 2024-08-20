import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import { searchMusic } from './api'; // Adjust the path if necessary

const TestComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trackDetails, setTrackDetails] = useState(null);
  const sound = useRef(new Audio.Sound());

  const handleSearch = async () => {
    const searchResults = await searchMusic(query);
    setResults(searchResults.tracks || []);
  };

  const fetchTrackDetails = async (match) => {
    try {
      const response = await axios.get('https://api.jamendo.com/v3.0/tracks', {
        params: {
          client_id: 'c36a1722',
          format: 'json',
          name: match, // Using the match to search for specific track details
          limit: 1
        }
      });
      setTrackDetails(response.data.results[0]);
    } catch (error) {
      console.error('Error fetching track details:', error);
    }
  };

  const playTrack = async () => {
    if (trackDetails && trackDetails.audio) {
      try {
        await sound.current.unloadAsync();
        await sound.current.loadAsync({ uri: trackDetails.audio });
        await sound.current.playAsync();
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for music..."
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Search Results</Text>
          {results.map((result, index) => (
            <TouchableOpacity key={index} onPress={() => fetchTrackDetails(result.match)}>
              <Text style={styles.resultText}>{result.match}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {trackDetails && (
        <View style={styles.trackDetailsContainer}>
          <Text style={styles.trackTitle}>{trackDetails.name}</Text>
          <Text style={styles.trackArtist}>{trackDetails.artist_name}</Text>
          <TouchableOpacity style={styles.playButton} onPress={playTrack}>
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
  },
  trackDetailsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trackArtist: {
    fontSize: 18,
    color: 'gray',
  },
  playButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TestComponent;
