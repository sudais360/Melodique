import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const HorizontalList = ({ title, data, onPressItem, banner }) => {
  return (
    <View style={styles.container}>
      {banner && <Image source={banner} style={styles.banner} />}
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => onPressItem(item)}
          >
            <Image source={{ uri: item.album_image }} style={styles.image} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemArtist}>{item.artist_name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  banner: {
    width: '100%',
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  itemContainer: {
    marginRight: 10,
    width: 120,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemArtist: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});

export default HorizontalList;
