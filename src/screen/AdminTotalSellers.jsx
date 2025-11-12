import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function AdminTotalSellers() {
  const [totalSellers, setTotalSellers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const snapshot = await firestore().collection('sellers').get();
        setTotalSellers(snapshot.size); // snapshot.size gives total number of documents
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Total Sellers</Text>
        <Text style={styles.count}>{totalSellers}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // dark background for elegance
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  card: {
    width: '80%',
    backgroundColor: '#1e293b', // slightly lighter card
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10, // Android shadow
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  count: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#8b5cf6', // elegant purple color
  },
});