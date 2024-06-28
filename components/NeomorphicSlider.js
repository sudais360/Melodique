import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const NeomorphicSlider = ({ value, onValueChange }) => {
  return (
    <View style={styles.neomorphContainer}>
      <View style={styles.container}>
        <Slider
          style={styles.slider}
          value={value}
          onValueChange={onValueChange}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#1f1f1f"
          maximumTrackTintColor="#a1a1a1"
          thumbTintColor="#000000"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  neomorphContainer: {
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000',
    elevation: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
    padding: 10,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: '#ffffff',
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
  },
  slider: {
    width: 280,
    height: 40,
  },
});

export default NeomorphicSlider;
