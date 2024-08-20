import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity,ScrollView } from 'react-native';

const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';
const JAMENDO_CLIENT_ID = 'c36a1722';

const PlaylistPage = ({ navigation }) => {
  const [tracks, setTracks] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubCategories, setExpandedSubCategories] = useState({});
  const [loading, setLoading] = useState(true);

  const categories = {
    Moods: ['happy', 'sad', 'relaxed', 'energetic'],
    Activities: ['workout', 'study', 'relax', 'commute'],
    Genres: ['pop', 'rock', 'jazz', 'classical']
  };

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const allTracks = {};
        for (const [category, types] of Object.entries(categories)) {
          allTracks[category] = [];
          for (const type of types) {
            const response = await fetch(`${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&limit=5&tags=${type}`);
            const data = await response.json();
            allTracks[category].push({ title: type.charAt(0).toUpperCase() + type.slice(1), data: data.results });
          }
        }
        setTracks(allTracks);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTracks();
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleSubCategory = (category, subCategory) => {
    setExpandedSubCategories((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: !prev[category]?.[subCategory]
      }
    }));
  };

  const renderTrack = (track, tracks, index) => (
    <TouchableOpacity
      key={track.id}
      style={styles.trackContainer}
      onPress={() => navigation.navigate('SongPlayingPage', {
        track: {
          id: track.id,
          name: track.name || 'Unknown Name',
          artist_name: track.artist_name || 'Unknown Artist',
          album_name: track.album_name || 'Unknown Album',
          image: track.album_image || 'default_image_url', // Use track's album image
          audio: track.audio,
        },
        tracks: tracks,
        currentIndex: index,
      })}
    >
      <Text style={styles.trackName}>{track.name}</Text>
      <Text style={styles.trackArtist}>{track.artist_name}</Text>
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
    <ScrollView style={styles.container}>
      {Object.keys(tracks).map((category) => (
        <View key={category}>
          <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category}</Text>
          </TouchableOpacity>
          {expandedCategories[category] && (
            <View>
              {tracks[category].map((subCategory) => (
                <View key={subCategory.title}>
                  <TouchableOpacity
                    onPress={() => toggleSubCategory(category, subCategory.title)}
                    style={styles.subCategoryHeader}
                  >
                    <Text style={styles.subCategoryTitle}>{subCategory.title}</Text>
                  </TouchableOpacity>
                  {expandedSubCategories[category]?.[subCategory.title] && (
                    <View style={styles.trackList}>
                      {subCategory.data.map((track, index) => renderTrack(track, subCategory.data, index))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryHeader: {
    backgroundColor: '#d0d0d0',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subCategoryHeader: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  subCategoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackList: {
    marginVertical: 10,
  },
  trackContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  trackName: {
    fontSize: 16,
  },
  trackArtist: {
    fontSize: 14,
    color: '#888',
  },
});

export default PlaylistPage;
