// src/screen/LoginScreen.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';

export default function LoginScreen({ navigation }) {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      // 1) Sign in with Firebase Auth
      await auth().signInWithEmailAndPassword(email.trim(), password);

      // 2) Do not manually navigate here.
      //    App.jsx will automatically route based on auth & profileComplete.
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#953DF5', '#7CD7F7']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.card}>
        <Image
          source={require('../assets/Login.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Log In</Text>
        <Text style={styles.subtitle}>Welcome back 👋</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(v => !v)}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotContainer}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.keepRow}>
          <CheckBox
            value={keepLoggedIn}
            onValueChange={setKeepLoggedIn}
            tintColors={{ true: '#5A31F4', false: '#ccc' }}
          />
          <Text style={styles.keepText}>Keep me logged in</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          Don’t have an account?
          <Text
            style={styles.footerLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            {' '}Create Account
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  card:         {
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
  logo:         {
    width: 70,
    height: 70,
    marginBottom: 12,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  title:        { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle:     { fontSize: 16, color: '#555', marginBottom: 20 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 12,
  },
  input:        { flex: 1, fontSize: 15, color: '#333', paddingVertical: 6 },
  forgotContainer: { alignSelf: 'flex-end', marginBottom: 10 },
  forgotText:      { color: '#007BFF', fontWeight: '600', fontSize: 13 },
  keepRow:         { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 16 },
  keepText:        { marginLeft: 8, fontSize: 14, color: '#555', fontWeight: '500' },
  button:          { backgroundColor: '#5A31F4', paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 4 },
  buttonText:      { color: '#fff', fontWeight: '600', fontSize: 16 },
  footer:          { marginTop: 12, fontSize: 14, color: '#444' },
  footerLink:      { color: '#007BFF', fontWeight: '600' },
});