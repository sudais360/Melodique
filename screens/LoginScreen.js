import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import NeomorphicButton from '../components/NeomorphicButton';
import NeomorphicInput from '../components/NeomorphicInput';
import { API_BASE_URL } from '../config';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 401) {
        Alert.alert('Alert', 'Invalid email or password');
        return;
      } else if (response.status === 404) {
        Alert.alert('Alert', 'User does not exist');
        return;
      } else if (!response.ok) {
        throw new Error('An unexpected error occurred');
      }

      const data = await response.json();
      console.log("Login successful, userId:", data.user_id);
      navigation.navigate('MainPage', { userId: data.user_id });
      
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Alert', 'An error occurred. Please try again.');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Image
          source={require('../assets/Images/LoginScreen/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Melodique</Text>
        <Text style={styles.tagline}>Feel the Music, Shape Your Mood</Text>
        <NeomorphicInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <NeomorphicInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
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
