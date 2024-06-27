import React from 'react';
import { View, Slider, StyleSheet } from 'react-native';

const NeomorphicSlider = ({ value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        value={value}
        onValueChange={onValueChange}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#1f1f1f"
        maximumTrackTintColor="#a1a1a1"
        thumbTintColor="#ecf0f1"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  slider: {
    width: 300,
    height: 40,
  },
});

export default NeomorphicSlider;
