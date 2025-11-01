import React, { useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SellerHomeScreen = ({ navigation }) => {
  useEffect(() => {
    const checkSellerProfile = async () => {
      const user = auth().currentUser;
      if (!user) return;

      try {
        const snap = await firestore().collection('users').doc(user.uid).get();
        const data = snap.data();
        if (data?.profileComplete) {
          navigation.replace('SellerDashboard'); //  redirect to main seller screen
        }
      } catch (err) {
        console.error('Seller profile check failed:', err);
      }
    };

    checkSellerProfile();
  }, );

  return (
    <LinearGradient
      colors={['#953DF5', '#7CD7F7']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={styles.sellerTitle}>Welcome Sellers</Text>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SellerSignUp')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SellerLogin')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sellerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 12,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});

export default SellerHomeScreen;