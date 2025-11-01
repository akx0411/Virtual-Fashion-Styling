import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

const defaultCategories = ['Casual', 'Party', 'Formal', 'Semi-Formal'];

const UserWardrobeScreen = ({ route }) => {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [selectedFullImage, setSelectedFullImage] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeItem, setActiveItem] = useState(null);

  const categoryFilter = route?.params?.filter || '';

  useFocusEffect(
    useCallback(() => {
      const fetchWardrobe = async () => {
        const uid = auth().currentUser?.uid;
        if (!uid) return;

        try {
          const snap = await firestore().collection('users').doc(uid).get();
          const data = snap.data() || {};
          let items = data.wardrobe || [];

          if (categoryFilter) {
            items = items.filter(i => i.category === categoryFilter);
          }
          setWardrobeItems(items);
        } catch (err) {
          console.error('Error loading wardrobe:', err);
        }
      };

      fetchWardrobe();
    }, [categoryFilter])
  );

  const openPicker = type => {
    const fn = type === 'camera' ? launchCamera : launchImageLibrary;
    fn({ mediaType: 'photo', quality: 0.9 }, res => {
      const uri = res.assets?.[0]?.uri;
      if (uri) {
        setSelectedImageUri(uri);
        setCustomTag('');
        setSelectedCategory('');
        setTagModalVisible(true);
      }
    });
    setPickerModalVisible(false);
  };

  const saveNewItem = async () => {
    if (!customTag.trim()) {
      return Alert.alert('Please describe the outfit.');
    }
    if (!selectedCategory) {
      return Alert.alert('Please pick a category.');
    }

    setTagModalVisible(false);

    try {
      const url = await uploadImageToCloudinary(
        selectedImageUri,
        'user_outfits'
      );
      const id = `${customTag}||${selectedCategory}___${Date.now()}`;
      const newItem = {
        id,
        uri: url,
        customTag,
        category: selectedCategory,
        timestamp: Date.now(),
      };

      const updated = [...wardrobeItems, newItem];
      setWardrobeItems(updated);

      await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .set(
          { wardrobe: firestore.FieldValue.arrayUnion(newItem) },
          { merge: true }
        );
    } catch (err) {
      console.error('Upload failed:', err);
      Alert.alert('Upload failed. Try again.');
    }
  };

  const deleteItem = async id => {
    const updated = wardrobeItems.filter(i => i.id !== id);
    setWardrobeItems(updated);

    try {
      await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({ wardrobe: updated });
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const saveEdit = async () => {
    if (!customTag.trim()) {
      return Alert.alert('Please enter a tag.');
    }
    if (!selectedCategory) {
      return Alert.alert('Please select a category.');
    }

    const edited = { ...activeItem, customTag, category: selectedCategory };
    const updated = wardrobeItems.map(i =>
      i.id === activeItem.id ? edited : i
    );
    setWardrobeItems(updated);
    setOptionsModalVisible(false);

    try {
      await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({ wardrobe: updated });
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => setSelectedFullImage(item.uri)}
      >
        <Image source={{ uri: item.uri }} style={styles.image} />
        <Text style={styles.cardText}>{item.customTag}</Text>
        <Text style={styles.cardSub}>{item.category}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuBtn}
        onPress={() => {
          setActiveItem(item);
          setCustomTag(item.customTag);
          setSelectedCategory(item.category);
          setOptionsModalVisible(true);
        }}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Wardrobe</Text>
      {categoryFilter ? (
        <Text style={styles.filterTag}>Filter: {categoryFilter}</Text>
      ) : null}

      <FlatList
        data={wardrobeItems}
        keyExtractor={i => i.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="shirt-outline"
              size={60}
              color="#bbb"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>No outfits yet.</Text>
            <Text style={styles.emptyHint}>
              Tap the “＋” to start adding clothes!
            </Text>
          </View>
        }
        renderItem={renderItem}
      />

      {/* Add Outfit FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setPickerModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Fullscreen Image Modal */}
      <Modal visible={!!selectedFullImage} transparent animationType="fade">
        <TouchableOpacity
          style={styles.imageModalBackdrop}
          onPress={() => setSelectedFullImage('')}
        >
          <Image
            source={{ uri: selectedFullImage }}
            style={styles.fullImage}
          />
        </TouchableOpacity>
      </Modal>

      {/* Photo Picker Modal */}
      <Modal visible={pickerModalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.pickerBackdrop}
          onPress={() => setPickerModalVisible(false)}
        >
          <View style={styles.pickerSheet}>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => openPicker('camera')}
            >
              <Ionicons name="camera-outline" size={20} color="#5A31F4" />
              <Text style={styles.optionText}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => openPicker('gallery')}
            >
              <Ionicons name="image-outline" size={20} color="#5A31F4" />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Tag & Category Modal */}
      <Modal visible={tagModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setTagModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Describe this outfit</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. black crop top"
              value={customTag}
              onChangeText={setCustomTag}
            />
            <Text style={styles.modalSubtitle}>Select Category</Text>
            <View style={styles.categoryRow}>
              {defaultCategories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catPill,
                    selectedCategory === cat && styles.catPillSelected,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      selectedCategory === cat && { color: '#fff' },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={saveNewItem}>
              <Text style={styles.saveBtnText}>Save Outfit</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit / Delete Modal */}
      <Modal visible={optionsModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setOptionsModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Outfit</Text>
            <TextInput
              style={styles.input}
              placeholder="Outfit description"
              value={customTag}
              onChangeText={setCustomTag}
            />
            <Text style={styles.modalSubtitle}>Select Category</Text>
            <View style={styles.categoryRow}>
              {defaultCategories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catPill,
                    selectedCategory === cat && styles.catPillSelected,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      selectedCategory === cat && { color: '#fff' },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, styles.deleteBtnMain]}
              onPress={() => {
                deleteItem(activeItem.id);
                setOptionsModalVisible(false);
              }}
            >
              <Text style={styles.saveBtnText}>Delete Outfit</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default UserWardrobeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  headerTitle: { fontSize: 22, fontWeight: '700', margin: 20, color: '#333' },
  filterTag: {
    fontSize: 14,
    color: '#5A31F4',
    marginHorizontal: 20,
    marginBottom: 8,
    fontWeight: '500',
  },
  grid: { paddingHorizontal: 12, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: 6,
    flex: 0.48,
    padding: 10,
    elevation: 3,
    position: 'relative',
  },
  image: { width: '100%', height: 140, borderRadius: 10, marginBottom: 8 },
  cardText: { fontSize: 13, fontWeight: '600', color: '#333' },
  cardSub: { fontSize: 12, color: '#777', marginBottom: 4 },
  menuBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 32,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    elevation: 1,
  },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyIcon: { marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#555', marginBottom: 4 },
  emptyHint: { fontSize: 13, color: '#777', textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#5A31F4',
    width: 58,
    height: 58,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  imageModalBackdrop: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 12,
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 20,
  },
  optionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  optionText: { fontSize: 15, color: '#333', marginLeft: 10 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    elevation: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  modalSubtitle: { fontSize: 14, fontWeight: '500', color: '#555', marginBottom: 8 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  catPillSelected: { backgroundColor: '#5A31F4' },
  catPillText: { fontSize: 13, fontWeight: '500', color: '#333' },
  saveBtn: {
    backgroundColor: '#5A31F4',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 0,
  },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  deleteBtnMain: { backgroundColor: '#E94335', marginTop: 10 },
});