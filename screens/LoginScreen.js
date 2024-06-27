// LoginScreen.js
import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import NeomorphicButton from '../components/NeomorphicButton';
import NeomorphicInput from '../components/NeomorphicInput';
import { login } from '../api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await login(email, password);

      if (data.message === 'Login successful') {
        alert('Login successful');
        navigation.navigate('MainPage', { userId: data.user_id });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    }
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
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
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
  },
  tagline: {
    fontFamily: 'InriaSerif-Italic',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  signupText: {
    fontFamily: 'InriaSerif-Regular',
    color: '#333',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
});

export default LoginScreen;
