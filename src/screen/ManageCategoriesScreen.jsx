import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ManageCategoriesScreen = ({ navigation }) => {
  const [customCats, setCustomCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentCat, setCurrentCat] = useState('');
  const [newCatName, setNewCatName] = useState('');

  const uid = auth().currentUser.uid;
  const userRef = firestore().collection('users').doc(uid);

  useEffect(() => {
    const unsub = userRef.onSnapshot(doc => {
      setCustomCats(doc.data()?.customCategories || []);
      setLoading(false);
    });
    return unsub;
  }, []);

  const deleteCat = (cat) =>
    Alert.alert(
      'Delete Category',
      `Remove "${cat}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await userRef.update({
              customCategories: firestore.FieldValue.arrayRemove(cat),
            });
          },
        },
      ]
    );

  const openEdit = (cat) => {
    setCurrentCat(cat);
    setNewCatName(cat);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return Alert.alert('Name required');
    await userRef.update({
      customCategories: firestore.FieldValue.arrayRemove(currentCat),
    });
    await userRef.update({
      customCategories: firestore.FieldValue.arrayUnion(trimmed),
    });
    setEditModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.catText}>{item}</Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => openEdit(item)}>
          <Ionicons name="pencil-outline" size={20} color="#5A31F4" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteCat(item)} style={{marginLeft:12}}>
          <Ionicons name="trash-outline" size={20} color="#E94335" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Categories</Text>
      </View>

      {customCats.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No custom categories yet.</Text>
        </View>
      ) : (
        <FlatList
          data={customCats}
          keyExtractor={(i) => i}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setEditModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Category</Text>
            <TextInput
              style={styles.input}
              value={newCatName}
              onChangeText={setNewCatName}
            />
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.saveBtn]}
                onPress={saveEdit}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageCategoriesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: '600', marginLeft: 16, color: '#333' },
  list: { paddingHorizontal: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  catText: { fontSize: 16, color: '#333' },
  icons: { flexDirection: 'row' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },

  backdrop: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 24,
    borderRadius: 16,
    elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  btnRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  cancelBtn: { backgroundColor: '#eee', marginRight: 12 },
  saveBtn: { backgroundColor: '#5A31F4' },
  cancelText: { color: '#555', fontSize: 15 },
  saveText: { color: '#fff', fontSize: 15 },
});