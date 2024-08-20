import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const SearchResults = ({ results, onSelect }) => {
  if (results.length === 0) return null; // Hide when there are no results

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Results</Text>
      <FlatList
        data={results.slice(0, 10)} // Limit to 5 results
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              onSelect(item);
            }}
            style={styles.resultContainer}
          >
            <Image source={{ uri: item.image }} style={styles.resultImage} />
            <Text style={styles.resultText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: '#000',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowColor: '#000',
    elevation: 2,
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchResults;
