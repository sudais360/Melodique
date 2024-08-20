import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const NeomorphicInput = ({ placeholder, value, onChangeText, secureTextEntry }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000',
    flex: 1,
    paddingVertical: 5,
  },
});

export default NeomorphicInput;
