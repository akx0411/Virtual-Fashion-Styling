// src/screen/ProfileSetupScreen.jsx

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const BODY_TYPES = ['Slim', 'Normal', 'Fat', 'Veryfat'];
const BODY_IMAGES = {
  Slim:    require('../assets/Slim.png'),
  Normal:  require('../assets/Normal.png'),
  Fat:     require('../assets/Fat.png'),
  Veryfat: require('../assets/Veryfat.png'),
};
const SIZES  = ['S','M','L','XL'];
const STYLES = ['Formal','Casual','Pakistani','Modern'];

function skinColor(v) {
  const start = { r:62, g:40, b:23 };
  const end   = { r:248, g:210, b:170 };
  const r = Math.round(start.r + (end.r - start.r) * v);
  const g = Math.round(start.g + (end.g - start.g) * v);
  const b = Math.round(start.b + (end.b - start.b) * v);
  return `rgb(${r},${g},${b})`;
}

export default function ProfileSetupScreen({ navigation }) {
  const [bodyIndex, setBodyIndex]   = useState(1);
  const [size, setSize]             = useState('M');
  const [skinTone, setSkinTone]     = useState(0.5);
  const [stylePrefs, setStylePrefs] = useState([]);
  const [loading, setLoading]       = useState(false);

  const toggleStyle = st =>
    setStylePrefs(prev =>
      prev.includes(st) ? prev.filter(x => x !== st) : [...prev, st]
    );

  const submit = async () => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;

    if (stylePrefs.length === 0) {
      Alert.alert('Validation', 'Please select at least one style.');
      return;
    }

    setLoading(true);
    try {
      await firestore().collection('users').doc(uid).update({
        bodyType:       BODY_TYPES[bodyIndex],
        clothingSize:   size,
        skinTone,
        stylePrefs,
        profileComplete: true,
      });

      // Reset nav stack into your authenticated flow
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserMainScreen' }],
      });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save preferences.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 1) Body Type */}
        <View style={styles.card}>
          <Text style={styles.heading}>1. Body Type</Text>
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
                size={28}
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
              onPress={() => setBodyIndex(i => Math.min(i + 1, BODY_TYPES.length - 1))}
            >
              <Ionicons
                name="add-circle-outline"
                size={28}
                color={bodyIndex === BODY_TYPES.length - 1 ? '#ccc' : '#953DF5'}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.currentLabel}>
            {BODY_TYPES[bodyIndex]}
          </Text>
        </View>

        {/* 2) Clothing Size */}
        <View style={styles.card}>
          <Text style={styles.heading}>2. Clothing Size</Text>
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
                <Text style={[
                  styles.sizeText,
                  size === sz && styles.sizeTextSelected
                ]}>
                  {sz}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3) Skin Tone */}
        <View style={styles.card}>
          <Text style={styles.heading}>3. Skin Tone</Text>
          <Slider
            style={styles.fullSlider}
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
                { backgroundColor: skinColor(skinTone) },
              ]}
            />
          </View>
          <Text style={styles.skinText}>
            {(skinTone * 100).toFixed(0)}%
          </Text>
        </View>

        {/* 4) Style Preferences */}
        <View style={styles.card}>
          <Text style={styles.heading}>4. Style Preferences</Text>
          <View style={styles.row}>
            {STYLES.map(st => (
              <TouchableOpacity
                key={st}
                style={[
                  styles.chip,
                  stylePrefs.includes(st) && styles.chipSelected,
                ]}
                onPress={() => toggleStyle(st)}
              >
                <Text style={[
                  styles.chipText,
                  stylePrefs.includes(st) && styles.chipTextSelected,
                ]}>
                  {st}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Finish & Save */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={submit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveText}>Finish & Save</Text>
          }
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 40 },

  card:          {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  heading:       {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },

  bodyImage:     {
    width: 140,
    height: undefined,
    aspectRatio: 140 / 180,
    alignSelf: 'center',
    marginBottom: 12,
  },
  bodyControl:   {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slider:        { flex: 1, marginHorizontal: 8, height: 40 },
  currentLabel:  {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  row:           {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sizeCircle:    {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#EDEDED',
    margin: 6, justifyContent: 'center',
    alignItems: 'center',
  },
  sizeCircleSelected: { backgroundColor: '#953DF5' },
  sizeText:      { fontSize: 16, fontWeight: '600', color: '#333' },
  sizeTextSelected: { color: '#fff' },

  fullSlider:    { width: '100%', height: 40, marginBottom: 12 },
  previewWrap:   { alignItems: 'center', marginVertical: 12 },
  skinPreview:   {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 1, borderColor: '#DDD',
  },
  skinText:      { textAlign: 'center', marginTop: 6, color: '#555' },

  chip:          {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#EDEDED',
    margin: 6,
  },
  chipSelected:  { backgroundColor: '#953DF5' },
  chipText:      { fontSize: 14, color: '#333' },
  chipTextSelected: { color: '#fff' },

  saveBtn:       {
    backgroundColor: '#953DF5',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveText:      {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});