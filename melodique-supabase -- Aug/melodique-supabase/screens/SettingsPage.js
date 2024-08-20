import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import NeomorphicSlider from '../components/NeomorphicSlider';
import NeomorphicButton from '../components/NeomorphicButton';
import InfoModal from '../components/InfoModal';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../context/UserContext';
import { AudioContext } from '../context/AudioContext';
import supabase from '../supabaseClient'; // Import Supabase client

const SettingsPage = ({ navigation }) => {
  const { userId } = useContext(UserContext);
  const {
    volume,
    bass,
    treble,
    equalizer,
    updateVolume,
    updateBass,
    updateTreble,
    updateEqualizer,
  } = useContext(AudioContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAboutModalVisible, setAboutModalVisible] = useState(false);
  const [isTermsModalVisible, setTermsModalVisible] = useState(false);
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, email')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      setUsername(data.name);
      setEmail(data.email);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    }
  };

  const resetSettings = () => {
    updateVolume(0.5);
    updateBass(0.5);
    updateTreble(0.5);
    updateEqualizer('Flat');
    Alert.alert('Settings reset to default');
  };

  const handleLogout = () => {
    navigation.navigate('Login'); // Navigate to the login screen
    Alert.alert('Logout', 'You have been logged out');
  };

  const handleUpdatePassword = async () => {
    if (password.length < 4) {
      Alert.alert('Error', 'Password must be at least 4 characters');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ password })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Password updated!');
      setPassword(''); // Clear the password field
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update the password.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{username}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Update Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="New Password"
          />
          <NeomorphicButton title="Update Password" onPress={handleUpdatePassword} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Music Settings</Text>
        <View style={styles.controlContainer}>
          <Text style={styles.label}>Volume</Text>
          <NeomorphicSlider
            value={volume}
            onValueChange={updateVolume}
          />
        </View>
        <View style={styles.controlContainer}>
          <Text style={styles.label}>Bass</Text>
          <NeomorphicSlider
            value={bass}
            onValueChange={updateBass}
          />
        </View>
        <View style={styles.controlContainer}>
          <Text style={styles.label}>Treble</Text>
          <NeomorphicSlider
            value={treble}
            onValueChange={updateTreble}
          />
        </View>
        <View style={styles.controlContainer}>
          <Text style={styles.label}>Equalizer Preset</Text>
          <Picker
            selectedValue={equalizer}
            style={styles.picker}
            onValueChange={updateEqualizer}
          >
            <Picker.Item label="Flat" value="Flat" />
            <Picker.Item label="Rock" value="Rock" />
            <Picker.Item label="Pop" value="Pop" />
            <Picker.Item label="Jazz" value="Jazz" />
            <Picker.Item label="Classical" value="Classical" />
          </Picker>
        </View>
        <NeomorphicButton title="Reset to Default" onPress={resetSettings} />
      </View>

      <View style={styles.section}>
        <NeomorphicButton title="About" onPress={() => setAboutModalVisible(true)} />
        <NeomorphicButton title="Terms and Conditions" onPress={() => setTermsModalVisible(true)} />
        <NeomorphicButton title="Privacy Policy" onPress={() => setPrivacyModalVisible(true)} />
        <NeomorphicButton title="Logout" onPress={handleLogout} />
      </View>

      <InfoModal
        isVisible={isAboutModalVisible}
        onClose={() => setAboutModalVisible(false)}
        title="About"
        content={`This is a music player app developed by Sudais.\n\nThis project is part of my Mobile Development course. The app allows users to stream music, create playlists, and more.\n\nAPIs used:\n- Jamendo API for music tracks\n- Listen Notes API for podcasts`}
        logos={[
          require('../assets/Images/about/Jamendo_Logo.png'),
          require('../assets/Images/about/listen_notes.png'),
        ]}
      />
      <InfoModal
        isVisible={isTermsModalVisible}
        onClose={() => setTermsModalVisible(false)}
        title="Terms and Conditions"
        content={`Terms and Conditions:\n\n1. Introduction\nWelcome to Melodique, a music streaming app developed for educational purposes. By accessing or using our service, you agree to be bound by these terms.\n\n2. User Responsibilities\nYou agree to use the service responsibly and not to misuse it in any way. Unauthorized use or distribution of the content is prohibited.\n\n3. Privacy\nYour privacy is important to us. Please review our Privacy Policy to understand how we handle your personal information.\n\n4. Changes to Terms\nWe reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on our website.\n\n5. Contact\nIf you have any questions about these terms, please contact us at support@melodique.com.`}
      />
      <InfoModal
        isVisible={isPrivacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
        title="Privacy Policy"
        content={`Privacy Policy:\n\n1. Introduction\nYour privacy is important to us. This privacy policy explains how we collect, use, and protect your information.\n\n2. Information Collection\nWe collect information you provide directly to us, such as when you create an account, update your profile, or use our services.\n\n3. Use of Information\nWe use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect our users.\n\n4. Information Sharing\nWe do not share your personal information with third parties except as described in this policy.\n\n5. Security\nWe implement reasonable security measures to protect your information from unauthorized access.\n\n6. Contact\nIf you have any questions about this privacy policy, please contact us at support@melodique.com.`}
      />
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  controlContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    borderRadius: 5,
  },
});

export default SettingsPage;
