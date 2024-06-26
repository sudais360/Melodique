import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const NeomorphicButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 12,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontSize: 16,
  },
});

export default NeomorphicButton;
