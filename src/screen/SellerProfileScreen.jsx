import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const defaultImg = require('../assets/SellerSignUp.png');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [activeTab, setActiveTab] = useState('Profile');

  const [profileImage, setProfileImage] = useState(defaultImg);
  const [name, setName] = useState('Umama Salar');
  const [username, setUsername] = useState('username');
  const [bio, setBio] = useState(
    'Imagine, Dream and Believe in Yourself. With determination and belief, You will be surprised at what you accomplish 💕'
  );

  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const flatRef = useRef(null);
  const scrollRef = useRef(null);

  // Accept new post from route params
  useEffect(() => {
    const newPost = route?.params?.newPost;
    if (newPost) {
      setPosts(prev => [newPost, ...prev]);
      setTimeout(() => {
        flatRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 120);
    }
  }, [route?.params?.newPost]);

  const handleCreateNav = () => {
    navigation.navigate('SellerCreatePostScreen', {
      onCreate: newPost => {
        setPosts(prev => [newPost, ...prev]);
      },
    });
  };

  const renderPost = ({ item }) => {
    const firstImage = item?.images && item.images.length > 0 ? item.images[0] : null;

    return (
      <TouchableOpacity
        style={styles.postItem}
        onPress={() => {
          setSelectedPost(item);
          setSelectedImageIndex(0);
        }}
        activeOpacity={0.9}
      >
        {firstImage ? (
          <>
            <Image source={{ uri: firstImage }} style={styles.postImage} resizeMode="cover" />
            {item.images && item.images.length > 1 && (
              <View style={styles.multiImageIndicator}>
                <Ionicons name="images-outline" size={16} color="#fff" />
              </View>
            )}
          </>
        ) : (
          <View style={styles.postImagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="lock-closed-outline" size={18} color="#000" style={{ marginRight: 6 }} />
          <Text style={styles.username}>{username}</Text>
          <Ionicons name="chevron-down-outline" size={16} color="#000" style={{ marginLeft: 6 }} />
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleCreateNav}>
            <Ionicons name="add-circle-outline" size={28} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginLeft: 12 }}>
            <Ionicons name="menu-outline" size={26} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* PROFILE + POSTS */}
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileTop}>
            <View style={styles.profileCircle}>
              <Image source={profileImage} style={styles.profileImage} />
            </View>

            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{posts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <View style={styles.bioSection}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.bio}>{bio}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('SellerEditProfileScreen', {
                  name,
                  username,
                  bio,
                  profileImage,
                  onSave: updated => {
                    setName(updated.name);
                    setUsername(updated.username);
                    setBio(updated.bio);
                    setProfileImage(updated.profileImage);
                  },
                })
              }
            >
              <Text style={styles.buttonText}>Edit profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Share Profile')}>
              <Text style={styles.buttonText}>Share profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* POSTS GRID */}
        {posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image source={profileImage} style={styles.emptyImage} />
            <Text style={styles.emptyTitle}>Create your first post</Text>
            <TouchableOpacity style={styles.uploadCTA} onPress={handleCreateNav}>
              <Text style={styles.uploadCTAText}>Create</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            ref={flatRef}
            data={posts}
            keyExtractor={item => item.id}
            renderItem={renderPost}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.postsGrid}
          />
        )}
      </ScrollView>

      {/* INSTAGRAM-LIKE POST DETAIL MODAL */}
      <Modal visible={!!selectedPost} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          {/* Header */}
          <View style={styles.detailHeader}>
            <TouchableOpacity onPress={() => setSelectedPost(null)}>
              <Ionicons name="arrow-back" size={26} color="#000" />
            </TouchableOpacity>
            <Text style={styles.detailHeaderTitle}>Post</Text>
            <View style={{ width: 26 }} />
          </View>

          {selectedPost ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Image carousel */}
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={e => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / width);
                  setSelectedImageIndex(index);
                }}
                scrollEventThrottle={16}
                style={{ backgroundColor: '#000' }}
              >
                {(selectedPost.images && selectedPost.images.length > 0 ? selectedPost.images : [null]).map(
                  (img, idx) => (
                    <View key={idx} style={{ width, height: width, backgroundColor: '#000' }}>
                      {img ? (
                        <Image source={{ uri: img }} style={styles.detailImage} resizeMode="cover" />
                      ) : (
                        <View style={styles.noImageBox}>
                          <Text style={{ color: '#fff' }}>No Image</Text>
                        </View>
                      )}
                    </View>
                  )
                )}
              </ScrollView>

              {/* Seller Row */}
              <View style={styles.sellerRow}>
                <Image source={profileImage} style={styles.sellerPic} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sellerName}>{name}</Text>
                  <Text style={styles.sellerUsername}>@{username}</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Options')}>
                  <Ionicons name="ellipsis-horizontal" size={22} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Description → Color → Size → Price → Brand → Tags */}
              <View style={styles.detailBox}>
                {selectedPost.description || selectedPost.caption ? (
                  <Text style={styles.detailText}>
                    {selectedPost.description ?? selectedPost.caption}
                  </Text>
                ) : null}

                {selectedPost.color ? (
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Color: </Text>
                    {selectedPost.color}
                  </Text>
                ) : null}

                {selectedPost.size ? (
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Size: </Text>
                    {selectedPost.size}
                  </Text>
                ) : null}

                {selectedPost.price ? (
                  <Text style={[styles.infoText, styles.priceText]}>
                    <Text style={styles.infoLabel}>Price: </Text>Rs {selectedPost.price}
                  </Text>
                ) : null}

                {selectedPost.brand ? (
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Brand: </Text>
                    {selectedPost.brand}
                  </Text>
                ) : null}

                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <View style={[styles.tagsContainer, { marginTop: 10 }]}>
                    {selectedPost.tags.map((tag, i) => (
                      <View key={i} style={styles.tagChip}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
          ) : null}
        </SafeAreaView>
      </Modal>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { key: 'Home', icon: 'home-outline', route: 'SellerDashboardScreen' },
          { key: 'Post', icon: 'add-circle-outline', route: 'SellerPostScreen' },
          { key: 'Messages', icon: 'chatbubbles-outline', route: 'SellerProfilescreen' },
          { key: 'Profile', icon: 'person-outline', route: 'SellerStoreSetup' },
        ].map(item => (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => {
              setActiveTab(item.key);
              navigation.navigate(item.route);
            }}
          >
            <Ionicons
              name={item.icon}
              size={26}
              color={activeTab === item.key ? '#FF8C00' : '#666'}
            />
            <Text style={[styles.navLabel, activeTab === item.key && styles.navLabelActive]}>
              {item.key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#e5e5e5',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  username: { fontSize: 18, fontWeight: '600', color: '#000' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },

  profileSection: { padding: 16 },
  profileTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  profileCircle: {
    width: 94, height: 94, borderRadius: 47, borderWidth: 2, borderColor: '#FF8C00',
    justifyContent: 'center', alignItems: 'center', marginRight: 20,
  },
  profileImage: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#f0f0f0' },
  stats: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 17, fontWeight: '700', color: '#000' },
  statLabel: { fontSize: 13, color: '#555' },

  bioSection: { marginTop: 6 },
  name: { fontWeight: '700', fontSize: 15, color: '#000' },
  bio: { fontSize: 13.5, color: '#333', marginTop: 4 },

  actionButtons: { flexDirection: 'row', marginTop: 10 },
  button: {
    flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingVertical: 8,
    marginHorizontal: 4, alignItems: 'center', backgroundColor: '#fff',
  },
  buttonText: { color: '#000', fontWeight: '600' },

  emptyContainer: { alignItems: 'center', marginTop: 50, paddingBottom: 100 },
  emptyImage: { width: 90, height: 90, marginBottom: 20, borderRadius: 45 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#000', marginBottom: 12 },
  uploadCTA: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 8 },
  uploadCTAText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  postsGrid: { paddingBottom: 100 },
  postItem: { width: '33.33%', aspectRatio: 1, borderWidth: 0.5, borderColor: '#ddd' },
  postImage: { width: '100%', height: '100%' },
  postImagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
  placeholderText: { color: '#999', fontSize: 12 },
  multiImageIndicator: {
    position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12, padding: 4,
  },

  detailHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 0.5, borderColor: '#ddd',
  },
  detailHeaderTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  detailImage: { width: width, height: width },
  noImageBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  sellerRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
  },
  sellerPic: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  sellerName: { fontWeight: '700', color: '#000', fontSize: 14 },
  sellerUsername: { fontSize: 12, color: '#555' },

  detailBox: { paddingHorizontal: 16, paddingBottom: 20 },
  detailText: { fontSize: 15, color: '#000', marginBottom: 8, lineHeight: 22 },
  infoText: { fontSize: 15, color: '#000', marginBottom: 6 },
  infoLabel: { fontWeight: '700', color: '#FF8C00' },
  priceText: { color: '#FF8C00', fontWeight: '700' },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  tagChip: {
    backgroundColor: '#e7f5ff', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1, borderColor: '#74c0fc', marginRight: 8, marginBottom: 8,
  },
  tagText: { color: '#1971c2', fontSize: 13, fontWeight: '600' },

  bottomNav: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 72,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff',
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 10, color: '#666', marginTop: 2 },
  navLabelActive: { color: '#FF8C00', fontWeight: '600' },
});

export default ProfileScreen;
