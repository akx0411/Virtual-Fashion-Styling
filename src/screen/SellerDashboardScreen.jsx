// src/screen/SellerDashboardScreen.jsx

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

export default function SellerDashboardScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab]                   = useState('Home');
  const [dpUri, setDpUri]                           = useState('https://i.pravatar.cc/100?img=12');
  const [sellerName, setSellerName]                 = useState('Seller');
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [pickerVisible, setPickerVisible]           = useState(false);

  useFocusEffect(useCallback(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;
    const unsub = firestore()
      .collection('users').doc(uid)
      .onSnapshot(doc => {
        const data = doc.data() || {};
        const name = `${data.firstName||''} ${data.lastName||''}`.trim();
        setSellerName(name || 'Seller');
        if (data.profilePicture) setDpUri(data.profilePicture);
      }, console.error);
    return () => unsub();
  }, []));

  // Fetch unread notifications
  useFocusEffect(useCallback(() => {
    const uid = auth().currentUser?.uid;
    if (!uid) return;
    const unsub = firestore()
      .collection('users').doc(uid)
      .collection('notifications')
      .where('read','==',false)
      .onSnapshot(
        snap => setNotificationsCount(snap.size || 0),
        err => { console.error(err); setNotificationsCount(0); }
      );
    return () => unsub();
  }, []));

  const openPicker  = () => setPickerVisible(true);
  const closePicker = () => setPickerVisible(false);

  const onImageSelected = async response => {
    const uri = response.assets?.[0]?.uri;
    if (!uri) return;
    closePicker();
    try {
      const url = await uploadImageToCloudinary(uri, 'profile_pictures');
      const uid = auth().currentUser.uid;
      await firestore().collection('users').doc(uid)
        .update({ profilePicture: url });
      setDpUri(url);
    } catch (e) {
      console.error('Upload error:', e);
    }
  };

  const pickFromCamera  = () => launchCamera({ mediaType:'photo' }, onImageSelected);
  const pickFromGallery = () => launchImageLibrary({ mediaType:'photo' }, onImageSelected);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const statsButtons = [
    { title: 'Total Outfits', value: 342 },
    { title: 'Total Orders', value: 128 },
  ];
  const graphData = [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 200 },
    { month: 'Mar', value: 150 },
    { month: 'Apr', value: 300 },
    { month: 'May', value: 250 },
    { month: 'Jun', value: 400 },
  ];

  return (
    <>
      <LinearGradient
        colors={['#953DF5','#7CD7F7']}
        style={styles.safe}
        start={{ x:0,y:0 }} end={{ x:1,y:1 }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#953DF5" />

        <SafeAreaView style={{ flex:1 }}>
          <ScrollView contentContainerStyle={styles.container}>

            {/* Top Card */}
            <View style={styles.topCard}>
              <View style={styles.profileRow}>
                <TouchableOpacity onPress={openPicker}>
                  <Image source={{ uri: dpUri }} style={styles.avatar} />
                </TouchableOpacity>
                <View style={styles.welcomeText}>
                  <Text style={styles.welcome}>Welcome back,</Text>
                  <Text style={styles.username}>{sellerName}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                <Ionicons name="notifications" size={28} color="#FFD700" />
                {notificationsCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationsCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.statsButtons}>
              {statsButtons.map((item,i) => (
                <TouchableOpacity key={i} style={styles.statCard}>
                  <Text style={styles.statTitle}>{item.title}</Text>
                  <Text style={styles.statValue}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.postCard}>
              <Text style={styles.postCardHeading}>
                Recent Outfits Uploaded
              </Text>
              <View style={styles.postContent}>
                <Image
                  source={{
                    uri:
                      'https://di2ponv0v5otw.cloudfront.net/posts/2024/05/25/665274789ceaf7dd684aed7d/m_665274d1f9927cdb6bae5a7f.jpg'
                  }}
                  style={styles.postThumbnail}
                />
                <View style={styles.postInfo}>
                  <Text style={styles.postTitle}>Floral Summer Dress</Text>
                  <Text style={styles.postDesc}>
                    Lightweight, elegant summer dress for sunny days.
                  </Text>
                  <Text style={styles.postPrice}>PKR 3,499</Text>
                </View>
              </View>
            </View>

            <View style={styles.graphCard}>
              <Text style={styles.graphTitle}>Orders Over Time</Text>
              <View style={styles.graph}>
                {graphData.map((p,idx) => (
                  <View key={idx} style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        { height: p.value/2, backgroundColor:'#FF8C00' }
                      ]}
                    />
                    <Text style={styles.barLabel}>{p.month}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.bottomNav}>
        {[
          { key: 'Home',     icon: 'home-outline' },
          { key: 'Post',     icon: 'add-circle-outline' },
          { key: 'Messages', icon: 'chatbubbles-outline' },
          { key: 'Profile',  icon: 'person-outline' },
        ].map(item => (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => {
              setActiveTab(item.key);

              if (item.key === 'Profile') {
                navigation.navigate('SellerStoreSetup');
              } else if (item.key === 'Post') {
                navigation.navigate('SellerProfileScreen');
              } else if (item.key === 'Messages') {
                navigation.navigate('ChatListScreen');
              } else if (item.key === 'Home') {
                navigation.navigate('SellerDashboardScreen');
              }
            }}
          >
            <Ionicons
              name={item.icon}
              size={26}
              color={activeTab === item.key ? '#FF8C00' : '#666'}
            />
            <Text style={[
              styles.navLabel,
              activeTab === item.key && styles.navLabelActive,
            ]}>
              {item.key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      {/* Image Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={closePicker}>
          <View style={styles.sheetOverlay}/>
        </TouchableWithoutFeedback>
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle}/>
          <Text style={styles.sheetTitle}>Select Profile Picture</Text>
          <TouchableOpacity style={styles.sheetRow} onPress={pickFromCamera}>
            <Ionicons name="camera-outline" size={24} color="#5A31F4"/>
            <Text style={styles.sheetText}>Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sheetRow} onPress={pickFromGallery}>
            <Ionicons name="image-outline" size={24} color="#5A31F4"/>
            <Text style={styles.sheetText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sheetRow,styles.cancelRow]} onPress={closePicker}>
            <Ionicons name="close-outline" size={24} color="#999"/>
            <Text style={[styles.sheetText,{color:'#999'}]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex:1 },
  container: {
    paddingTop:16,
    paddingBottom:100,
    paddingHorizontal:12,
  },

  topCard: {
    backgroundColor:'#fff',
    borderRadius:12,
    padding:16,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginTop:20,
    marginBottom:16,
  },
  profileRow:{ flexDirection:'row',alignItems:'center' },
  avatar:{ width:56,height:56,borderRadius:28,borderWidth:2,borderColor:'#953DF5' },
  welcomeText:{ marginLeft:12 },
  welcome:{ fontSize:16,color:'#333' },
  username:{ fontSize:20,fontWeight:'600',color:'#333' },
  badge:{
    position:'absolute', top:-4, right:-4,
    backgroundColor:'#FF3B30', width:18, height:18,
    borderRadius:9, alignItems:'center', justifyContent:'center',
  },
  badgeText:{ color:'#fff', fontSize:10, fontWeight:'600' },

  statsButtons:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:16,
  },
  statCard:{
    flex:1, backgroundColor:'#fff',
    borderRadius:12, padding:16,
    marginHorizontal:4, alignItems:'center',
  },
  statTitle:{ fontSize:14,color:'#333',fontWeight:'600' },
  statValue:{ fontSize:24,fontWeight:'600',color:'#FF8C00',marginTop:4 },

  postCard:{
    flexDirection:'column',
    backgroundColor:'#fff',
    borderRadius:12,
    padding:16,
    marginBottom:16,
    shadowColor:'#000',
    shadowOffset:{ width:0,height:2 },
    shadowOpacity:0.1,
    shadowRadius:4,
    elevation:2,
  },
  postCardHeading:{
    fontSize:16,
    fontWeight:'600',
    color:'#333',
    marginBottom:8,
  },
  postContent:{ flexDirection:'row', alignItems:'center' },
  postThumbnail:{
    width:80,
    height:80,
    borderRadius:8,
    marginRight:12,
  },
  postInfo:{ flex:1 },
  postTitle:{
    fontSize:16,
    fontWeight:'600',
    color:'#333',
    marginBottom:4,
  },
  postDesc:{
    fontSize:14,
    color:'#666',
    marginBottom:6,
  },
  postPrice:{
    fontSize:16,
    fontWeight:'600',
    color:'#FF8C00',
  },

  graphCard:{
    backgroundColor:'#fff',
    borderRadius:12,
    padding:16,
    marginBottom:16,
  },
  graphTitle:{ fontSize:16,fontWeight:'600',marginBottom:12,color:'#333' },
  graph:{
    flexDirection:'row',
    alignItems:'flex-end',
    justifyContent:'space-around',
    paddingHorizontal:8,
  },
  barWrapper:{ alignItems:'center', width:40 },
  bar:{ width:20, borderRadius:4 },
  barLabel:{ fontSize:12, color:'#333', marginTop:6 },

  logoutBtn:{
    backgroundColor:'#000',
    borderRadius:12,
    paddingVertical:12,
    alignItems:'center'
  },
  logoutText:{ color:'#fff', fontSize:16, fontWeight:'600' },

  bottomNav:{
    position:'absolute', bottom:0, left:0, right:0,
    height:60, flexDirection:'row',
    backgroundColor:'#fff',
    borderTopWidth:1, borderColor:'#eee'
  },
  navItem:{ flex:1, alignItems:'center', justifyContent:'center' },
  navLabel:{ fontSize:10, color:'#666', marginTop:4, fontWeight:'600' },
  navLabelActive:{ color:'#FF8C00', fontWeight:'600' },

  sheetOverlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.5)' },
  sheetContainer:{
    backgroundColor:'#fff',
    padding:20,
    borderTopLeftRadius:12,
    borderTopRightRadius:12
  },
  sheetHandle:{
    width:40, height:5,
    backgroundColor:'#ccc',
    borderRadius:2.5,
    alignSelf:'center',
    marginBottom:12
  },
  sheetTitle:{ fontSize:16, fontWeight:'600', marginBottom:16 },
  sheetRow:{ flexDirection:'row', alignItems:'center', paddingVertical:12 },
  sheetText:{ marginLeft:12, fontSize:16, color:'#333' },
  cancelRow:{ marginTop:8 },
});
