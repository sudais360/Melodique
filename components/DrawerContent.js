import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Added MaterialCommunityIcons for sand timer icon

const DrawerContent = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <View style={styles.menuItemsContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('LikedSongs')}>
          <Ionicons name="heart" size={24} color="black" style={styles.icon} />
          <Text style={styles.menuItemText}>Liked Songs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Playlists')}>
          <Ionicons name="musical-notes" size={24} color="black" style={styles.icon} />
          <Text style={styles.menuItemText}>Playlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Timer')}>
          <MaterialCommunityIcons name="timer-sand" size={24} color="black" style={styles.icon} />
          <Text style={styles.menuItemText}>Timer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa', // Background color for the drawer
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  menuItemsContainer: {
    flex: 1,
    
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    
  },
  icon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
  },
});

export default DrawerContent;
