import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import NeomorphicButton from '../components/NeomorphicButton';
import NeomorphicInput from '../components/NeomorphicInput';
import { login } from '../context/api';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { registerForPushNotificationsAsync, sendPushNotification } from '../components/NotificationService';

const LoginScreen = () => {
  const { setUserId } = useContext(UserContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('Test@gmail.com'); // Preset email
  const [password, setPassword] = useState('Test123'); // Preset password

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Alert', 'Please enter both email and password');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Alert', 'Please enter a valid email address');
      return;
    }

    try {
      const data = await login(email, password);

      if (data && data.user_id) {
        setUserId(data.user_id); // Set the userId in the context
        console.log('Login successful, userId:', data.user_id);
        Alert.alert('Success', 'Login successful');
        
        // Register for notifications and send a welcome message
        const token = await registerForPushNotificationsAsync();
        console.log('Received push token:', token); // Debugging line
        if (token) {
          await sendPushNotification(token);
        } else {
          console.log('Failed to get push token');
        }

        navigation.navigate('MainPage');
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', `Login failed: ${error.message}`);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/Images/LoginScreen/logo.png')} style={styles.logo} />
        <Text style={styles.appName}>Melodique</Text>
        <Text style={styles.tagline}>Feel the Music, Shape Your Mood</Text>
        <NeomorphicInput placeholder="Email" value={email} onChangeText={setEmail} />
        <NeomorphicInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signupText}>Ready to vibe? Join us now!</Text>
        </TouchableOpacity>
        <NeomorphicButton title="Login" onPress={handleLogin} />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  container: {
    width: '80%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  appName: {
    fontFamily: 'InriaSerif-Bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'InriaSerif-Italic',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  signupText: {
    fontFamily: 'InriaSerif-Regular',
    color: '#333',
    textDecorationLine: 'underline',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;
