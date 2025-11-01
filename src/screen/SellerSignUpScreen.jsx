/*src/screen/SellerSignUpScreen.jsx*/

import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function SellerSignUpScreen({ navigation }) {
  const [firstName, setFirstName]         = useState('');
  const [lastName, setLastName]           = useState('');
  const [email, setEmail]                 = useState('');
  const [storeName, setStoreName]         = useState('');
  const [contactNo, setContactNo]         = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd]             = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading]             = useState(false);

  const handleSignUp = async () => {
    // 1) Basic validation
    if (!firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !storeName.trim() ||
        !contactNo.trim() ||
        !password ||
        !confirmPassword
    ) {
      return Alert.alert('Error', 'Please fill out all fields.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match.');
    }

    setLoading(true);
    try {
      // 2) Create the Firebase Auth user
      const { user } = await auth()
        .createUserWithEmailAndPassword(email.trim(), password);

      // 3) Send verification email
      await user.sendEmailVerification();

      // 4) Save seller profile in Firestore
      await firestore().collection('users').doc(user.uid).set({
        firstName:     firstName.trim(),
        lastName:      lastName.trim(),
        email:         email.trim(),
        storeName:     storeName.trim(),
        contactNo:     contactNo.trim(),
        role:          'seller',
        profileComplete: false,
        createdAt:     firestore.FieldValue.serverTimestamp()
      });

      // 5) Inform the user and go to Login
      Alert.alert(
        'Verify Your Email',
        'A verification link has been sent. Please verify before logging in.',
        [{ text: 'OK', onPress: () => navigation.replace('SellerLogin') }]
      );
    } catch (err) {
      console.error('Seller signup error:', err);
      Alert.alert('Sign Up Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render inputs with optional toggle icon
  const renderInput = (
    placeholder,
    value,
    setter,
    secure = false,
    toggleFn = null
  ) => (
    <View style={styles.inputWrapper} key={placeholder}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={value}
        onChangeText={setter}
        secureTextEntry={secure}
      />
      {toggleFn && (
        <TouchableOpacity onPress={toggleFn}>
          <Ionicons
            name={secure ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color="#999"
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#953DF5', '#7CD7F7']}
      style={styles.bg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <SafeAreaView style={styles.outer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Image
                source={require('../assets/SellerSignUp.png')}
                style={styles.logo}
              />
              <Text style={styles.title}>Seller Sign Up</Text>
              <Text style={styles.subtitle}>Create your seller account</Text>
            </View>

            <ScrollView
              contentContainerStyle={styles.bodyContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {renderInput('First Name', firstName, setFirstName)}
              {renderInput('Last Name', lastName, setLastName)}
              {renderInput('Email', email, setEmail)}
              {renderInput('Store Name', storeName, setStoreName)}
              {renderInput('Contact No', contactNo, setContactNo)}
              {renderInput(
                'Password',
                password,
                setPassword,
                !showPwd,
                () => setShowPwd(v => !v)
              )}
              {renderInput(
                'Confirm Password',
                confirmPassword,
                setConfirmPassword,
                !showConfirmPwd,
                () => setShowConfirmPwd(v => !v)
              )}

              <TouchableOpacity
                style={[styles.button, loading && styles.disabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.buttonText}>Create Account</Text>
                }
              </TouchableOpacity>

              <Text style={styles.footer}>
                Already have an account?
                <Text
                  style={styles.footerLink}
                  onPress={() => navigation.replace('SellerLogin')}
                >
                  {' '}Sign In
                </Text>
              </Text>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1
  },
  outer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24
  },
  flex: {
    flex: 1
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 4
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2
  },
  subtitle: {
    fontSize: 14,
    color: '#555'
  },
  bodyContent: {
    padding: 16
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333'
  },
  button: {
    backgroundColor: '#5A31F4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  disabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  footer: {
    marginTop: 12,
    fontSize: 13,
    color: '#444',
    textAlign: 'center'
  },
  footerLink: {
    color: '#5A31F4',
    fontWeight: '600'
  }
});