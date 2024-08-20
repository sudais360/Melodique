# Melodique

Melodique is a neuromorphic-themed music streaming app built with React Native and Expo. The app provides users with a personalized music experience, including mood-based music selection, activity-based playlists, podcast integration, collaborative playlists, and offline mode.

## Features

- **Mood-Based Music Selection**: Choose music that fits your current mood and get a personalized playlist.
- **Activity-Based Playlists**: Tailored playlists for various activities such as exercising, studying, or relaxing.
- **Podcast Integration**: Access a rich selection of podcasts with categories and recommendations.
- **User-Curated and Collaborative Playlists**: Create, share, and manage personal and collaborative playlists.
- **Offline Mode**: Download tracks for offline listening.

## Screenshots

Include some screenshots of your app here.

## Installation

Follow these steps to get the app running locally:

1. **Clone the repository**:
   ```sh
   git clone [https://github.com/your-username/melodique.git](https://github.com/sudais360/Melodique.git)
   cd melodique
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Install Expo CLI globally**:
   ```sh
   npm install -g expo-cli
   ```

4. **Start the development server**:
   ```sh
   expo start
   ```

## Usage

1. **Login**: Use the login screen to enter your credentials.
2. **Main Page**: Navigate through different sections like Hot Hits, Top Albums, Top Artists, and Podcasts.
3. **Song Playback**: Select a song to go to the song playing page, where you can play, pause, and navigate through songs.
4. **Create Playlists**: Create and manage your playlists.
5. **Offline Mode**: Download songs to listen offline.

## Components

The app is divided into several components to maintain modularity:

- **NeomorphicButton.js**: Custom button with a neuromorphic design.
- **SongsListComponent.js**: Displays a list of songs.
- **HorizontalList.js**: Horizontal list component for displaying albums, artists, and podcasts.
- **MainPage.js**: The main landing page of the app.
- **SongPlayingPage.js**: Page for playing songs with interactive controls.

## API Integration

The app uses the following APIs:

- **Jamendo API**: For accessing a vast music library.
- **Listen Notes API**: For integrating podcasts.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-name
   ```
3. Make your changes.
4. Commit your changes:
   ```sh
   git commit -m 'Add some feature'
   ```
5. Push to the branch:
   ```sh
   git push origin feature-name
   ```
6. Create a pull request.

## License

This project is licensed under the MIT License.
