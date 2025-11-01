import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const NotificationsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.info}>No new notifications at the moment.</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 16, color: '#555', marginBottom: 20 },
  backButton: { padding: 12, backgroundColor: '#ccc', borderRadius: 8, width: '80%', alignItems: 'center' },
  backButtonText: { fontSize: 16 },
});

export default NotificationsScreen;