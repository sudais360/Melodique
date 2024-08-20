import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have these icons available

const Header = ({ onMenuPress, onSettingsPress }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Image source={require('../assets/Images/LoginScreen/logo.png')} style={styles.logo} /> 
        <Text style={styles.headerTitle}>Melodique</Text>
      </View>
      <TouchableOpacity onPress={onSettingsPress}>
        <Ionicons name="settings" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: '#d1c4e9',
    borderRadius: 10,
    marginVertical: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  logo: {
    width: 60,
    height: 30,
  },
});

export default Header;
