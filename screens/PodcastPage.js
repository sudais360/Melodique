// screens/PodcastPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PodcastPage = ({ route }) => {
  const { podcast } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{podcast.title}</Text>
      <Text style={styles.description}>{podcast.description}</Text>
      {/* Add more podcast details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});

export default PodcastPage;
