import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const IMAGE_THUMB_SIZE = 80;

const SellerCreatePostDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const photos = route?.params?.photos || [];
  const onPublish = route?.params?.onPublish;

  const [caption, setCaption] = useState('');
  const [size, setSize] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleTagInput = (text) => {
    setTagInput(text);
    if (text.endsWith(' ') && text.trim()) {
      addTag(text.trim());
      setTagInput('');
    }
  };

  const addTag = (tag) => {
    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (cleanTag.length > 1 && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagSubmit = () => {
    if (tagInput.trim()) {
      addTag(tagInput.trim());
      setTagInput('');
    }
  };

  const handlePublish = () => {
    // Validation
    if (!caption.trim()) {
      Alert.alert('Caption Required', 'Please enter a caption for your post');
      return;
    }
    if (!size.trim()) {
      Alert.alert('Size Required', 'Please enter the size');
      return;
    }
    if (!brand.trim()) {
      Alert.alert('Brand Required', 'Please enter the brand');
      return;
    }
    if (!color.trim()) {
      Alert.alert('Color Required', 'Please enter the color');
      return;
    }
    if (!price.trim()) {
      Alert.alert('Price Required', 'Please enter the price');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      images: photos.map(p => p.uri),
      caption,
      size,
      brand,
      color,
      price,
      tags,
      createdAt: new Date().toISOString(),
    };

    if (typeof onPublish === 'function') {
      onPublish(newPost);
    }

    // Show success and navigate to post detail
    Alert.alert(
      'Success! 🎉', 
      'Your post has been published successfully!',
      [
        {
          text: 'View Post',
          onPress: () => {
            navigation.replace('PostDetail', { post: newPost });
          }
        },
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const characterCount = caption.length;
  const maxChars = 2200;
  const isFormValid = caption.trim() && size.trim() && brand.trim() && color.trim() && price.trim();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Product Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Main Selected Image */}
        {photos.length > 0 && (
          <View style={styles.mainImageContainer}>
            <Image 
              source={{ uri: photos[selectedImageIndex]?.uri }} 
              style={styles.mainImage} 
            />
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1} / {photos.length}
              </Text>
            </View>
          </View>
        )}

        {/* Image Thumbnails */}
        {photos.length > 1 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.thumbScroll}
            contentContainerStyle={styles.thumbContainer}>
            {photos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.thumbnailSelected
                ]}>
                <Image source={{ uri: photo.uri }} style={styles.thumbImage} />
                {selectedImageIndex === index && (
                  <View style={styles.selectedOverlay}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Required Fields Notice */}
        <View style={styles.noticeBox}>
          <Text style={styles.noticeIcon}>ℹ️</Text>
          <Text style={styles.noticeText}>All fields marked with * are required</Text>
        </View>

        {/* Caption Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.labelWithIcon}>
              <Text style={styles.iconText}>📝</Text>
              <Text style={styles.sectionTitle}>Description *</Text>
            </View>
            <Text style={[
              styles.charCount,
              characterCount > maxChars && styles.charCountOver
            ]}>
              {characterCount} / {maxChars}
            </Text>
          </View>
          <TextInput
            placeholder="Describe your product in detail..."
            placeholderTextColor="#adb5bd"
            style={styles.captionInput}
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={maxChars}
          />
        </View>

        {/* Product Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.labelWithIcon}>
              <Text style={styles.iconText}>📦</Text>
              <Text style={styles.sectionTitle}>Product Information</Text>
            </View>
          </View>

          {/* Size Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Size *</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>📏</Text>
              <TextInput
                placeholder="e.g., S, M, L, XL, 32, 42"
                placeholderTextColor="#adb5bd"
                style={styles.input}
                value={size}
                onChangeText={setSize}
              />
            </View>
          </View>

          {/* Brand Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Brand *</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🏷️</Text>
              <TextInput
                placeholder="e.g., Nike, Zara, H&M"
                placeholderTextColor="#adb5bd"
                style={styles.input}
                value={brand}
                onChangeText={setBrand}
              />
            </View>
          </View>

          {/* Color Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Color *</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🎨</Text>
              <TextInput
                placeholder="e.g., Red, Blue, Black"
                placeholderTextColor="#adb5bd"
                style={styles.input}
                value={color}
                onChangeText={setColor}
              />
            </View>
          </View>

          {/* Price Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price *</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>💰</Text>
              <TextInput
                placeholder="e.g., 2500"
                placeholderTextColor="#adb5bd"
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Tags Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.labelWithIcon}>
              <Text style={styles.iconText}>🏷️</Text>
              <Text style={styles.sectionTitle}>Tags (Optional)</Text>
            </View>
            <Text style={styles.tagCount}>{tags.length} tag{tags.length !== 1 ? 's' : ''}</Text>
          </View>
          
          {/* Tag Display */}
          {tags.length > 0 && (
            <View style={styles.tagsDisplay}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity 
                    onPress={() => removeTag(tag)}
                    style={styles.tagRemove}>
                    <Text style={styles.tagRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Tag Input */}
          <View style={styles.tagInputContainer}>
            <Text style={styles.hashSymbol}>#</Text>
            <TextInput
              placeholder="fashion, trending, sale..."
              placeholderTextColor="#adb5bd"
              style={styles.tagInput}
              value={tagInput}
              onChangeText={handleTagInput}
              onSubmitEditing={handleTagSubmit}
              returnKeyType="done"
            />
            {tagInput.trim().length > 0 && (
              <TouchableOpacity 
                onPress={handleTagSubmit}
                style={styles.addTagBtn}>
                <Text style={styles.addTagText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.tagHint}>Press space or "Add" to create a tag</Text>
        </View>

        {/* Suggested Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Tags</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedTags}>
            {['fashion', 'trending', 'sale', 'new', 'stylish', 'affordable'].map((suggested) => (
              <TouchableOpacity
                key={suggested}
                onPress={() => addTag(suggested)}
                style={styles.suggestedChip}
                disabled={tags.includes(`#${suggested}`)}>
                <Text style={[
                  styles.suggestedText,
                  tags.includes(`#${suggested}`) && styles.suggestedTextDisabled
                ]}>
                  #{suggested}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Publish Button */}
      <View style={styles.publishContainer}>
        <TouchableOpacity 
          style={[
            styles.publishBtn,
            !isFormValid && styles.publishBtnDisabled
          ]} 
          onPress={handlePublish}
          disabled={!isFormValid}>
          <Text style={styles.publishIcon}>✓</Text>
          <Text style={styles.publishText}>Publish Product</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f3f5', alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: '#212529' },
  title: { fontSize: 20, fontWeight: '700', color: '#212529', letterSpacing: -0.5 },
  headerSpacer: { width: 40 },
  scrollContent: { paddingBottom: 20 },
  mainImageContainer: { position: 'relative', backgroundColor: '#000' },
  mainImage: { width: width, height: width, resizeMode: 'cover' },
  imageCounter: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.75)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  imageCounterText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  thumbScroll: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  thumbContainer: { paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  thumbnail: { width: IMAGE_THUMB_SIZE, height: IMAGE_THUMB_SIZE, borderRadius: 12, overflow: 'hidden', marginRight: 8, borderWidth: 3, borderColor: 'transparent' },
  thumbnailSelected: { borderColor: '#212529' },
  thumbImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  selectedOverlay: { position: 'absolute', top: 0, right: 0, backgroundColor: '#212529', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', margin: 4 },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  noticeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff3bf', paddingHorizontal: 16, paddingVertical: 12, marginTop: 12, gap: 10 },
  noticeIcon: { fontSize: 20 },
  noticeText: { flex: 1, fontSize: 13, color: '#f59f00', fontWeight: '600' },
  section: { backgroundColor: '#fff', marginTop: 12, paddingHorizontal: 16, paddingVertical: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  labelWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconText: { fontSize: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#212529' },
  charCount: { fontSize: 13, color: '#868e96', fontWeight: '600' },
  charCountOver: { color: '#fa5252' },
  captionInput: { borderWidth: 1.5, borderColor: '#dee2e6', borderRadius: 12, padding: 14, minHeight: 100, fontSize: 15, color: '#212529', textAlignVertical: 'top', backgroundColor: '#f8f9fa' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#dee2e6', borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 12, gap: 10 },
  inputIcon: { fontSize: 18 },
  input: { flex: 1, fontSize: 15, color: '#212529', paddingVertical: 12 },
  tagCount: { fontSize: 13, color: '#1971c2', fontWeight: '700', backgroundColor: '#e7f5ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagsDisplay: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tagChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e7f5ff', borderRadius: 20, paddingLeft: 14, paddingRight: 6, paddingVertical: 8, borderWidth: 1.5, borderColor: '#74c0fc' },
  tagText: { color: '#1971c2', fontSize: 14, fontWeight: '600', marginRight: 6 },
  tagRemove: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#1971c2', alignItems: 'center', justifyContent: 'center' },
  tagRemoveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  tagInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#dee2e6', borderRadius: 12, backgroundColor: '#f8f9fa', paddingHorizontal: 14, paddingVertical: 4 },
  hashSymbol: { fontSize: 18, fontWeight: '700', color: '#1971c2', marginRight: 4 },
  tagInput: { flex: 1, fontSize: 15, color: '#212529', paddingVertical: 10 },
  addTagBtn: { backgroundColor: '#1971c2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addTagText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  tagHint: { fontSize: 12, color: '#868e96', marginTop: 8, fontStyle: 'italic' },
  suggestedTags: { paddingTop: 8, gap: 8 },
  suggestedChip: { backgroundColor: '#f8f9fa', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: '#dee2e6', marginRight: 8 },
  suggestedText: { color: '#495057', fontSize: 14, fontWeight: '600' },
  suggestedTextDisabled: { color: '#adb5bd', textDecorationLine: 'line-through' },
  publishContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#e9ecef', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  publishBtn: { backgroundColor: '#10b981', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  publishBtnDisabled: { backgroundColor: '#adb5bd', opacity: 0.6, shadowOpacity: 0, elevation: 0 },
  publishIcon: { fontSize: 20, color: '#fff' },
  publishText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});

export default SellerCreatePostDetailsScreen;

