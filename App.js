import React, { useState } from 'react'; // Ensure useState is imported
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
import { AudioProvider } from './context/AudioContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStackNavigator = ({ route, navigation }) => {
  const { userId } = route.params;
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainPage" component={MainPage} options={{ headerShown: false }} initialParams={{ userId }} />
      <Stack.Screen name="SongPlayingPage" component={SongPlayingPage} />
      <Stack.Screen name="AlbumPage" component={AlbumPage} />
      <Stack.Screen name="ArtistPage" component={ArtistPage} />
      <Stack.Screen name="PodcastPage" component={PodcastPage} />
      <Stack.Screen name="SettingsPage" component={SettingsPage} />
    </Stack.Navigator>
  );
};

export default function App() {
  const fontsLoaded = useFonts();
  const [userId, setUserId] = useState(1); // Simulating userId for demonstration

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
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props} userId={userId} />}>
          <Drawer.Screen name="Home" options={{ headerShown: false }}>
            {props => <MainStackNavigator {...props} route={{ params: { userId } }}  />}
          </Drawer.Screen>
          <Drawer.Screen name="LikedSongs" component={LikedSongs} />
          <Drawer.Screen name="Playlists" component={Playlists} />
          <Drawer.Screen name="Timer" component={Timer} />
        </Drawer.Navigator>
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
