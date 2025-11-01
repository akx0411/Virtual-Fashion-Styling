// src/screen/UserSelectionScreen.jsx

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const UserSelectionScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const handleNext = () => {
    if (selected === 'User') {
      // open modal to choose Normal User vs Admin
      setShowUserModal(true);
    } else if (selected === 'Seller') {
      navigation.navigate('SellerHome');
    }
  };

  const handleUserRole = role => {
    setShowUserModal(false);
    if (role === 'Admin') {
      navigation.navigate('AdminLogin');
    } else {
      navigation.navigate('UserLogReg');
    }
  };

  return (
    <LinearGradient
      colors={['#953DF5', '#7CD7F7']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={styles.title}>Style Sense</Text>
      <Text style={styles.subtitle}>
        Choose your path and start your journey!
      </Text>

      <View style={styles.selectionContainer}>
        {/* User Option */}
        <View style={styles.optionWrapper}>
          <Text style={styles.labelText}>I am a User</Text>
          <TouchableOpacity
            style={[
              styles.imageBox,
              selected === 'User' && styles.selectedBox
            ]}
            onPress={() => setSelected('User')}
          >
            <Image
              source={require('../assets/userselect.jpg')}
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.imageText}>
            Discover Your Perfect Style
          </Text>
        </View>

        {/* Seller Option (unchanged) */}
        <View style={styles.optionWrapper}>
          <Text style={styles.labelText}>I am a Seller</Text>
          <TouchableOpacity
            style={[
              styles.imageBox,
              selected === 'Seller' && styles.selectedBox
            ]}
            onPress={() => setSelected('Seller')}
          >
            <Image
              source={require('../assets/sellerselect.jpg')}
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.imageText}>
            Grow Your Fashion Business
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          selected ? styles.nextButtonActive : styles.nextButtonDisabled
        ]}
        onPress={handleNext}
        disabled={!selected}
      >
        <Text
          style={[
            styles.nextButtonText,
            selected
              ? styles.nextButtonTextActive
              : styles.nextButtonTextDisabled
          ]}
        >
          Next
        </Text>
      </TouchableOpacity>

      {/* Modal for User Role Choice */}
      <Modal visible={showUserModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Continue as:</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleUserRole('User')}
            >
              <Text style={styles.modalOptionText}>Normal User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleUserRole('Admin')}
            >
              <Text style={styles.modalOptionText}>Organizational Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowUserModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default UserSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  optionWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
    maxWidth: 140
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  imageBox: {
    width: 110,
    height: 110,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  selectedBox: {
    borderWidth: 3,
    borderColor: '#FF00FF'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  imageText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5
  },
  nextButton: {
    width: '90%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 50
  },
  nextButtonActive: {
    backgroundColor: '#000'
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(200, 200, 200, 0.5)'
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  nextButtonTextActive: {
    color: '#fff'
  },
  nextButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  modalOption: {
    backgroundColor: '#953DF5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
    width: '100%',
    alignItems: 'center'
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  modalCancel: {
    marginTop: 12
  },
  modalCancelText: {
    color: '#666',
    fontSize: 14
  }
});