import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LikedSongs = () => {
  return (
    <View style={styles.container}>
      <Text>Liked Songs</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LikedSongs;
