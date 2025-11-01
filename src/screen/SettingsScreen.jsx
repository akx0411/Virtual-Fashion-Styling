// src/screen/SettingsScreen.jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const user       = auth().currentUser;
  const uid        = user?.uid;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [passModalVisible,   setPassModalVisible]      = useState(false);
  const [currentPassword,    setCurrentPassword]       = useState('');
  const [newPassword,        setNewPassword]           = useState('');
  const [loading,            setLoading]               = useState(false);

  // Load notification preference once
  useEffect(() => {
    if (!uid) return;
    firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(doc => {
        const data = doc.data() || {};
        setNotificationsEnabled(
          data.notificationsEnabled == null
            ? true
            : data.notificationsEnabled
        );
      })
      .catch(console.error);
  }, [uid]);

  // Toggle notifications (merge so doc always exists)
  const toggleNotifications = val => {
    setNotificationsEnabled(val);
    if (!uid) return;
    firestore()
      .collection('users')
      .doc(uid)
      .set({ notificationsEnabled: val }, { merge: true });
  };

  // Change password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      return Alert.alert('Error', 'Enter both current and new password.');
    }
    setLoading(true);
    try {
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPassword);
      Alert.alert('Success', 'Password changed.');
      setCurrentPassword('');
      setNewPassword('');
      setPassModalVisible(false);
    } catch (e) {
      console.error('Password change error:', e);
      const msg = e?.code === 'auth/wrong-password'
        ? 'Wrong current password.'
        : e?.message || 'Could not change password.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = () => {
    if (!currentPassword) {
      return Alert.alert('Error', 'Enter your current password to delete.');
    }
    Alert.alert(
      'Confirm Delete',
      'This will permanently delete your account and data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const credential = auth.EmailAuthProvider.credential(
                user.email,
                currentPassword
              );
              await user.reauthenticateWithCredential(credential);

              // delete Firestore doc, ignore errors
              await firestore().collection('users').doc(uid).delete().catch(() => {});

              // delete auth user
              await user.delete();

              // sign out; App.jsx will redirect to the unauthenticated flow
              await auth().signOut();
            } catch (e) {
              console.error('Account delete error:', e);
              const msg = e?.code === 'auth/wrong-password'
                ? 'Wrong password.'
                : e?.message || 'Could not delete account.';
              Alert.alert('Error', msg);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await auth().signOut();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Text style={styles.heading}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('ProfileSettings')}
        >
          <Ionicons name="person-outline" size={20} color="#5A31F4" />
          <Text style={styles.rowText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => setPassModalVisible(true)}
        >
          <Ionicons name="key-outline" size={20} color="#5A31F4" />
          <Text style={styles.rowText}>Change / Delete Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.row}>
          <Ionicons name="notifications-outline" size={20} color="#5A31F4" />
          <Text style={styles.rowText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        disabled={loading}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Password Modal */}
      <Modal
        visible={passModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPassModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enter Current Password</Text>
            <TextInput
              secureTextEntry
              placeholder="Current Password"
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              secureTextEntry
              placeholder="New Password (optional)"
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.modalBtnText}>Save Password</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.deleteBtn]}
              onPress={handleDeleteAccount}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.modalBtnText}>Delete Account</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.cancelBtn]}
              onPress={() => setPassModalVisible(false)}
            >
              <Text style={[styles.modalBtnText, { color: '#333' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  heading:        { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 30 },
  section:        { marginBottom: 24 },
  sectionTitle:   { fontSize: 14, fontWeight: '600', color: '#999', marginBottom: 10 },

  row:            {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  rowText:        { fontSize: 15, color: '#333', flex: 1, marginLeft: 12 },

  logoutBtn:      {
    flexDirection: 'row',
    backgroundColor: '#5A31F4',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  logoutText:     { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },

  modalOverlay:   {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCard:      {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    elevation: 12
  },
  modalTitle:     { fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#333' },
  input:          {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14
  },
  modalBtn:       {
    backgroundColor: '#5A31F4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12
  },
  deleteBtn:      { backgroundColor: '#E94335' },
  modalBtnText:   { color: '#fff', fontSize: 15, fontWeight: '600' },
  cancelBtn:      { backgroundColor: '#eee' }
});