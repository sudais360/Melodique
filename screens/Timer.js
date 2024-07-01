import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AudioContext } from '../context/AudioContext';

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const { isPlaying, playPauseAudio } = useContext(AudioContext);

  useEffect(() => {
    let timer;
    if (running && time > 0) {
      timer = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (time === 0 && running) {
      setRunning(false);
      if (isPlaying) {
        playPauseAudio(); // Pause the audio
      }
    }
    return () => clearTimeout(timer);
  }, [time, running]);

  const handleStart = () => {
    const totalSeconds = hours * 3600 + minutes * 60;
    if (totalSeconds > 0) {
      setTime(totalSeconds);
      setRunning(true);
    }
  };

  const handleStop = () => {
    setRunning(false);
    setTime(0);
    setHours(0);
    setMinutes(0);
  };

  const showDatePicker = () => {
    setPickerVisible(true);
  };

  const hideDatePicker = () => {
    setPickerVisible(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    const selectedHours = date.getHours();
    const selectedMinutes = date.getMinutes();
    setHours(selectedHours);
    setMinutes(selectedMinutes);
    const totalSeconds = selectedHours * 3600 + selectedMinutes * 60;
    if (totalSeconds > 0) {
      setTime(totalSeconds);
      setRunning(true);
    }
  };

  const formatTime = (timeInSeconds) => {
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = timeInSeconds % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.title}>Set Timer</Text>
        <TouchableOpacity
          style={styles.neomorphicButton}
          onPress={showDatePicker}
        >
          <Text style={styles.buttonText}>Select Time</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          headerTextIOS="Pick a time"
          is24Hour={true}
        />
        <Text style={styles.timer}>
          {formatTime(time)}
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.neomorphicButton}
            onPress={handleStart}
            disabled={running || (hours === 0 && minutes === 0)}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.neomorphicButton} onPress={handleStop}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.presets}>
          <TouchableOpacity style={styles.presetButton} onPress={() => { setHours(1); setMinutes(0); setTime(3600); setRunning(true); }}>
            <Text style={styles.buttonText}>1 hr</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.presetButton} onPress={() => { setHours(0); setMinutes(30); setTime(1800); setRunning(true); }}>
            <Text style={styles.buttonText}>30 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.presetButton} onPress={() => { setHours(0); setMinutes(15); setTime(900); setRunning(true); }}>
            <Text style={styles.buttonText}>15 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.presetButton} onPress={() => { setHours(0); setMinutes(5); setTime(300); setRunning(true); }}>
            <Text style={styles.buttonText}>5 min</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  timerContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    marginBottom: 20,
    color: '#333',
    textShadowColor: '#a3b1c6',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 5,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  neomorphicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default Timer;
