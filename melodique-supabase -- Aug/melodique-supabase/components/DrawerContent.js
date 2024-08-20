import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import supabase from '../supabaseClient'; // Import Supabase client

const DrawerContent = ({ navigation }) => {
  const { userId } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users') // Replace with your actual table name
          .select('name')
          .eq('user_id', userId)
          .single();

        if (error) {
          throw error;
        }

        setUsername(data.name);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <View style={styles.menuItemsContainer}>
        <Text>User Name: {username}</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('MainPage', { userId })}
        >
          <Ionicons name="home" size={24} color="black" style={styles.icon} />
          <Text style={styles.menuItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('LikedSongs', { userId })}
        >
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
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('BackupSongs')}>
          <MaterialCommunityIcons name="backup-restore" size={24} color="black" style={styles.icon} />
          <Text style={styles.menuItemText}>Backup Songs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
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
