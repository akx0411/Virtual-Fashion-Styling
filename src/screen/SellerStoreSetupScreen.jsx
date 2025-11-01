// src/screen/SellerStoreSetupScreen.jsx

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

export default function SellerStoreSetupScreen() {
  const [description, setDescription] = useState('');
  const [dpUri, setDpUri]             = useState(null);
  const [uploading, setUploading]     = useState(false);

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'We need access to your photos to upload your store logo.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const pickImage = async () => {
    const ok = await requestStoragePermission();
    if (!ok) {
      return Alert.alert('Permission Denied', 'Cannot access gallery.');
    }
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          return Alert.alert('Error', response.errorMessage);
        }
        const asset = response.assets?.[0];
        if (asset?.uri) {
          setDpUri(asset.uri);
        }
      }
    );
  };

  const handleSave = async () => {
    if (!dpUri) {
      return Alert.alert('Error', 'Please upload your store logo.');
    }
    setUploading(true);
    try {
      const logoURL = await uploadImageToCloudinary(dpUri, 'seller');
      const uid = auth().currentUser.uid;
      await firestore().collection('users').doc(uid).update({
        storeDpUrl:    logoURL,
        description:   description.trim(),
        profileComplete: true,
      });
      // App.jsx will route to SellerHome
    } catch (e) {
      console.error('Store setup error:', e);
      Alert.alert('Upload Failed', 'Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#953DF5', '#7CD7F7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="always"
          >
            <View style={styles.card}>
              <Ionicons
                name="storefront-outline"
                size={48}
                color="#5A31F4"
                style={styles.cardIcon}
              />
              <Text style={styles.title}>Complete Your Store</Text>
              <Text style={styles.subtitle}>
                Upload your logo and add an optional description
              </Text>

              <Pressable style={styles.logoBox} onPress={pickImage}>
                {dpUri ? (
                  <Image source={{ uri: dpUri }} style={styles.logoImage} />
                ) : (
                  <Ionicons
                    name="cloud-upload-outline"
                    size={48}
                    color="#999"
                  />
                )}
              </Pressable>
              <Text style={styles.logoLabel}>
                {dpUri ? 'Tap to change logo' : 'Tap to upload logo'}
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#999"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description (optional)"
                  placeholderTextColor="#999"
                  multiline
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <Pressable
                style={[
                  styles.button,
                  uploading && styles.disabled,
                ]}
                onPress={handleSave}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save & Continue</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cardIcon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoBox: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(245,245,245,0.9)',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  logoLabel: {
    fontSize: 12,
    color: '#444',
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 20,
  },
  inputIcon: {
    marginTop: 6,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
    backgroundColor: '#5A31F4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});