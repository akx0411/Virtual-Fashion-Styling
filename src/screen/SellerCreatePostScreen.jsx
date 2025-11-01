import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 3;

const SellerCreatePostScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const onCreate = route.params?.onCreate;
  const [photos, setPhotos] = useState([]);

  // Pick multiple from Gallery
  const pickFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 10, // Allow up to 10 images
      });
      if (result.didCancel) return;
      if (result.assets && result.assets.length > 0) {
        setPhotos(prev => [...prev, ...result.assets]);
        console.log('Picked from gallery:', result.assets.length, 'images');
      }
    } catch (err) {
      console.warn('Gallery pick error:', err);
    }
  };

  // Take Photo
  const takePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });
      if (result.didCancel) return;
      if (result.assets && result.assets.length > 0) {
        setPhotos(prev => [...prev, result.assets[0]]);
        console.log('Took photo:', result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Camera error:', err);
    }
  };

  // Remove a specific photo
  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Go to next screen with selected photos
  const handleNext = () => {
    if (photos.length === 0) {
      Alert.alert('Please select at least one photo');
      return;
    }

    console.log('Navigating with', photos.length, 'photos');
    navigation.navigate('SellerCreatePostDetailScreen', {
      photos, // Pass array of photos
      onPublish: (post) => {
        if (typeof onCreate === 'function') {
          onCreate(post); // This should ADD the post, not replace
        }
        navigation.goBack();
      },
    });
  };

  const handleCancel = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('SellerProfileScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Post</Text>
          <View style={styles.photoCount}>
            <Text style={styles.countText}>{photos.length}/10</Text>
          </View>
        </View>
      </View>

      {/* Photo Grid */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {photos.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>📸</Text>
            </View>
            <Text style={styles.emptyTitle}>No photos yet</Text>
            <Text style={styles.emptySubtitle}>
              Add up to 10 photos to your post
            </Text>
          </View>
        ) : (
          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photo.uri }} style={styles.photoThumb} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removePhoto(index)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
                <View style={styles.photoNumber}>
                  <Text style={styles.photoNumberText}>{index + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={pickFromGallery}
            disabled={photos.length >= 10}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🖼️</Text>
            </View>
            <Text style={styles.actionLabel}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={takePhoto}
            disabled={photos.length >= 10}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>📷</Text>
            </View>
            <Text style={styles.actionLabel}>Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextBtn, photos.length === 0 && styles.nextDisabled]}
          onPress={handleNext}
          disabled={photos.length === 0}>
          <Text style={styles.nextText}>
            Continue {photos.length > 0 && `with ${photos.length} photo${photos.length > 1 ? 's' : ''}`}
          </Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  cancelBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f3f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelIcon: { 
    fontSize: 20, 
    color: '#495057',
    fontWeight: '600',
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700',
    color: '#212529',
    letterSpacing: -0.5,
  },
  photoCount: {
    backgroundColor: '#e7f5ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1971c2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyIconText: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#868e96',
    textAlign: 'center',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  photoNumber: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoNumberText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  actionContainer: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  iconText: {
    fontSize: 28,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  nextBtn: {
    backgroundColor: '#212529',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextDisabled: {
    backgroundColor: '#adb5bd',
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  arrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default SellerCreatePostScreen;