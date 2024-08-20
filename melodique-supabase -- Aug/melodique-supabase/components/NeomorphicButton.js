// NeomorphicButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const NeomorphicButton = ({ onPress, title, image }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {image && <Image source={image} style={styles.image} />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontSize: 16,
    marginLeft: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default NeomorphicButton;
