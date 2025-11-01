// App.jsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import './src/firebaseConfig';

// Unauthenticated
import SplashScreen from './src/screen/SplashScreen';
import UserSelectionScreen from './src/screen/UserSelectionScreen';
import UserLogRegScreen from './src/screen/UserLogRegScreen';
import LoginScreen from './src/screen/LoginScreen';
import SignUpScreen from './src/screen/SignUpScreen';
import ForgotPasswordScreen from './src/screen/ForgotPasswordScreen';

// Seller unauthenticated
import SellerHomeScreen from './src/screen/SellerHomeScreen';
import SellerLoginScreen from './src/screen/SellerLoginScreen';
import SellerSignUpScreen from './src/screen/SellerSignUpScreen';

// First‐time setup
import ProfileSetupScreen from './src/screen/ProfileSetupScreen';
import SellerStoreSetupScreen from './src/screen/SellerStoreSetupScreen';
// add with other screen imports

// Authenticated user
import UserMainScreen from './src/screen/UserMainScreen';
import UserWardrobeScreen from './src/screen/UserWardrobeScreen';
import StoresScreen from './src/screen/StoresScreen';
import CreateCategoryScreen from './src/screen/CreateCategoryScreen';
import ManageCategoriesScreen from './src/screen/ManageCategoriesScreen';
import SettingsScreen from './src/screen/SettingsScreen';
import ProfileSettingsScreen from './src/screen/ProfileSettingsScreen';
import NotificationsScreen from './src/screen/NotificationsScreen';

// Authenticated seller
import SellerDashboardScreen from './src/screen/SellerDashboardScreen';
import SellerProfileScreen from './src/screen/SellerProfileScreen';
import SellerEditProfileScreen from './src/screen/SellerEditProfileScreen';
import SellerCreatePostScreen from './src/screen/SellerCreatePostScreen';
import SellerCreatePostDetailScreen from './src/screen/SellerCreatePostDetailScreen';
import SellerPostManageScreen from './src/screen/SellerPostManageScreen';
import SellerPostDetailScreen from './src/screen/SellerPostDetailScreen';
import ChatListScreen from './src/screen/ChatListScreen';





// Admin flow
import AdminLoginScreen from './src/screen/AdminLoginScreen';
import AdminDashboardScreen from './src/screen/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

function FallbackScreen() {
  return (
    <View style={styles.loader}>
      <Text style={{ fontSize: 16, color: '#333', textAlign: 'center' }}>
        No route matched. Restart the app or check your login flow.
      </Text>
    </View>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [role, setRole] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Firebase Auth listener
  useEffect(() => {
    const unsub = auth().onAuthStateChanged(u => {
      setUser(u);
      setAuthInitialized(true);
    });
    return unsub;
  }, []);

  // Firestore user profile listener
  useEffect(() => {
    setProfileLoading(true);

    if (!user) {
      setRole(null);
      setProfileComplete(false);
      setProfileLoading(false);
      return;
    }

    const unsub = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(
        doc => {
          if (!doc.exists) {
            auth().signOut();
            setProfileLoading(false);
            return;
          }

          const data = doc.data() || {};
          const userRole = data.role || 'user';
          const isComplete =
            userRole === 'admin' ? true : !!data.profileComplete;

          setRole(userRole);
          setProfileComplete(isComplete);
          setProfileLoading(false);
        },
        error => {
          console.error('Profile listener error:', error);
          setRole(null);
          setProfileComplete(false);
          setProfileLoading(false);
        }
      );

    return () => unsub();
  }, [user]);

  if (!authInitialized || (user && profileLoading)) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#953DF5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Splash */}
        {!splashDone && (
          <Stack.Screen name="Splash">
            {() => <SplashScreen onFinish={() => setSplashDone(true)} />}
          </Stack.Screen>
        )}

        {/* Unauthenticated */}
        {splashDone && !user && (
          <>
            <Stack.Screen name="UserSelection" component={UserSelectionScreen} />
            <Stack.Screen name="UserLogReg" component={UserLogRegScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="SellerHome" component={SellerHomeScreen} />
            <Stack.Screen name="SellerLogin" component={SellerLoginScreen} />
            <Stack.Screen name="SellerSignUp" component={SellerSignUpScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          </>
        )}

        {/* First-time setup */}
        {splashDone && user && !profileComplete && role === 'user' && (
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        )}
        {splashDone && user && !profileComplete && role === 'seller' && (
          <Stack.Screen name="SellerStoreSetup" component={SellerStoreSetupScreen} />
        )}

        {/* Authenticated User */}
        {splashDone && user && profileComplete && role === 'user' && (
          <>
            <Stack.Screen name="UserMainScreen" component={UserMainScreen} />
            <Stack.Screen name="UserWardrobe" component={UserWardrobeScreen} />
            <Stack.Screen name="Stores" component={StoresScreen} />
            <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
            <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        )}

        {/* Authenticated Seller */}
        {splashDone && user && profileComplete && role === 'seller' && (
          <>
 <Stack.Screen name="SellerDashboard" component={SellerDashboardScreen} />
<Stack.Screen name="SellerStoreSetup" component={SellerStoreSetupScreen} />
<Stack.Screen name="Notifications" component={NotificationsScreen} />
<Stack.Screen name="SellerProfileScreen" component={SellerProfileScreen} />
<Stack.Screen name="SellerEditProfileScreen" component={SellerEditProfileScreen} />
<Stack.Screen name="SellerCreatePostScreen" component={SellerCreatePostScreen} />
<Stack.Screen name="SellerCreatePostDetailScreen" component={SellerCreatePostDetailScreen} />
<Stack.Screen name="SellerPostManageScreen" component={SellerPostManageScreen} />
<Stack.Screen name="SellerPostDetailScreen" component={SellerPostDetailScreen} />
<Stack.Screen name="ChatListScreen" component={ChatListScreen} />






          </>
        )}

        {/* Authenticated Admin */}
        {splashDone && user && profileComplete && role === 'admin' && (
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />

        )}

        {/* Fallback */}
        <Stack.Screen name="Fallback" component={FallbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
