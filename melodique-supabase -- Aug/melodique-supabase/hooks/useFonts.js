// hooks/useFonts.js
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function useFonts() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Italic': require('../assets/fonts/Poppins-Italic.ttf'),
        'InriaSerif-Regular': require('../assets/fonts/InriaSerif-Regular.ttf'), 
        'InriaSerif-Italic': require('../assets/fonts/InriaSerif-Italic.ttf'), 
        'InriaSerif-Bold': require('../assets/fonts/InriaSerif-Bold.ttf'), 
      });
      setLoaded(true);
    }
    loadFonts();
  }, []);

  return loaded;
}
