import React from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';

const SongsListComponent = ({ songs, navigation }) => {
  const navigateToSongPlayingPage = (song) => {
    navigation.navigate('SongPlayingPage', { track: song });
  };

  return (
    <FlatList
      data={songs}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigateToSongPlayingPage(item)}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default SongsListComponent;
