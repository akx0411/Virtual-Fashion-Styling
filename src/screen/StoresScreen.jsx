import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const brands = ['Khaadi', 'Outfitters', 'Gul Ahmed', 'Levi’s', 'Nike'];

const StoresScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Clothing Brands</Text>

      <View style={styles.brandsContainer}>
        {brands.map((brand, index) => (
          <View key={index} style={styles.brandCircle}>
            <Text style={styles.brandText}>{brand}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default StoresScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  brandsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  brandCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});