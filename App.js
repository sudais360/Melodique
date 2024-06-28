import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import useFonts from './hooks/useFonts';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainPage from './screens/MainPage';
import SongPlayingPage from './screens/SongPlayingPage';
import AlbumPage from './screens/AlbumPage';
import ArtistPage from './screens/ArtistPage';
import { AudioProvider } from './context/AudioContext';

const Stack = createStackNavigator();

export default function App() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainPage" component={MainPage} options={{ headerShown: false }} />
          <Stack.Screen name="SongPlayingPage" component={SongPlayingPage} />
          <Stack.Screen name="AlbumPage" component={AlbumPage} />
          <Stack.Screen name="ArtistPage" component={ArtistPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
