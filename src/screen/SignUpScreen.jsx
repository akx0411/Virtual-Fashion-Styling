// src/screen/SignUpScreen.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [loading, setLoading]         = useState(false);
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirm) {
      return Alert.alert('Incomplete', 'Please fill out all fields.');
    }
    if (password !== confirm) {
      return Alert.alert('Error', 'Passwords do not match.');
    }

    setLoading(true);
    try {
      // 1) Create Auth user
      const { user } = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password
      );

      // 2) Create Firestore doc with profileComplete: false
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          firstName:       firstName.trim(),
          lastName:        lastName.trim(),
          email:           email.trim(),
          role:            'user',
          createdAt:       firestore.FieldValue.serverTimestamp(),
          profileComplete: false
        });

      // 3) Kick off the profile‐setup flow
      navigation.replace('ProfileSetup');
    } catch (err) {
      console.error(err);
      Alert.alert('Signup Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    placeholder,
    value,
    setValue,
    secure = false,
    toggleSecure
  ) => (
    <View style={styles.inputWrapper}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secure}
      />
      {toggleSecure && (
        <TouchableOpacity onPress={toggleSecure}>
          <Ionicons
            name={secure ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#953DF5', '#7CD7F7']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.card}>
        <Image
          source={require('../assets/SignUpLogo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Create Account</Text>

        {renderInput('First Name', firstName, setFirstName)}
        {renderInput('Last Name', lastName, setLastName)}
        {renderInput('Email', email, setEmail)}
        {renderInput(
          'Password',
          password,
          setPassword,
          !showPwd,
          () => setShowPwd(v => !v)
        )}
        {renderInput(
          'Confirm Password',
          confirm,
          setConfirm,
          !showConfirm,
          () => setShowConfirm(v => !v)
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          Already have an account?
          <Text
            style={styles.footerLink}
            onPress={() => navigation.navigate('Login')}
          >
            {' '}
            Log in
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 12,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 12
  },
  input: { flex: 1, fontSize: 15, color: '#333', paddingVertical: 6 },
  button: {
    backgroundColor: '#5A31F4',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  footer: { marginTop: 12, fontSize: 14, color: '#444' },
  footerLink: { color: '#5A31F4', fontWeight: '600' }
});