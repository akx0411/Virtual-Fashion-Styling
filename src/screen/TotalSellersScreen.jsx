// src/screen/TotalSellersScreen.jsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function TotalSellersScreen() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = firestore()
      .collection('users')
      .where('role', '==', 'seller')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSellers(list);
        setLoading(false);
      });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#953DF5" />
      </View>
    );
  }

  return (
    <FlatList
      data={sellers}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>No sellers found.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2
  },
  name: { fontSize: 16, fontWeight: '600' },
  email: { fontSize: 14, color: '#666', marginTop: 4 }
});