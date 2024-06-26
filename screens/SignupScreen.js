import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import NeomorphicButton from '../components/NeomorphicButton';
import NeomorphicInput from '../components/NeomorphicInput';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    try {
      const response = await fetch('http://192.168.1.17:5000/signup', { // Replace with your local IP address
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
  
      if (response.status === 201) {
        alert('User created successfully');
        // Automatically log in the user after successful signup
        handleLogin();
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
        <Text style={styles.tagline}>Join Melodique</Text>
        <NeomorphicInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
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
        <NeomorphicInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <NeomorphicButton title="Signup" onPress={handleSignup} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? Log in here.
          </Text>
        </TouchableOpacity>
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
  loginText: {
    fontFamily: 'InriaSerif-Regular',
    color: '#333',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
});

export default SignupScreen;
