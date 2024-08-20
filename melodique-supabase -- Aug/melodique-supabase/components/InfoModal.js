// InfoModal.js
import React from 'react';
import { Modal, View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import NeomorphicButton from './NeomorphicButton';

const InfoModal = ({ isVisible, onClose, title, content, logos }) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView>
            <Text style={styles.modalText}>{content}</Text>
            {logos && (
              <View style={styles.logosContainer}>
                {logos.map((logo, index) => (
                  <Image key={index} source={logo} style={styles.logo} resizeMode="contain" />
                ))}
              </View>
            )}
          </ScrollView>
          <NeomorphicButton title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'justify',
  },
  logosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
  },
});

export default InfoModal;
