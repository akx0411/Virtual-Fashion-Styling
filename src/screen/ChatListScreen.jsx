import React, { useState, useEffect, useCallback } from 'react'; 
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatListScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([
    {
      id: '1',
      sellerId: 'seller_001',
      sellerName: 'Ahmed Electronics',
      sellerImage: 'https://via.placeholder.com/50',
      buyerImage: 'https://via.placeholder.com/50/0000FF',
      lastMessage: 'Product available hai, price 5000 hai',
      timestamp: '2m ago',
      unreadCount: 2,
      online: true,
    },
    {
      id: '2',
      sellerId: 'seller_002',
      sellerName: 'Fashion Store',
      sellerImage: 'https://via.placeholder.com/50',
      buyerImage: 'https://via.placeholder.com/50/0000FF',
      lastMessage: 'Delivery charges alag honge',
      timestamp: '1h ago',
      unreadCount: 0,
      online: false,
    },
    {
      id: '3',
      sellerId: 'seller_003',
      sellerName: 'Mobile Shop',
      sellerImage: 'https://via.placeholder.com/50',
      buyerImage: 'https://via.placeholder.com/50/0000FF',
      lastMessage: 'Stock check kar raha hoon',
      timestamp: '3h ago',
      unreadCount: 1,
      online: true,
    },
  ]);

  // Update unread count
  const updateUnreadCount = useCallback((chatId) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === chatId
          ? { ...conv, unreadCount: conv.unreadCount + 1 }
          : conv
      )
    );
  }, []);

  // Initialize notifications
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Check if push notification package is available
        let PushNotification;
        try {
          PushNotification = require('react-native-push-notification').default;
        } catch (error) {
          console.log('Push notification package not available');
          return;
        }

        // Check if Firebase messaging is available
        let messaging;
        try {
          messaging = require('@react-native-firebase/messaging').default;
        } catch (error) {
          console.log('Firebase messaging not available:', error.message);
          messaging = null;
        }

        PushNotification.configure({
          onRegister: function (token) {
            console.log('TOKEN:', token);
          },
          onNotification: function (notification) {
            console.log('NOTIFICATION:', notification);
            if (notification.userInteraction && notification.data) {
              const chatId = notification.data.chatId;
              const conversation = conversations.find(c => c.id === chatId);
              if (conversation) {
                navigation.navigate('ChatDetail', { conversation });
              }
            }
          },
          onRegistrationError: function (err) {
            console.error('Registration Error:', err.message, err);
          },
          permissions: {
            alert: true,
            badge: true,
            sound: true,
          },
          popInitialNotification: true,
          requestPermissions: Platform.OS === 'ios',
        });

        // Create channel (Android)
        PushNotification.createChannel(
          {
            channelId: 'chat-messages',
            channelName: 'Chat Messages',
            channelDescription: 'Notifications for new chat messages',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          (created) => console.log(`Notification Channel created: ${created}`)
        );

        // Firebase permissions if available
        if (messaging) {
          try {
            const authStatus = await messaging().requestPermission();
            const enabled =
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
              console.log('Firebase Authorization status:', authStatus);

              const fcmToken = await messaging().getToken();
              if (fcmToken) {
                console.log('FCM Token:', fcmToken);
              }

              messaging().onTokenRefresh(token => {
                console.log('Token refreshed:', token);
              });

              // Foreground message handling
              const unsubscribe = messaging().onMessage(async remoteMessage => {
                console.log('Foreground Message:', remoteMessage);

                PushNotification.localNotification({
                  channelId: 'chat-messages',
                  title: remoteMessage.notification?.title || 'New Message',
                  message: remoteMessage.notification?.body || 'You have a new message',
                  playSound: true,
                  soundName: 'default',
                  userInfo: remoteMessage.data,
                  largeIcon: 'ic_launcher',
                  smallIcon: 'ic_notification',
                });

                if (remoteMessage.data?.chatId) {
                  updateUnreadCount(remoteMessage.data.chatId);
                }
              });

              return unsubscribe;
            } else {
              console.log('Firebase permission not granted');
            }
          } catch (firebaseError) {
            console.error('Firebase setup error:', firebaseError);
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        Alert.alert(
          'Notification Setup Error',
          'Please make sure Firebase is properly configured. Check installation steps.',
          [{ text: 'OK' }]
        );
      }
    };

    initializeNotifications();
  }, [navigation, conversations, updateUnreadCount]);

  const startNewChat = (seller) => {
    const existingChat = conversations.find(c => c.sellerId === seller.id);

    if (existingChat) {
      navigation.navigate('ChatDetail', { conversation: existingChat });
    } else {
      const newConversation = {
        id: Date.now().toString(),
        sellerId: seller.id,
        sellerName: seller.name,
        sellerImage: seller.image,
        buyerImage: 'https://via.placeholder.com/50/0000FF',
        lastMessage: '',
        timestamp: 'Now',
        unreadCount: 0,
        online: seller.online,
      };

      setConversations([newConversation, ...conversations]);
      navigation.navigate('ChatDetail', { conversation: newConversation });
    }
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.id === item.id ? { ...conv, unreadCount: 0 } : conv
          )
        );
        navigation.navigate('ChatDetail', {
          conversation: item,
          onMessageSent: updateUnreadCount,
        });
      }}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.sellerImage }} style={styles.avatar} />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.sellerName}>{item.sellerName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messagePreview}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || 'Tap to start chatting'}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <Image source={{ uri: item.buyerImage }} style={styles.buyerBadge} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Messages</Text>
          {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0) > 0 && (
            <View style={styles.totalUnreadBadge}>
              <Text style={styles.totalUnreadText}>
                {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => {
              Alert.alert(
                'Start New Chat',
                'Select a seller to start chatting',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Test Seller',
                    onPress: () => startNewChat({
                      id: 'seller_new',
                      name: 'New Test Seller',
                      image: 'https://via.placeholder.com/50',
                      online: true,
                    }),
                  },
                ]
              );
            }}
          >
            <Icon name="create-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.activeUsersContainer}>
        <Text style={styles.activeUsersTitle}>Active Sellers</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={conversations.filter(c => c.online)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.activeUserItem}
              onPress={() => navigation.navigate('ChatDetail', { conversation: item })}
            >
              <View style={styles.activeUserImageContainer}>
                <Image source={{ uri: item.sellerImage }} style={styles.activeUserImage} />
                <View style={styles.activeUserIndicator} />
              </View>
              <Text style={styles.activeUserName} numberOfLines={1}>
                {item.sellerName.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginRight: 8 },
  totalUnreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  totalUnreadText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row' },
  headerIcon: { marginLeft: 16 },
  activeUsersContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeUsersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  activeUserItem: { alignItems: 'center', marginRight: 16, width: 64 },
  activeUserImageContainer: { position: 'relative' },
  activeUserImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  activeUserIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  activeUserName: { fontSize: 11, color: '#000', marginTop: 4, textAlign: 'center' },
  listContainer: { padding: 8 },
  conversationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    alignItems: 'center',
  },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  conversationContent: { flex: 1, justifyContent: 'center' },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sellerName: { fontSize: 16, fontWeight: '600', color: '#000' },
  timestamp: { fontSize: 12, color: '#999' },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: { fontSize: 14, color: '#666', flex: 1 },
  unreadBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  buyerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: 8,
  },
});

export default ChatListScreen;