import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import NeomorphicSlider from '../components/NeomorphicSlider';
import NeomorphicControlButton from '../components/NeomorphicControlButton';
import { Picker } from '@react-native-picker/picker';

const SettingsPage = () => {
  const [username, setUsername] = useState('User123');
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [bass, setBass] = useState(0.5);
  const [treble, setTreble] = useState(0.5);
  const [equalizer, setEqualizer] = useState('Flat');

  const resetSettings = () => {
    setVolume(0.5);
    setBass(0.5);
    setTreble(0.5);
    setEqualizer('Flat');
  };

  const handleLogout = () => {
    // Handle logout logic here
  };

  const handleUpdatePassword = () => {
    // Handle password update logic here
    alert('Password updated!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.label}>Username: {username}</Text>
        <Text style={styles.label}>Email: {email}</Text>
        <Text style={styles.label}>Update Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="New Password"
        />
        <NeomorphicControlButton label="Update Password" onPress={handleUpdatePassword} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Music Settings</Text>
        <View style={styles.controlContainer}>
          <Text style={styles.label}>Volume</Text>
          <NeomorphicSlider
            value={volume}
            onValueChange={setVolume}
          />
        </View>
        <View style={styles.controlContainer}>
          <Text style={styles.label}>Bass</Text>
          <NeomorphicSlider
            value={bass}
            onValueChange={setBass}
          />
        </View>
        <View style={styles.controlContainer}>
          <Text style={styles.label}>Treble</Text>
          <NeomorphicSlider
            value={treble}
            onValueChange={setTreble}
          />
        </View>
        <View style={styles.controlContainer}>
          <Text style={styles.label}>Equalizer Preset</Text>
          <Picker
            selectedValue={equalizer}
            style={styles.picker}
            onValueChange={(itemValue) => setEqualizer(itemValue)}
          >
            <Picker.Item label="Flat" value="Flat" />
            <Picker.Item label="Rock" value="Rock" />
            <Picker.Item label="Pop" value="Pop" />
            <Picker.Item label="Jazz" value="Jazz" />
            <Picker.Item label="Classical" value="Classical" />
          </Picker>
        </View>
        <NeomorphicControlButton label="Reset to Default" onPress={resetSettings} />
      </View>

      <View style={styles.section}>
        <NeomorphicControlButton label="About" onPress={() => { /* Handle About */ }} />
        <NeomorphicControlButton label="Terms and Conditions" onPress={() => { /* Handle Terms */ }} />
        <NeomorphicControlButton label="Privacy Policy" onPress={() => { /* Handle Privacy */ }} />
        <NeomorphicControlButton label="Logout" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  controlContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default SettingsPage;
