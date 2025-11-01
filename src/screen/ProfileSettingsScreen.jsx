// src/screen/ProfileSettingsScreen.jsx

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BODY_TYPES  = ['Slim', 'Normal', 'Fat', 'Veryfat'];
const BODY_IMAGES = {
  Slim:    require('../assets/Slim.png'),
  Normal:  require('../assets/Normal.png'),
  Fat:     require('../assets/Fat.png'),
  Veryfat: require('../assets/Veryfat.png'),
};
const SIZES  = ['S', 'M', 'L', 'XL'];
const STYLES = ['Formal', 'Casual', 'Pakistani', 'Modern'];

function skinColor(v) {
  const start = { r:62, g:40, b:23 }, end = { r:248, g:210, b:170 };
  const r = Math.round(start.r + (end.r - start.r) * v);
  const g = Math.round(start.g + (end.g - start.g) * v);
  const b = Math.round(start.b + (end.b - start.b) * v);
  return `rgb(${r},${g},${b})`;
}

export default function ProfileSettingsScreen({ navigation }) {
  const [bodyIndex, setBodyIndex]   = useState(1);
  const [size, setSize]             = useState('M');
  const [skinTone, setSkinTone]     = useState(0.5);
  const [stylePrefs, setStylePrefs] = useState([]);
  const [loading, setLoading]       = useState(false);

  useFocusEffect(useCallback(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(
        doc => {
          if (!doc.exists) return;
          const data = doc.data() || {};
          const idx = BODY_TYPES.indexOf(data.bodyType);
          setBodyIndex(idx >= 0 ? idx : 1);
          setSize(data.clothingSize || 'M');
          setSkinTone(
            typeof data.skinTone === 'number' ? data.skinTone : 0.5
          );
          setStylePrefs(
            Array.isArray(data.stylePrefs) ? data.stylePrefs : []
          );
        },
        err => console.error('ProfileSettings load error:', err)
      );

    return () => unsubscribe();
  }, []));

  const toggleStyle = st =>
    setStylePrefs(prev =>
      prev.includes(st) ? prev.filter(x => x !== st) : [...prev, st]
    );

  const handleSave = async () => {
    if (stylePrefs.length === 0) {
      Alert.alert('Validation', 'Select at least one style.');
      return;
    }
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    setLoading(true);
    try {
      await firestore()
        .collection('users')
        .doc(uid)
        .set({
          bodyType:     BODY_TYPES[bodyIndex],
          clothingSize: size,
          skinTone,
          stylePrefs
        }, { merge: true });

      Alert.alert('Success', 'Preferences updated.');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save preferences.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back-outline" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Body Type</Text>
          <Image
            source={BODY_IMAGES[BODY_TYPES[bodyIndex]]}
            style={styles.bodyImage}
            resizeMode="contain"
          />
          <View style={styles.bodyControl}>
            <TouchableOpacity
              disabled={bodyIndex === 0}
              onPress={() => setBodyIndex(i => Math.max(i - 1, 0))}
            >
              <Ionicons
                name="remove-circle-outline"
                size={32}
                color={bodyIndex === 0 ? '#ccc' : '#953DF5'}
              />
            </TouchableOpacity>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={BODY_TYPES.length - 1}
              step={1}
              value={bodyIndex}
              onValueChange={setBodyIndex}
              minimumTrackTintColor="#953DF5"
              maximumTrackTintColor="#ccc"
            />
            <TouchableOpacity
              disabled={bodyIndex === BODY_TYPES.length - 1}
              onPress={() =>
                setBodyIndex(i => Math.min(i + 1, BODY_TYPES.length - 1))
              }
            >
              <Ionicons
                name="add-circle-outline"
                size={32}
                color={
                  bodyIndex === BODY_TYPES.length - 1 ? '#ccc' : '#953DF5'
                }
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.currentLabel}>
            {BODY_TYPES[bodyIndex]}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clothing Size</Text>
          <View style={styles.row}>
            {SIZES.map(sz => (
              <TouchableOpacity
                key={sz}
                style={[
                  styles.sizeCircle,
                  size === sz && styles.sizeCircleSelected
                ]}
                onPress={() => setSize(sz)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    size === sz && styles.sizeTextSelected
                  ]}
                >
                  {sz}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Skin Tone</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={skinTone}
            onValueChange={setSkinTone}
            minimumTrackTintColor="#953DF5"
            maximumTrackTintColor="#ccc"
          />
          <View style={styles.previewWrap}>
            <View
              style={[
                styles.skinPreview,
                { backgroundColor: skinColor(skinTone) }
              ]}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Style Preferences</Text>
          <View style={styles.row}>
            {STYLES.map(st => (
              <TouchableOpacity
                key={st}
                style={[
                  styles.chip,
                  stylePrefs.includes(st) && styles.chipSelected
                ]}
                onPress={() => toggleStyle(st)}
              >
                <Text
                  style={[
                    styles.chipText,
                    stylePrefs.includes(st) && styles.chipTextSelected
                  ]}
                >
                  {st}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveText}>Save Changes</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#fff' },
  header:       {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#EEE'
  },
  backBtn:      { padding: 4 },
  headerTitle:  { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600' },

  content:      { padding: 16, paddingBottom: 40 },

  card:         {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20
  },
  cardTitle:    { fontSize: 16, fontWeight: '600', marginBottom: 12 },

  bodyImage:    { width: 120, height: 160, alignSelf: 'center', marginBottom: 12 },
  bodyControl:  {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  slider:       { flex: 1, marginHorizontal: 12, height: 40 },
  currentLabel: { textAlign: 'center', fontSize: 14, fontWeight: 'bold' },

  row:          { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  sizeCircle:   {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#EDEDED',
    margin: 6, justifyContent: 'center', alignItems: 'center'
  },
  sizeCircleSelected: { backgroundColor: '#953DF5' },
  sizeText:     { fontSize: 16, fontWeight: '600', color: '#333' },
  sizeTextSelected: { color: '#fff' },

  previewWrap:  { alignItems: 'center', marginVertical: 12 },
  skinPreview:  {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 1, borderColor: '#DDD'
  },

  chip:         {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#EDEDED',
    margin: 6
  },
  chipSelected: { backgroundColor: '#953DF5' },
  chipText:     { fontSize: 14, color: '#333' },
  chipTextSelected: { color: '#fff' },

  saveBtn:      {
    backgroundColor: '#953DF5',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center'
  },
  saveText:     { color: '#fff', fontSize: 16, fontWeight: '600' }
});