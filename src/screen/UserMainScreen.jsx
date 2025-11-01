import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
  ScrollView, SafeAreaView, StatusBar, Modal,
  TouchableWithoutFeedback, Platform
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

const defaultCategories = ['Casual','Party','Formal','Semi-Formal'];

const UserMainScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('User');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);

  // fetch user profile
  useFocusEffect(useCallback(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;
    firestore().collection('users').doc(uid).get()
      .then(snap => {
        const d = snap.data() || {};
        setUserName(
          `${d.firstName||''} ${d.lastName||''}`.trim() || 'User'
        );
        setProfileImage(d.profilePicture || null);
      })
      .catch(console.error);
  }, []));

  // listen to unread notifications in subcollection
  useFocusEffect(useCallback(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;
    const unsub = firestore()
      .collection('users').doc(uid)
      .collection('notifications')
      .where('read', '==', false)
      .onSnapshot(
        snap => setNotificationsCount(snap?.size ?? 0),
        err => {
          console.error('Notifications listener error:', err);
          setNotificationsCount(0);
        }
      );
    return unsub;
  }, []));

  const openImagePicker = () => setImagePickerVisible(true);
  const closeImagePicker = () => setImagePickerVisible(false);

  const handleImageSelection = res => {
    const uri = res.assets?.[0]?.uri;
    if (uri) uploadProfileImage(uri);
    closeImagePicker();
  };

  const uploadProfileImage = async uri => {
    try {
      const url = await uploadImageToCloudinary(uri, 'profile_pictures');
      const uid = auth().currentUser?.uid;
      await firestore().collection('users').doc(uid)
        .update({ profilePicture: url });
      setProfileImage(url);
    } catch (e) {
      console.error('Upload failed:', e);
    }
  };

  return (
    <>
      <LinearGradient
        colors={['#953DF5','#7CD7F7']} style={styles.container}
        start={{ x:0,y:0 }} end={{ x:1,y:1 }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#953DF5"/>
        <SafeAreaView style={styles.safeArea}>
          {/* Top Bar with Notification Bell */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications" size={28} color="#FFD700"/>
              {notificationsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationsCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Profile Header */}
            <View style={styles.card}>
              <View style={styles.header}>
                <TouchableOpacity onPress={openImagePicker}>
                  <Image
                    source={profileImage
                      ? { uri: profileImage }
                      : require('../assets/profilephoto.png')}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
                <View>
                  <Text style={styles.hello}>Hello,</Text>
                  <Text style={styles.userName}>{userName}</Text>
                </View>
              </View>
            </View>

            {/* Weather Placeholder */}
            <View style={styles.weatherPlaceholder}>
              <Text style={styles.weatherText}>
                🌤️ Weather feature coming soon
              </Text>
            </View>

            {/* Outfit Categories */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Outfit Categories</Text>
              <View style={styles.categoryGrid}>
                {defaultCategories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.categoryCircle}
                    onPress={() => navigation.navigate('UserWardrobe',{filter:cat})}
                  >
                    <Text style={styles.categoryLabel}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Trio Features */}
            <View style={styles.card}>
              <View style={styles.trioFeatures}>
                <TouchableOpacity
                  style={styles.featureBox}
                  onPress={() => navigation.navigate('VirtualTryOn')}
                >
                  <Image
                    source={require('../assets/VirtualLogo.png')}
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureText}>Virtual Try-On</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.featureBox}
                  onPress={() => navigation.navigate('CustomAvatar')}
                >
                  <Image
                    source={require('../assets/customAvatarIcon.png')}
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureText}>Custom Avatar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.featureBox}
                  onPress={() => navigation.navigate('OutfitRecommendation')}
                >
                  <Image
                    source={require('../assets/AiRecom.png')}
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureText}>AI Recommendations</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>

        {/* Bottom Nav Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('UserMainScreen')}>
            <Image source={require('../assets/home.png')} style={styles.navIcon}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('UserWardrobe')}>
            <Image source={require('../assets/hanger.png')} style={styles.navIcon}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Stores')}>
            <Image source={require('../assets/cart.png')} style={styles.navIcon}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Image source={require('../assets/profilenav.png')} style={styles.navIcon}/>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Profile Image Picker */}
      <Modal visible={imagePickerVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={closeImagePicker}>
          <View style={styles.sheetOverlay}/>
        </TouchableWithoutFeedback>
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle}/>
          <Text style={styles.sheetTitle}>Select Profile Picture</Text>
          <TouchableOpacity
            style={styles.sheetRow}
            onPress={() => { closeImagePicker(); launchCamera({ mediaType:'photo' }, handleImageSelection); }}
          >
            <Ionicons name="camera-outline" size={24} color="#5A31F4"/>
            <Text style={styles.sheetText}>Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sheetRow}
            onPress={() => { closeImagePicker(); launchImageLibrary({ mediaType:'photo' }, handleImageSelection); }}
          >
            <Ionicons name="image-outline" size={24} color="#5A31F4"/>
            <Text style={styles.sheetText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sheetRow,styles.cancelRow]} onPress={closeImagePicker}>
            <Ionicons name="close-outline" size={24} color="#999"/>
            <Text style={[styles.sheetText,{ color:'#999' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default UserMainScreen;

const styles = StyleSheet.create({
  container:            { flex:1 },
  safeArea:             { flex:1,paddingBottom:80 },
  topBar:               { flexDirection:'row',justifyContent:'flex-end',paddingHorizontal:20,paddingTop:Platform.OS==='ios'?60:20,paddingBottom:10 },
  bellBtn:              { position:'relative' },
  badge:                { position:'absolute',top:-4,right:-4,backgroundColor:'#FFD700',borderRadius:8,width:16,height:16,justifyContent:'center',alignItems:'center' },
  badgeText:            { color:'#fff',fontSize:10,fontWeight:'bold' },
  scrollContent:        { padding:20 },
  card:                 { backgroundColor:'#fff',borderRadius:20,padding:20,marginBottom:16,shadowColor:'#000',shadowOpacity:0.1,shadowOffset:{width:0,height:6},shadowRadius:8,elevation:6 },
  header:               { flexDirection:'row',alignItems:'center' },
  avatar:               { width:54,height:54,borderRadius:27,marginRight:16,borderWidth:2,borderColor:'#953DF5' },
  hello:                { fontSize:14,color:'#888' },
  userName:             { fontSize:18,fontWeight:'bold',color:'#333' },
  weatherPlaceholder:   { height:80,justifyContent:'center',alignItems:'center',marginBottom:16 },
  weatherText:          { fontSize:14,fontStyle:'italic',color:'#fff' },
  sectionTitle:         { fontSize:16,fontWeight:'bold',color:'#5A31F4',marginBottom:12 },
  categoryGrid:         { flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between' },
  categoryCircle:       { width:60,height:60,borderRadius:30,backgroundColor:'#F3F3F3',justifyContent:'center',alignItems:'center',marginBottom:12,elevation:3 },
  categoryLabel:        { fontSize:11,fontWeight:'600',color:'#333',textAlign:'center' },
  trioFeatures:         { flexDirection:'row',justifyContent:'space-between',alignItems:'center' },
  featureBox:           { width:'30%',alignItems:'center' },
  featureIcon:          { width:42,height:42,resizeMode:'contain',marginBottom:6 },
  featureText:          { fontSize:14,fontWeight:'600',color:'#5A31F4',textAlign:'center' },
  navBar:               { position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-around',paddingVertical:12,borderTopColor:'#ccc',borderTopWidth:0.5,elevation:10 },
  navIcon:              { width:24,height:24,tintColor:'#5A31F4' },
  sheetOverlay:         { position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'#00000050' },
  sheetContainer:       { position:'absolute',left:0,right:0,bottom:0,backgroundColor:'#fff',paddingTop:12,paddingBottom:20,borderTopLeftRadius:16,borderTopRightRadius:16,elevation:10 },
  sheetHandle:          { width:40,height:4,backgroundColor:'#ccc',borderRadius:2,alignSelf:'center',marginBottom:16 },
  sheetTitle:           { fontSize:18,fontWeight:'bold',color:'#333',textAlign:'center',marginBottom:16 },
  sheetRow:             { flexDirection:'row',alignItems:'center',paddingVertical:14,paddingHorizontal:24 },
  sheetText:            { fontSize:16,marginLeft:16,color:'#333' },
  cancelRow:            { marginTop:8,borderTopColor:'#eee',borderTopWidth:1 },
});