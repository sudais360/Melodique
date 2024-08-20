import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import useFonts from './hooks/useFonts';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainPage from './screens/MainPage';
import SongPlayingPage from './screens/SongPlayingPage';
import AlbumPage from './screens/AlbumPage';
import ArtistPage from './screens/ArtistPage';
import PodcastPage from './screens/PodcastPage';
import SettingsPage from './screens/SettingsPage';
import LikedSongs from './screens/LikedSongs';
import Playlists from './screens/Playlists';
import Timer from './screens/Timer';
import DrawerContent from './components/DrawerContent';
import { UserProvider } from './context/UserContext';
import { AudioProvider } from './context/AudioContext';
import BackupSongs from './screens/BackupSongs';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainPage"
        component={MainPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SongPlayingPage" component={SongPlayingPage} />
      <Stack.Screen name="AlbumPage" component={AlbumPage} />
      <Stack.Screen name="ArtistPage" component={ArtistPage} />
      <Stack.Screen name="PodcastPage" component={PodcastPage} />
      <Stack.Screen name="SettingsPage" component={SettingsPage} />
      <Stack.Screen name="LikedSongs" component={LikedSongs} />
      <Stack.Screen name="BackupSong" component={BackupSongs} />
    </Stack.Navigator>
  );
};

const App = () => {
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
      <UserProvider>
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}>
            <Drawer.Screen name="Home" options={{ headerShown: false }}>
              {(props) => <MainStackNavigator {...props} />}
            </Drawer.Screen>
            <Drawer.Screen name="LikedSongs" component={LikedSongs} />
            <Drawer.Screen name="Playlists" component={Playlists} />
            <Drawer.Screen name="Timer" component={Timer} />
            <Drawer.Screen name="BackupSongs" component={BackupSongs} />
          </Drawer.Navigator>
        </NavigationContainer>
      </UserProvider>
    </AudioProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
