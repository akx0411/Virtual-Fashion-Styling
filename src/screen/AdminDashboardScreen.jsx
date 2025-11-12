// src/screen/AdminDashboardScreen.jsx

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Layout constants
const CIRCLE_SIZE    = 280;
const BUTTON_SIZE    = 64;
const LABEL_HEIGHT   = 22;
const WRAPPER_HEIGHT = BUTTON_SIZE + LABEL_HEIGHT;
const RADIUS         = 110;
const CENTER         = CIRCLE_SIZE / 2;

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const [dpUri, setDpUri]                           = useState('https://i.pravatar.cc/100?img=47');
  const [adminName, setAdminName]                   = useState('Admin');
  const [notificationsCount, setNotificationsCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const uid = auth().currentUser?.uid;
      if (!uid) return;
      return firestore()
        .collection('users')
        .doc(uid)
        .onSnapshot((doc) => {
          const d = doc.data() || {};
          const name = `${d.firstName || ''} ${d.lastName || ''}`.trim();
          setAdminName(name || 'Admin');
          if (d.profilePicture) setDpUri(d.profilePicture);
        });
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const uid = auth().currentUser?.uid;
      if (!uid) return;
      return firestore()
        .collection('users')
        .doc(uid)
        .collection('notifications')
        .where('read', '==', false)
        .onSnapshot((s) => setNotificationsCount(s.size));
    }, [])
  );

  const menuItems = [
    { label: 'Total Sellers',      icon: 'people-outline',         screen: 'AdminTotalSellers'    },
    { label: 'Verify Posts',       icon: 'checkmark-done-outline', screen: 'AdminVerifyPost'     },
    { label: 'Terms & Conditions', icon: 'document-text-outline',  screen: 'AdminTermConditions'},
    { label: 'Manage Accounts',    icon: 'settings-outline',       screen: 'AdminManageAccounts'   },
    { label: 'Analytics',          icon: 'analytics-outline',      screen: 'AdminAnalytics'       },
    { label: 'Announcements',      icon: 'notifications-outline',  screen: 'AdminAnnouncements'   },
  ];

  return (
    <ImageBackground
      source={require('../assets/admindashbg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={styles.safeHeader}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image source={{ uri: dpUri }} style={styles.avatar} />
              <View style={styles.greeting}>
                <Text style={styles.welcome}>Welcome back,</Text>
                <Text style={styles.name}>{adminName}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => navigation.navigate('Notifications')}
              style={styles.bellBtn}
            >
              <Ionicons name="notifications" size={28} color="#FFD700" />
              {notificationsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationsCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Admin Dashboard Heading */}
        <Text style={styles.dashboardHeading}>Admin Dashboard</Text>
      </SafeAreaView>

      {/* Circular Menu */}
      <View style={styles.dialWrapper}>
        <View style={styles.dashedCircle} />

        {menuItems.map((item, i) => {
          const angle = -90 + (360 / menuItems.length) * i;
          const rad   = (angle * Math.PI) / 180;
          const x     = CENTER + RADIUS * Math.cos(rad);
          const y     = CENTER + RADIUS * Math.sin(rad);
          const left  = x - BUTTON_SIZE / 2;
          const top   = y - BUTTON_SIZE / 2;

          return (
            <View
              key={item.label}
              style={[
                styles.btnWrap,
                { width: BUTTON_SIZE, height: WRAPPER_HEIGHT, top, left },
              ]}
            >
              <Pressable
                onPress={() => navigation.navigate(item.screen)}
                style={({ pressed }) => [
                  styles.circleBtn,
                  pressed && styles.circleBtnPressed,
                ]}
              >
                <Ionicons name={item.icon} size={26} color="#3A3D98" />
              </Pressable>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      {/* Logout Button */}
      <View style={styles.logoutWrapper}>
        <Pressable
          onPress={() => {
            auth().signOut();
            navigation.replace('UserSelection'); // adjust to your auth entry screen
          }}
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && styles.logoutBtnPressed,
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color="#3A3D98" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dashboardHeading: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#fff',
  },
  greeting: { marginLeft: 14 },
  welcome: { color: '#000', fontSize: 15, opacity: 0.9 },
  name: { color: '#000', fontSize: 20, fontWeight: 'bold' },
  bellBtn: { padding: 8, position: 'relative' },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5252',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  dialWrapper: {
    position: 'absolute',
    top: '52%',
    left: '50%',
    transform: [
      { translateX: -CIRCLE_SIZE / 2 },
      { translateY: -CIRCLE_SIZE / 2 },
    ],
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 4,
    borderStyle: 'dashed',
    borderColor: '#fff',
  },
  btnWrap: { position: 'absolute', alignItems: 'center' },
  circleBtn: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    elevation: 4,
  },
  circleBtnPressed: { transform: [{ scale: 0.94 }], opacity: 0.85 },
  label: {
    marginTop: 4,
    height: 60,
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    width: 100,
  },

  // Logout styles
  logoutWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutBtnPressed: {
    opacity: 0.7,
  },
  logoutText: {
    color: '#3A3D98',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});