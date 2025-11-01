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
import Ionicons from 'react-native-vector-icons/Ionicons';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setShowEmailError(true);
      return;
    }
    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email.trim());
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email.',
        [{ text: 'OK', onPress: () => navigation.replace('Login') }]
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#953DF5','#7CD7F7']}
      style={styles.container}
      start={{ x:0, y:0 }} end={{ x:1, y:0 }}
    >
      <View style={styles.card}>
        <Image
          source={require('../assets/forgetlock.png')}
          style={styles.lockIcon}
        />
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.instructions}>
          Enter your email to receive password reset instructions.
        </Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={text => {
              setEmail(text);
              setShowEmailError(false);
            }}
          />
        </View>
        {showEmailError && (
          <Text style={styles.errorText}>Email is required.</Text>
        )}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace('Login')}
          style={styles.backLinkContainer}
        >
          <Text style={styles.backLinkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width:0, height:6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  lockIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
  },
  errorText: {
    alignSelf: 'flex-start',
    color: '#E94335',
    marginBottom: 8,
    marginLeft: 6,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#5A31F4',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  backLinkContainer: {
    marginTop: 16,
  },
  backLinkText: {
    color: '#5A31F4',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});