
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert, ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function SellerLoginScreen({ navigation }) {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter both email and password.');
    }

    setLoading(true);
    try {
      // 1) Sign in
      const { user } = await auth()
        .signInWithEmailAndPassword(email.trim(), password);

      // 2) Confirm seller role
      const doc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      const data = doc.data() || {};

      if (data.role !== 'seller') {
        Alert.alert('Access Denied', 'This is not a seller account.');
        await auth().signOut();
        return;
      }

      // ✅ Let App.jsx handle routing
    } catch (e) {
      console.error('Seller login error:', e);
      Alert.alert('Login Failed', e.message);
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
          source={require('../assets/SellerLogin.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Seller Login</Text>
        <Text style={styles.subtitle}>Manage Your Store</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Log In</Text>
          }
        </TouchableOpacity>

        <Text style={styles.footer}>
          Don’t have a seller account?
          <Text
            style={styles.footerLink}
            onPress={() => navigation.navigate('SellerSignUp')}
          >
            {' '}Sign Up
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24
  },
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
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20
  },
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
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333'
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10
  },
  forgotText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#5A31F4',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center'
  },
  disabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  footer: {
    marginTop: 12,
    fontSize: 14,
    color: '#444'
  },
  footerLink: {
    color: '#007BFF',
    fontWeight: '600'
  }
});