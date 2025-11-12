import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function AdminVerifyPost() {
  const [posts] = useState([
    {
      id: 1,
      sellerId: 'U001',
      sellerName: 'Ayesha Ahmed',
      outfitName: 'Elegant Summer Dress',
      brand: 'Khaadi',
      size: 'Medium',
      color: 'Light Blue',
      price: '8500',
      condition: 'Brand New',
      description: 'Beautiful summer dress with floral print. Perfect for casual outings and summer parties. Made from premium cotton fabric.',
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
      ],
      postedDate: '2024-11-05',
      status: 'pending'
    },
    {
      id: 2,
      sellerId: 'U002',
      sellerName: 'Fatima Khan',
      outfitName: 'Designer Party Wear',
      brand: 'Sana Safinaz',
      size: 'Large',
      color: 'Maroon',
      price: '15000',
      condition: 'Like New',
      description: 'Stunning designer party wear with intricate embroidery. Worn only once. Comes with matching dupatta and trousers.',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
        'https://images.unsplash.com/photo-1583391733981-5ead0f23b60b?w=400',
        'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400',
      ],
      postedDate: '2024-11-04',
      status: 'pending'
    },
    {
      id: 3,
      sellerId: 'U003',
      sellerName: 'Sara Ali',
      outfitName: 'Casual Lawn Suit',
      brand: 'Gul Ahmed',
      size: 'Small',
      color: 'Pink & White',
      price: '4500',
      condition: 'Gently Used',
      description: 'Comfortable lawn suit perfect for everyday wear. Two piece suit with printed design. Very good condition.',
      images: [
        'https://images.unsplash.com/photo-1612252492419-e5f8c6d73de3?w=400',
        'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400',
      ],
      postedDate: '2024-11-03',
      status: 'pending'
    },
    {
      id: 4,
      sellerId: 'U004',
      sellerName: 'Zainab Hassan',
      outfitName: 'Winter Shawl Collection',
      brand: 'Nishat Linen',
      size: 'Medium',
      color: 'Beige',
      price: '6000',
      condition: 'Brand New',
      description: 'Warm winter shawl with elegant embroidery. Premium quality fabric. Perfect for winter season.',
      images: [
        'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400',
        'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400',
      ],
      postedDate: '2024-11-02',
      status: 'pending'
    },
    {
      id: 5,
      sellerId: 'U005',
      sellerName: 'Hira Malik',
      outfitName: 'Formal Office Wear',
      brand: 'Sapphire',
      size: 'Medium',
      color: 'Navy Blue',
      price: '7500',
      condition: 'Brand New',
      description: 'Professional formal outfit for office wear. Elegant design with premium stitching.',
      images: [
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400',
        'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
      ],
      postedDate: '2024-11-01',
      status: 'pending'
    }
  ]);

  const [postStatuses, setPostStatuses] = useState(
    posts.reduce((acc, post) => {
      acc[post.id] = { status: 'pending', rejectionReason: '' };
      return acc;
    }, {})
  );

  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingPosts = posts.filter(p => postStatuses[p.id]?.status === 'pending');
  const approvedPosts = posts.filter(p => postStatuses[p.id]?.status === 'approved');
  const rejectedPosts = posts.filter(p => postStatuses[p.id]?.status === 'rejected');

  const currentPost = pendingPosts[currentPostIndex];

  const handleVerify = () => {
    if (currentPost) {
      setPostStatuses({
        ...postStatuses,
        [currentPost.id]: { status: 'approved', rejectionReason: '' }
      });
      setRejectionReason('');
      if (currentPostIndex < pendingPosts.length - 1) {
        setCurrentPostIndex(currentPostIndex + 1);
      }
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Rejection reason required');
      return;
    }
    if (currentPost) {
      setPostStatuses({
        ...postStatuses,
        [currentPost.id]: { status: 'rejected', rejectionReason }
      });
      setRejectionReason('');
      if (currentPostIndex < pendingPosts.length - 1) {
        setCurrentPostIndex(currentPostIndex + 1);
      }
    }
  };

  const handleSkip = () => {
    if (currentPostIndex < pendingPosts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
      setRejectionReason('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Icon name="hanger" size={28} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Outfit Verification</Text>
            <Text style={styles.headerSubtitle}>Review seller outfit posts</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.pendingCard]}>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={styles.statNumber}>{pendingPosts.length}</Text>
            </View>
            <View style={styles.statIconContainer}>
              <Icon name="clock-alert" size={32} color="#fff" />
            </View>
          </View>

          <View style={[styles.statCard, styles.approvedCard]}>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Approved</Text>
              <Text style={styles.statNumber}>{approvedPosts.length}</Text>
            </View>
            <View style={styles.statIconContainer}>
              <Icon name="check-circle" size={32} color="#fff" />
            </View>
          </View>

          <View style={[styles.statCard, styles.rejectedCard]}>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Rejected</Text>
              <Text style={styles.statNumber}>{rejectedPosts.length}</Text>
            </View>
            <View style={styles.statIconContainer}>
              <Icon name="close-circle" size={32} color="#fff" />
            </View>
          </View>
        </View>

        {/* Current Post */}
        {currentPost ? (
          <View style={styles.postCard}>
            {/* Post Counter */}
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                Post {currentPostIndex + 1} of {pendingPosts.length}
              </Text>
            </View>

            {/* Seller Header */}
            <View style={styles.postHeader}>
              <View style={styles.sellerInfo}>
                <View style={styles.sellerIconContainer}>
                  <Icon name="account" size={24} color="#fff" />
                </View>
                <View>
                  <Text style={styles.sellerName}>{currentPost.sellerName}</Text>
                  <Text style={styles.sellerId}>ID: {currentPost.sellerId}</Text>
                </View>
              </View>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            </View>

            {/* Outfit Images - Scrollable Horizontal */}
            <View style={styles.outfitImageContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imagesScrollContent}
                pagingEnabled
              >
                {currentPost.images.map((img, idx) => (
                  <View key={idx} style={styles.imageWrapper}>
                    <Image 
                      source={{ uri: img }} 
                      style={styles.outfitImage}
                      resizeMode="cover"
                    />
                    <View style={styles.imageCounter}>
                      <Text style={styles.imageCounterText}>{idx + 1}/{currentPost.images.length}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Outfit Name */}
            <Text style={styles.outfitName}>{currentPost.outfitName}</Text>

            {/* Outfit Details */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Icon name="tag" size={14} color="#c4b5fd" />
                <Text style={styles.detailLabel}>Brand:</Text>
                <Text style={styles.detailValue}>{currentPost.brand}</Text>
              </View>

              <View style={styles.detailItem}>
                <Icon name="resize" size={14} color="#c4b5fd" />
                <Text style={styles.detailLabel}>Size:</Text>
                <Text style={styles.detailValue}>{currentPost.size}</Text>
              </View>

              <View style={styles.detailItem}>
                <Icon name="palette" size={14} color="#c4b5fd" />
                <Text style={styles.detailLabel}>Color:</Text>
                <Text style={styles.detailValue}>{currentPost.color}</Text>
              </View>

              <View style={styles.detailItem}>
                <Icon name="cash" size={14} color="#c4b5fd" />
                <Text style={styles.detailLabel}>Price:</Text>
                <Text style={styles.detailValuePrice}>PKR {parseInt(currentPost.price).toLocaleString()}</Text>
              </View>

              <View style={styles.detailItem}>
                <Icon name="star" size={14} color="#c4b5fd" />
                <Text style={styles.detailLabel}>Condition:</Text>
                <Text style={styles.detailValue}>{currentPost.condition}</Text>
              </View>

              <View style={styles.detailItem}>
                <Icon name="calendar" size={14} color="#c4b5fd" />
                <Text style={styles.detailLabel}>Posted:</Text>
                <Text style={styles.detailValue}>{currentPost.postedDate}</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.description}>
              {currentPost.description}
            </Text>

            {/* Rejection Reason */}
            <View style={styles.reasonContainer}>
              <Text style={styles.reasonLabel}>Rejection Reason (if rejecting)</Text>
              <TextInput
                style={styles.reasonInput}
                value={rejectionReason}
                onChangeText={setRejectionReason}
                placeholder="Enter reason for rejection..."
                placeholderTextColor="#a78bfa"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Icon name="skip-forward" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={handleReject}
              >
                <Icon name="close" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.approveButton}
                onPress={handleVerify}
              >
                <Icon name="check" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="check-circle" size={48} color="#10b981" />
            </View>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>No pending outfits to review</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1b4b',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#a855f7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#c4b5fd',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingCard: {
    backgroundColor: '#f59e0b',
  },
  approvedCard: {
    backgroundColor: '#10b981',
  },
  rejectedCard: {
    backgroundColor: '#ef4444',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    backgroundColor: 'rgba(168,85,247,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  counterText: {
    color: '#c4b5fd',
    fontSize: 12,
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#a855f7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  sellerId: {
    fontSize: 12,
    color: '#c4b5fd',
    marginTop: 2,
  },
  pendingBadge: {
    backgroundColor: 'rgba(251,191,36,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '500',
  },
  outfitImageContainer: {
    marginBottom: 12,
  },
  imagesScrollContent: {
    paddingRight: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    width: width - 104,
  },
  outfitImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#2d2a4a',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  outfitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: '#c4b5fd',
  },
  detailValue: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  detailValuePrice: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 13,
    color: '#e9d5ff',
    marginBottom: 12,
    lineHeight: 18,
  },
  reasonContainer: {
    marginBottom: 16,
  },
  reasonLabel: {
    fontSize: 12,
    color: '#c4b5fd',
    fontWeight: '500',
    marginBottom: 8,
  },
  reasonInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  skipButton: {
    flex: 0.8,
    backgroundColor: '#6b7280',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#c4b5fd',
  },
});