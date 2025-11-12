import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function AdminManageAccounts() {
  const [sellers, setSellers] = useState([
    {
      id: 'S001',
      name: 'Ayesha Ahmed',
      email: 'ayesha.ahmed@email.com',
      brandName: 'Ayesha Fashion',
      status: 'verified',
      verificationDate: '2024-10-15',
      totalProducts: 12,
      joinDate: '2024-09-20',
      rating: 4.8,
      totalSales: 45,
      verificationRequests: [
        { id: 1, date: '2024-10-10', status: 'approved', notes: 'Documents verified' },
      ],
    },
    {
      id: 'S002',
      name: 'Fatima Khan',
      email: 'fatima.khan@email.com',
      brandName: 'Fatima Collections',
      status: 'pending',
      verificationDate: null,
      totalProducts: 5,
      joinDate: '2024-11-12',
      rating: 0,
      totalSales: 3,
      verificationRequests: [
        { id: 1, date: '2024-11-12', status: 'pending', notes: 'Awaiting documents' },
      ],
    },
    {
      id: 'S003',
      name: 'Sara Ali',
      email: 'sara.ali@email.com',
      brandName: 'Sara Styles',
      status: 'verified',
      verificationDate: '2024-10-05',
      totalProducts: 28,
      joinDate: '2024-08-10',
      rating: 4.9,
      totalSales: 120,
      verificationRequests: [
        { id: 1, date: '2024-10-01', status: 'approved', notes: 'All documents verified' },
      ],
    },
    {
      id: 'S004',
      name: 'Zainab Hassan',
      email: 'zainab.hassan@email.com',
      brandName: 'Zainab Boutique',
      status: 'suspended',
      verificationDate: '2024-09-15',
      totalProducts: 0,
      joinDate: '2024-07-01',
      rating: 2.1,
      totalSales: 8,
      suspensionReason: 'Multiple policy violations',
      verificationRequests: [
        { id: 1, date: '2024-09-10', status: 'approved', notes: 'Initially approved' },
        { id: 2, date: '2024-11-10', status: 'rejected', notes: 'Policy violations detected' },
      ],
    },
    {
      id: 'S005',
      name: 'Hira Malik',
      email: 'hira.malik@email.com',
      brandName: 'Hira Fashion Hub',
      status: 'verified',
      verificationDate: '2024-10-20',
      totalProducts: 18,
      joinDate: '2024-09-15',
      rating: 4.7,
      totalSales: 76,
      verificationRequests: [
        { id: 1, date: '2024-10-15', status: 'approved', notes: 'Documents approved' },
      ],
    },
    {
      id: 'S006',
      name: 'Maha Rizwan',
      email: 'maha.rizwan@email.com',
      brandName: 'Maha Store',
      status: 'pending',
      verificationDate: null,
      totalProducts: 3,
      joinDate: '2024-11-14',
      rating: 0,
      totalSales: 1,
      verificationRequests: [
        { id: 1, date: '2024-11-14', status: 'pending', notes: 'New seller verification' },
      ],
    },
  ]);

  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');

  const totalSellers = sellers.length;
  const verifiedSellers = sellers.filter(s => s.status === 'verified').length;
  const pendingSellers = sellers.filter(s => s.status === 'pending').length;
  const suspendedSellers = sellers.filter(s => s.status === 'suspended').length;
  const newSellerRequests = sellers.filter(s => s.status === 'pending').length;

  const getFilteredSellers = () => {
    switch (selectedTab) {
      case 'verified':
        return sellers.filter(s => s.status === 'verified');
      case 'pending':
        return sellers.filter(s => s.status === 'pending');
      case 'suspended':
        return sellers.filter(s => s.status === 'suspended');
      default:
        return sellers;
    }
  };

  const handleVerifyAccount = (seller) => {
    Alert.alert(
      'Verify Account',
      `Approve verification for ${seller.name}?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            setSellers(
              sellers.map(s =>
                s.id === seller.id
                  ? {
                      ...s,
                      status: 'verified',
                      verificationDate: new Date().toISOString().split('T')[0],
                      verificationRequests: [
                        ...s.verificationRequests,
                        {
                          id: s.verificationRequests.length + 1,
                          date: new Date().toISOString().split('T')[0],
                          status: 'approved',
                          notes: verificationNotes || 'Approved by admin',
                        },
                      ],
                    }
                  : s
              )
            );
            setVerificationNotes('');
            Alert.alert('Success', '✅ Seller account verified!');
            setShowVerificationModal(false);
          },
        },
      ]
    );
  };

  const handleRejectAccount = (seller) => {
    Alert.alert(
      'Reject Verification',
      `Reject verification for ${seller.name}?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Reject',
          onPress: () => {
            setSellers(
              sellers.map(s =>
                s.id === seller.id
                  ? {
                      ...s,
                      verificationRequests: [
                        ...s.verificationRequests,
                        {
                          id: s.verificationRequests.length + 1,
                          date: new Date().toISOString().split('T')[0],
                          status: 'rejected',
                          notes: verificationNotes || 'Rejected due to incomplete documents',
                        },
                      ],
                    }
                  : s
              )
            );
            setVerificationNotes('');
            Alert.alert('Info', 'Verification rejected. Seller notified.');
            setShowVerificationModal(false);
          },
        },
      ]
    );
  };

  const handleSuspendAccount = (seller) => {
    Alert.alert(
      'Suspend Account',
      `Suspend ${seller.name}'s account?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Suspend',
          onPress: () => {
            setSellers(
              sellers.map(s =>
                s.id === seller.id
                  ? {
                      ...s,
                      status: 'suspended',
                      suspensionReason: verificationNotes || 'Policy violation',
                    }
                  : s
              )
            );
            setVerificationNotes('');
            Alert.alert('Success', '🔒 Account suspended!');
            setShowDetailModal(false);
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'suspended':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return 'check-circle';
      case 'pending':
        return 'clock';
      case 'suspended':
        return 'lock';
      default:
        return 'help-circle';
    }
  };

  const filteredSellers = getFilteredSellers();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="account-multiple" size={32} color="#fff" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Manage Accounts</Text>
            <Text style={styles.headerSubtitle}>Manage seller accounts and verification</Text>
          </View>
        </View>
        {newSellerRequests > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{newSellerRequests}</Text>
          </View>
        )}
      </View>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={[styles.statCard, styles.totalCard]}>
          <Icon name="account-multiple" size={24} color="#fff" />
          <Text style={styles.statNumber}>{totalSellers}</Text>
          <Text style={styles.statLabel}>Total Sellers</Text>
        </View>

        <View style={[styles.statCard, styles.verifiedCard]}>
          <Icon name="check-circle" size={24} color="#fff" />
          <Text style={styles.statNumber}>{verifiedSellers}</Text>
          <Text style={styles.statLabel}>Verified</Text>
        </View>

        <View style={[styles.statCard, styles.pendingCard]}>
          <Icon name="clock-outline" size={24} color="#fff" />
          <Text style={styles.statNumber}>{pendingSellers}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={[styles.statCard, styles.suspendedCard]}>
          <Icon name="lock" size={24} color="#fff" />
          <Text style={styles.statNumber}>{suspendedSellers}</Text>
          <Text style={styles.statLabel}>Suspended</Text>
        </View>
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            All ({sellers.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'verified' && styles.activeTab]}
          onPress={() => setSelectedTab('verified')}
        >
          <Text style={[styles.tabText, selectedTab === 'verified' && styles.activeTabText]}>
            Verified ({verifiedSellers})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'pending' && styles.activeTab]}
          onPress={() => setSelectedTab('pending')}
        >
          <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}>
            Pending ({pendingSellers})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'suspended' && styles.activeTab]}
          onPress={() => setSelectedTab('suspended')}
        >
          <Text style={[styles.tabText, selectedTab === 'suspended' && styles.activeTabText]}>
            Suspended ({suspendedSellers})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sellers List */}
      <FlatList
        data={filteredSellers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sellerCard}
            onPress={() => {
              setSelectedSeller(item);
              setShowDetailModal(true);
            }}
            activeOpacity={0.7}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.sellerInfo}>
                <View style={styles.avatarContainer}>
                  <Icon name="account" size={24} color="#fff" />
                </View>
                <View>
                  <Text style={styles.sellerName}>{item.name}</Text>
                  <Text style={styles.sellerId}>ID: {item.id}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Icon name={getStatusIcon(item.status)} size={14} color="#fff" />
                <Text style={styles.statusText}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>

            {/* Details */}
            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Icon name="email" size={14} color="#8b5cf6" />
                <Text style={styles.detailText}>{item.email}</Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="store" size={14} color="#8b5cf6" />
                <Text style={styles.detailText}>{item.brandName}</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Icon name="package" size={14} color="#3b82f6" />
                  <Text style={styles.statValue}>{item.totalProducts} Products</Text>
                </View>

                <View style={styles.stat}>
                  <Icon name="star" size={14} color="#f59e0b" />
                  <Text style={styles.statValue}>
                    {item.rating > 0 ? item.rating : 'N/A'}
                  </Text>
                </View>

                <View style={styles.stat}>
                  <Icon name="shopping-bag" size={14} color="#10b981" />
                  <Text style={styles.statValue}>{item.totalSales} Sales</Text>
                </View>
              </View>
            </View>

            {/* Action Indicator */}
            {item.status === 'pending' && (
              <View style={styles.actionIndicator}>
                <Text style={styles.actionText}>Tap to verify</Text>
                <Icon name="chevron-right" size={20} color="#f59e0b" />
              </View>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                  <Icon name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Account Details</Text>
                <View style={{ width: 28 }} />
              </View>

              {selectedSeller && (
                <>
                  {/* Seller Header */}
                  <View style={styles.sellerHeaderSection}>
                    <View style={styles.largeAvatar}>
                      <Icon name="account" size={48} color="#fff" />
                    </View>
                    <Text style={styles.modalSellerName}>{selectedSeller.name}</Text>
                    <View
                      style={[
                        styles.largeStatusBadge,
                        { backgroundColor: getStatusColor(selectedSeller.status) },
                      ]}
                    >
                      <Icon name={getStatusIcon(selectedSeller.status)} size={16} color="#fff" />
                      <Text style={styles.largeStatusText}>
                        {selectedSeller.status.charAt(0).toUpperCase() +
                          selectedSeller.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  {/* Account Information */}
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Account Information</Text>

                    <View style={styles.infoItem}>
                      <Icon name="identifier" size={18} color="#8b5cf6" />
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Seller ID</Text>
                        <Text style={styles.infoValue}>{selectedSeller.id}</Text>
                      </View>
                    </View>

                    <View style={styles.infoItem}>
                      <Icon name="email" size={18} color="#8b5cf6" />
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{selectedSeller.email}</Text>
                      </View>
                    </View>

                    <View style={styles.infoItem}>
                      <Icon name="store" size={18} color="#8b5cf6" />
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Brand Name</Text>
                        <Text style={styles.infoValue}>{selectedSeller.brandName}</Text>
                      </View>
                    </View>

                    <View style={styles.infoItem}>
                      <Icon name="calendar" size={18} color="#8b5cf6" />
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Join Date</Text>
                        <Text style={styles.infoValue}>{selectedSeller.joinDate}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Performance Metrics */}
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Performance Metrics</Text>

                    <View style={styles.metricsGrid}>
                      <View style={styles.metricBox}>
                        <Icon name="package-outline" size={24} color="#3b82f6" />
                        <Text style={styles.metricValue}>{selectedSeller.totalProducts}</Text>
                        <Text style={styles.metricLabel}>Products Listed</Text>
                      </View>

                      <View style={styles.metricBox}>
                        <Icon name="star" size={24} color="#f59e0b" />
                        <Text style={styles.metricValue}>
                          {selectedSeller.rating > 0 ? selectedSeller.rating : 'N/A'}
                        </Text>
                        <Text style={styles.metricLabel}>Rating</Text>
                      </View>

                      <View style={styles.metricBox}>
                        <Icon name="shopping-bag" size={24} color="#10b981" />
                        <Text style={styles.metricValue}>{selectedSeller.totalSales}</Text>
                        <Text style={styles.metricLabel}>Total Sales</Text>
                      </View>
                    </View>
                  </View>

                  {/* Verification History */}
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Verification History</Text>

                    {selectedSeller.verificationRequests.map((request, index) => (
                      <View key={request.id} style={styles.verificationItem}>
                        <View style={styles.verificationTimeline}>
                          <View
                            style={[
                              styles.timelineDot,
                              {
                                backgroundColor:
                                  request.status === 'approved'
                                    ? '#10b981'
                                    : request.status === 'rejected'
                                    ? '#ef4444'
                                    : '#f59e0b',
                              },
                            ]}
                          />
                          {index < selectedSeller.verificationRequests.length - 1 && (
                            <View style={styles.timelineConnector} />
                          )}
                        </View>

                        <View style={styles.verificationContent}>
                          <View style={styles.verificationHeader}>
                            <Text style={styles.verificationDate}>{request.date}</Text>
                            <Text
                              style={[
                                styles.verificationStatus,
                                {
                                  color:
                                    request.status === 'approved'
                                      ? '#10b981'
                                      : request.status === 'rejected'
                                      ? '#ef4444'
                                      : '#f59e0b',
                                },
                              ]}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Text>
                          </View>
                          <Text style={styles.verificationNotes}>{request.notes}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Suspension Reason (if suspended) */}
                  {selectedSeller.status === 'suspended' && selectedSeller.suspensionReason && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Suspension Details</Text>
                      <View style={styles.suspensionBox}>
                        <Icon name="alert" size={20} color="#ef4444" />
                        <Text style={styles.suspensionText}>{selectedSeller.suspensionReason}</Text>
                      </View>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.actionButtonsContainer}>
                    {selectedSeller.status === 'pending' && (
                      <>
                        <TouchableOpacity
                          style={styles.rejectBtn}
                          onPress={() => setShowVerificationModal(true)}
                        >
                          <Icon name="close" size={18} color="#fff" />
                          <Text style={styles.rejectBtnText}>Reject</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.approveBtn}
                          onPress={() => setShowVerificationModal(true)}
                        >
                          <Icon name="check" size={18} color="#fff" />
                          <Text style={styles.approveBtnText}>Verify</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {selectedSeller.status === 'verified' && (
                      <TouchableOpacity
                        style={styles.suspendBtn}
                        onPress={() => setShowVerificationModal(true)}
                      >
                        <Icon name="lock" size={18} color="#fff" />
                        <Text style={styles.suspendBtnText}>Suspend</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Verification Modal */}
      <Modal
        visible={showVerificationModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <View style={styles.verificationModalOverlay}>
          <View style={styles.verificationModalContent}>
            <Text style={styles.verificationModalTitle}>
              {selectedSeller?.status === 'pending' ? 'Verification Action' : 'Suspension Reason'}
            </Text>

            <Text style={styles.verificationModalLabel}>Notes/Reason:</Text>
            <TextInput
              style={styles.verificationInput}
              placeholder="Enter notes or reason..."
              placeholderTextColor="#9ca3af"
              value={verificationNotes}
              onChangeText={setVerificationNotes}
              multiline
              numberOfLines={4}
            />

            <View style={styles.verificationButtonContainer}>
              <TouchableOpacity
                style={styles.verificationCancelBtn}
                onPress={() => {
                  setShowVerificationModal(false);
                  setVerificationNotes('');
                }}
              >
                <Text style={styles.verificationCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              {selectedSeller?.status === 'pending' ? (
                <>
                  <TouchableOpacity
                    style={styles.verificationRejectBtn}
                    onPress={() => handleRejectAccount(selectedSeller)}
                  >
                    <Text style={styles.verificationRejectBtnText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.verificationApproveBtn}
                    onPress={() => handleVerifyAccount(selectedSeller)}
                  >
                    <Text style={styles.verificationApproveBtnText}>Approve</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.verificationSuspendBtn}
                  onPress={() => handleSuspendAccount(selectedSeller)}
                >
                  <Text style={styles.verificationSuspendBtnText}>Suspend</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#8b5cf6',
    padding: 16,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e9d5ff',
  },
  notificationBadge: {
    backgroundColor: '#ef4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statsContainer: {
    gap: 12,
  },
  statCard: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  totalCard: {
    backgroundColor: '#3b82f6',
  },
  verifiedCard: {
    backgroundColor: '#10b981',
  },
  pendingCard: {
    backgroundColor: '#f59e0b',
  },
  suspendedCard: {
    backgroundColor: '#ef4444',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  sellerCard: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  sellerId: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#d1d5db',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 11,
    color: '#9ca3af',
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139,92,246,0.2)',
  },
  actionText: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#1e293b',
    marginTop: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sellerHeaderSection: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalSellerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  largeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  largeStatusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(139,92,246,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(139,92,246,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
  verificationItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  verificationTimeline: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineConnector: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(139,92,246,0.3)',
    marginVertical: 4,
  },
  verificationContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  verificationDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  verificationStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  verificationNotes: {
    fontSize: 12,
    color: '#d1d5db',
  },
  suspensionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 10,
    padding: 12,
  },
  suspensionText: {
    flex: 1,
    fontSize: 13,
    color: '#fca5a5',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  approveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  rejectBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  suspendBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  suspendBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verificationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  verificationModalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  verificationModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  verificationModalLabel: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 8,
  },
  verificationInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 13,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  verificationButtonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  verificationCancelBtn: {
    flex: 0.8,
    backgroundColor: '#4b5563',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  verificationCancelBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verificationRejectBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  verificationRejectBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verificationApproveBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  verificationApproveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verificationSuspendBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  verificationSuspendBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});