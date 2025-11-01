import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const defaultImg = require('../assets/SellerSignUp.png');

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, username, bio, profileImage, onSave } = route.params;

  const [tempName, setTempName] = useState(name);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempBio, setTempBio] = useState(bio);
  const [tempImage, setTempImage] = useState(profileImage || defaultImg);

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickFromGallery,
        },
        {
          text: 'Remove Photo',
          onPress: removePhoto,
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });

      if (result.didCancel) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        setTempImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
      console.log('Camera error:', error);
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });

      if (result.didCancel) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        setTempImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.log('Gallery error:', error);
    }
  };

  const removePhoto = () => {
    setTempImage(defaultImg);
  };

  const handleSave = () => {
    if (!tempName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    if (!tempUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    onSave({ 
      name: tempName, 
      username: tempUsername, 
      bio: tempBio,
      profileImage: tempImage,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.headerText, { color: '#007AFF' }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image source={tempImage} style={styles.profileImageLarge} />
          <TouchableOpacity
            style={styles.changeImageBtn}
            onPress={handleChangePhoto}
          >
            <Text style={{ color: '#fff' }}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.textInput}
            value={tempName}
            onChangeText={setTempName}
            placeholder="Your name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.textInput}
            value={tempUsername}
            onChangeText={setTempUsername}
            placeholder="username"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bio</Text>
          <TextInput
            style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
            value={tempBio}
            onChangeText={setTempBio}
            multiline
            placeholder="Write something about yourself..."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  headerText: { fontSize: 16, color: '#000' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  profileImageLarge: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    backgroundColor: '#f0f0f0',
  },
  changeImageBtn: { 
    backgroundColor: '#000', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 6, 
    marginTop: 8,
  },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 13, color: '#666', marginBottom: 6 },
  textInput: { 
    borderWidth: 1, 
    borderColor: '#e5e5e5', 
    borderRadius: 8, 
    padding: 10, 
    fontSize: 15, 
    backgroundColor: '#fff', 
  },
});

export default EditProfileScreen;