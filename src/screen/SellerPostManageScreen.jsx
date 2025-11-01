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

const SellerPostManageScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const post = route?.params?.post || null;
  const onUpdate = route?.params?.onUpdate || (() => {});
  const onDelete = route?.params?.onDelete || (() => {});

  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(post?.caption || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(post?.tags || []);
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

  const handleSave = () => {
    if (!caption.trim()) {
      Alert.alert('Caption Required', 'Please enter a caption');
      return;
    }
    
    if (!post) {
      Alert.alert('Error', 'Post data not found');
      return;
    }

    // Safe way to create updated post
    const updatedPost = {
      ...post,
      caption: caption.trim(),
      tags: tags,
    };

    onUpdate(updatedPost);
    Alert.alert('Success! ✅', 'Post updated', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleDelete = () => {
    if (!post) {
      Alert.alert('Error', 'Post data not found');
      return;
    }

    Alert.alert('Delete Post?', 'This cannot be undone', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          onDelete(post.id);
          Alert.alert('Deleted', 'Post removed', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        },
      },
    ]);
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setSelectedImageIndex(newIndex);
  };

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Post not found</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Manage Post</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editToggle}>
          <Text style={[styles.editIcon, isEditing && styles.editIconActive]}>
            {isEditing ? "✓" : "✎"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
          >
            {post.images?.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.postImage} resizeMode="cover" />
            ))}
          </ScrollView>
          
          {post.images?.length > 1 && (
            <>
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {selectedImageIndex + 1}/{post.images.length}
                </Text>
              </View>
              <View style={styles.dotsContainer}>
                {post.images.map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.dot, 
                      selectedImageIndex === i && styles.dotActive
                    ]} 
                  />
                ))}
              </View>
            </>
          )}
        </View>

        {isEditing && (
          <View style={styles.editBanner}>
            <Text style={styles.editBannerIcon}>✎</Text>
            <Text style={styles.editBannerText}>Edit Mode Active</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📝</Text>
            <Text style={styles.sectionTitle}>Caption</Text>
          </View>
          {isEditing ? (
            <TextInput 
              placeholder="Write caption..." 
              style={styles.captionInput}
              value={caption} 
              onChangeText={setCaption} 
              multiline 
              maxLength={2200} 
            />
          ) : (
            <Text style={styles.captionDisplay}>{caption}</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🏷️</Text>
            <Text style={styles.sectionTitle}>Tags</Text>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsDisplay}>
              {tags.map((tag, i) => (
                <View key={i} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                  {isEditing && (
                    <TouchableOpacity onPress={() => removeTag(tag)} style={styles.tagRemove}>
                      <Text style={styles.tagRemoveText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
          {isEditing && (
            <View style={styles.tagInputContainer}>
              <Text style={styles.hashSymbol}>#</Text>
              <TextInput 
                placeholder="Add tags..." 
                style={styles.tagInput}
                value={tagInput} 
                onChangeText={handleTagInput} 
                onSubmitEditing={handleTagSubmit} 
              />
              {tagInput.trim().length > 0 && (
                <TouchableOpacity onPress={handleTagSubmit} style={styles.addTagBtn}>
                  <Text style={styles.addTagText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.metaSection}>
          <Text style={styles.metaIcon}>📅</Text>
          <Text style={styles.metaText}>
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'long', 
              day: 'numeric', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit'
            }) : 'Unknown date'}
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.actionBar}>
        {isEditing ? (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnIcon}>✓</Text>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnIcon}>🗑️</Text>
            <Text style={styles.deleteBtnText}>Delete Post</Text>
          </TouchableOpacity>
        )}
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
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 16, 
    paddingVertical: 16, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e9ecef' 
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#f1f3f5', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  backIcon: { 
    fontSize: 24, 
    color: '#212529' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#212529' 
  },
  editToggle: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  editIcon: { 
    fontSize: 24, 
    color: '#212529' 
  },
  editIconActive: { 
    color: '#10b981' 
  },
  imageSection: { 
    position: 'relative', 
    backgroundColor: '#000' 
  },
  postImage: { 
    width, 
    height: width, 
    backgroundColor: '#000' 
  },
  imageCounter: { 
    position: 'absolute', 
    top: 16, 
    right: 16, 
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16 
  },
  imageCounterText: { 
    color: '#fff', 
    fontSize: 13, 
    fontWeight: '700' 
  },
  dotsContainer: { 
    position: 'absolute', 
    bottom: 16, 
    alignSelf: 'center', 
    flexDirection: 'row', 
    gap: 6 
  },
  dot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: 'rgba(255,255,255,0.5)' 
  },
  dotActive: { 
    backgroundColor: '#fff', 
    width: 20 
  },
  editBanner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#d1fae5',
    paddingVertical: 12, 
    gap: 8 
  },
  editBannerIcon: { 
    fontSize: 16, 
    color: '#10b981' 
  },
  editBannerText: { 
    color: '#10b981', 
    fontWeight: '700', 
    fontSize: 14 
  },
  section: { 
    backgroundColor: '#fff', 
    marginTop: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 16 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    gap: 8 
  },
  sectionIcon: { 
    fontSize: 20 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#212529', 
    flex: 1 
  },
  captionInput: { 
    borderWidth: 1.5, 
    borderColor: '#dee2e6', 
    borderRadius: 12, 
    padding: 14,
    minHeight: 100, 
    fontSize: 15, 
    color: '#212529', 
    textAlignVertical: 'top', 
    backgroundColor: '#f8f9fa' 
  },
  captionDisplay: { 
    fontSize: 15, 
    color: '#212529', 
    lineHeight: 22 
  },
  tagsDisplay: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginBottom: 12 
  },
  tagChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#e7f5ff', 
    borderRadius: 20,
    paddingLeft: 14, 
    paddingRight: 6, 
    paddingVertical: 8, 
    borderWidth: 1.5, 
    borderColor: '#74c0fc' 
  },
  tagText: { 
    color: '#1971c2', 
    fontSize: 14, 
    fontWeight: '600', 
    marginRight: 6 
  },
  tagRemove: { 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    backgroundColor: '#1971c2', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  tagRemoveText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  tagInputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: '#dee2e6',
    borderRadius: 12, 
    backgroundColor: '#f8f9fa', 
    paddingHorizontal: 14, 
    paddingVertical: 4 
  },
  hashSymbol: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1971c2', 
    marginRight: 4 
  },
  tagInput: { 
    flex: 1, 
    fontSize: 15, 
    color: '#212529', 
    paddingVertical: 10 
  },
  addTagBtn: { 
    backgroundColor: '#1971c2', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8 
  },
  addTagText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 13 
  },
  metaSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    marginTop: 12,
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    gap: 8 
  },
  metaIcon: { 
    fontSize: 18 
  },
  metaText: { 
    fontSize: 13, 
    color: '#868e96' 
  },
  actionBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#fff',
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 24, 
    borderTopWidth: 1, 
    borderTopColor: '#e9ecef' 
  },
  saveBtn: { 
    backgroundColor: '#10b981', 
    borderRadius: 14, 
    paddingVertical: 16, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8 
  },
  saveBtnIcon: { 
    fontSize: 20, 
    color: '#fff' 
  },
  saveBtnText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: '700' 
  },
  deleteBtn: { 
    backgroundColor: '#ef4444', 
    borderRadius: 14, 
    paddingVertical: 16, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8 
  },
  deleteBtnIcon: { 
    fontSize: 20 
  },
  deleteBtnText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: '700' 
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellerPostManageScreen;