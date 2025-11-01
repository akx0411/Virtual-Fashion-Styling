import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient
          colors={['#953DF5', '#7CD7F7']}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >

      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* Buttons for User Options */}
     <TouchableOpacity style={styles.button} onPress={() => navigation.replace('SignUp')}>
       <Text style={styles.buttonText}>Get Started</Text>
     </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  button: {
    width: '70%',
    paddingVertical: 12,
    backgroundColor: '#000',
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;