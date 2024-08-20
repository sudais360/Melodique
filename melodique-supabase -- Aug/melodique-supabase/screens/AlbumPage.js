import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const AlbumPage = ({ route }) => {
  const { album } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{album.name}</Text>
      <Image source={{ uri: album.image }} style={styles.albumImage} />
      <FlatList
        data={album.tracks}
        renderItem={({ item }) => (
          <View style={styles.trackContainer}>
            <Text style={styles.trackText}>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  albumImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  trackContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  trackText: {
    fontSize: 16,
  },
});

export default AlbumPage;
