import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const SearchBar = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim() === '') {
      onClear(); // Clear results if the query is empty
    } else {
      onSearch(query);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for music..."
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          if (text.trim() === '') {
            onClear(); // Clear results when input is empty
          }
        }}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <FontAwesome name="search" size={20} color="#7f8c8d" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
  },
  searchButton: {
    padding: 10,
  },
});

export default SearchBar;
