import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'New Feature: Advanced Search',
      type: 'feature',
      description: 'We have launched an advanced search feature for buyers.',
      fullContent: 'We are excited to announce the launch of our new Advanced Search feature! This feature allows buyers to search for outfits using multiple filters including brand, size, color, price range, and condition. Sellers can now reach more customers who are specifically looking for their items.',
      date: '2024-11-15',
      time: '10:30 AM',
      icon: 'star',
      color: '#3b82f6',
      priority: 'high',
      status: 'published',
      createdBy: 'Admin',
      views: 234,
      recipients: 15,
    },
    {
      id: 2,
      title: 'Policy Update: Pricing Guidelines',
      type: 'policy',
      description: 'Updated pricing policy for all sellers on the platform.',
      fullContent: 'Effective immediately, we have implemented new pricing guidelines to ensure fair pricing for our customers. All clothing items must be priced 30-50% lower than their original retail price.',
      date: '2024-11-12',
      time: '2:15 PM',
      icon: 'file-document',
      color: '#ec4899',
      priority: 'high',
      status: 'published',
      createdBy: 'Admin',
      views: 567,
      recipients: 15,
    },
    {
      id: 3,
      title: 'System Maintenance Alert',
      type: 'maintenance',
      description: 'Scheduled maintenance on November 20th from 2 AM to 4 AM.',
      fullContent: 'We will be performing scheduled maintenance on our platform to improve performance and security. During this time, the platform will be temporarily unavailable. We apologize for any inconvenience.',
      date: '2024-11-10',
      time: '4:45 PM',
      icon: 'wrench',
      color: '#f59e0b',
      priority: 'critical',
      status: 'published',
      createdBy: 'Admin',
      views: 890,
      recipients: 15,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedTab, setSelectedTab] = useState('published');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    type: 'feature',
    description: '',
    fullContent: '',
    priority: 'medium',
  });

  const announcementTypes = [
    { id: 'feature', label: 'New Feature', icon: 'star', color: '#3b82f6' },
    { id: 'policy', label: 'Policy Update', icon: 'file-document', color: '#ec4899' },
    { id: 'maintenance', label: 'Maintenance', icon: 'wrench', color: '#f59e0b' },
    { id: 'security', label: 'Security Alert', icon: 'lock', color: '#10b981' },
    { id: 'update', label: 'System Update', icon: 'refresh', color: '#8b5cf6' },
    { id: 'warning', label: 'Important Notice', icon: 'alert-circle', color: '#ef4444' },
  ];

  const handleCreateAnnouncement = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.fullContent.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const typeData = announcementTypes.find(t => t.id === formData.type);
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const newAnnouncement = {
      id: announcements.length + 1,
      title: formData.title,
      type: formData.type,
      description: formData.description,
      fullContent: formData.fullContent,
      date,
      time,
      icon: typeData.icon,
      color: typeData.color,
      priority: formData.priority,
      status: 'published',
      createdBy: 'Admin',
      views: 0,
      recipients: 15,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    
    // Show notification
    Alert.alert('Success', '✅ Announcement published!\nAll sellers have been notified.');
    
    // Reset form and close modal
    setFormData({
      title: '',
      type: 'feature',
      description: '',
      fullContent: '',
      priority: 'medium',
    });
    setShowCreateModal(false);
  };

  const handleDeleteAnnouncement = (id) => {
    Alert.alert(
      'Delete Announcement',
      'Are you sure you want to delete this announcement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setAnnouncements(announcements.filter(a => a.id !== id));
            setShowDetailModal(false);
            Alert.alert('Deleted', 'Announcement has been deleted.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getTypeData = (typeId) => {
    return announcementTypes.find(t => t.id === typeId);
  };

  const filteredAnnouncements = announcements.filter(
    a => selectedTab === 'published' ? a.status === 'published' : true
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="megaphone" size={32} color="#fff" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Announcements</Text>
            <Text style={styles.headerSubtitle}>Manage platform announcements</Text>
          </View>
        </View>
      </View>

      {/* Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Icon name="plus" size={24} color="#fff" />
        <Text style={styles.createButtonText}>Create Announcement</Text>
      </TouchableOpacity>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.totalCard]}>
          <Icon name="megaphone-outline" size={20} color="#fff" />
          <Text style={styles.statNumber}>{announcements.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={[styles.statCard, styles.publishedCard]}>
          <Icon name="check-circle" size={20} color="#fff" />
          <Text style={styles.statNumber}>
            {announcements.filter(a => a.status === 'published').length}
          </Text>
          <Text style={styles.statLabel}>Published</Text>
        </View>

        <View style={[styles.statCard, styles.viewsCard]}>
          <Icon name="eye" size={20} color="#fff" />
          <Text style={styles.statNumber}>
            {announcements.reduce((sum, a) => sum + a.views, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Views</Text>
        </View>
      </View>

      {/* Announcements List */}
      <FlatList
        data={filteredAnnouncements}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const typeData = getTypeData(item.type);
          return (
            <TouchableOpacity
              style={styles.announcementCard}
              onPress={() => {
                setSelectedAnnouncement(item);
                setShowDetailModal(true);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: typeData.color + '20' }]}>
                <Icon name={typeData.icon} size={28} color={typeData.color} />
              </View>

              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  {item.priority === 'critical' && (
                    <View style={styles.criticalBadge}>
                      <Text style={styles.badgeText}>CRITICAL</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.footerItem}>
                    <Icon name="calendar-outline" size={12} color="#9ca3af" />
                    <Text style={styles.footerText}>{item.date}</Text>
                  </View>

                  <View style={styles.footerItem}>
                    <Icon name="eye" size={12} color="#9ca3af" />
                    <Text style={styles.footerText}>{item.views} views</Text>
                  </View>

                  <View style={styles.footerItem}>
                    <Icon name="account-multiple" size={12} color="#9ca3af" />
                    <Text style={styles.footerText}>{item.recipients} sellers</Text>
                  </View>
                </View>
              </View>

              <Icon name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="megaphone-off" size={64} color="#6b7280" />
            <Text style={styles.emptyTitle}>No Announcements</Text>
            <Text style={styles.emptySubtitle}>
              Create your first announcement to get started
            </Text>
          </View>
        }
      />

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <Icon name="close" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Create Announcement</Text>
                <View style={{ width: 28 }} />
              </View>

              {/* Title */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter announcement title..."
                  placeholderTextColor="#9ca3af"
                  value={formData.title}
                  onChangeText={(text) =>
                    setFormData({ ...formData, title: text })
                  }
                  maxLength={100}
                />
                <Text style={styles.charCount}>
                  {formData.title.length}/100
                </Text>
              </View>

              {/* Type Selection */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Announcement Type</Text>
                <View style={styles.typeGrid}>
                  {announcementTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.typeOption,
                        formData.type === type.id && styles.typeOptionActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, type: type.id })
                      }
                    >
                      <Icon
                        name={type.icon}
                        size={24}
                        color={formData.type === type.id ? type.color : '#9ca3af'}
                      />
                      <Text
                        style={[
                          styles.typeLabel,
                          formData.type === type.id && styles.typeLabelActive,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Priority */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Priority</Text>
                <View style={styles.priorityRow}>
                  {['low', 'medium', 'high', 'critical'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        formData.priority === priority && styles.priorityButtonActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, priority })
                      }
                    >
                      <Text
                        style={[
                          styles.priorityButtonText,
                          formData.priority === priority &&
                          styles.priorityButtonTextActive,
                        ]}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Description */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Short Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter short description (appears in list)..."
                  placeholderTextColor="#9ca3af"
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
                <Text style={styles.charCount}>
                  {formData.description.length}/200
                </Text>
              </View>

              {/* Full Content */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Full Content</Text>
                <TextInput
                  style={[styles.input, styles.textArea, styles.largeTextArea]}
                  placeholder="Enter detailed announcement content..."
                  placeholderTextColor="#9ca3af"
                  value={formData.fullContent}
                  onChangeText={(text) =>
                    setFormData({ ...formData, fullContent: text })
                  }
                  multiline
                  numberOfLines={6}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowCreateModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.publishButton}
                  onPress={handleCreateAnnouncement}
                >
                  <Icon name="send" size={20} color="#fff" />
                  <Text style={styles.publishButtonText}>Publish</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
                <Text style={styles.modalTitle}>Announcement Details</Text>
                <TouchableOpacity
                  onPress={() =>
                    selectedAnnouncement &&
                    handleDeleteAnnouncement(selectedAnnouncement.id)
                  }
                >
                  <Icon name="delete" size={28} color="#ef4444" />
                </TouchableOpacity>
              </View>

              {selectedAnnouncement && (
                <>
                  {/* Header Section */}
                  <View style={styles.detailHeaderSection}>
                    <View
                      style={[
                        styles.detailIconBox,
                        { backgroundColor: selectedAnnouncement.color + '20' },
                      ]}
                    >
                      <Icon
                        name={selectedAnnouncement.icon}
                        size={48}
                        color={selectedAnnouncement.color}
                      />
                    </View>

                    <Text style={styles.detailTitle}>
                      {selectedAnnouncement.title}
                    </Text>

                    {selectedAnnouncement.priority === 'critical' && (
                      <View style={styles.criticalBadgeLarge}>
                        <Icon name="alert" size={16} color="#fff" />
                        <Text style={styles.criticalBadgeText}>Critical Priority</Text>
                      </View>
                    )}
                  </View>

                  {/* Meta Info */}
                  <View style={styles.metaSection}>
                    <View style={styles.metaItem}>
                      <Icon name="calendar" size={20} color="#8b5cf6" />
                      <View>
                        <Text style={styles.metaLabel}>Published Date</Text>
                        <Text style={styles.metaValue}>
                          {selectedAnnouncement.date} at{' '}
                          {selectedAnnouncement.time}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.metaItem}>
                      <Icon name="eye" size={20} color="#8b5cf6" />
                      <View>
                        <Text style={styles.metaLabel}>Views</Text>
                        <Text style={styles.metaValue}>
                          {selectedAnnouncement.views} views
                        </Text>
                      </View>
                    </View>

                    <View style={styles.metaItem}>
                      <Icon
                        name="account-multiple"
                        size={20}
                        color="#8b5cf6"
                      />
                      <View>
                        <Text style={styles.metaLabel}>Recipients</Text>
                        <Text style={styles.metaValue}>
                          {selectedAnnouncement.recipients} sellers notified
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Content */}
                  <View style={styles.contentSection}>
                    <Text style={styles.contentTitle}>Full Content</Text>
                    <Text style={styles.contentText}>
                      {selectedAnnouncement.fullContent}
                    </Text>
                  </View>

                  {/* Close Button */}
                  <TouchableOpacity
                    style={styles.closeDetailButton}
                    onPress={() => setShowDetailModal(false)}
                  >
                    <Text style={styles.closeDetailButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
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
    alignItems: 'center',
    gap: 12,
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
  createButton: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalCard: {
    backgroundColor: '#3b82f6',
  },
  publishedCard: {
    backgroundColor: '#10b981',
  },
  viewsCard: {
    backgroundColor: '#f59e0b',
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
  listContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  announcementCard: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  criticalBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#d1d5db',
    marginBottom: 6,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#1e293b',
    marginTop: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
  formSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 13,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingVertical: 12,
    minHeight: 80,
  },
  largeTextArea: {
    minHeight: 120,
  },
  charCount: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeOption: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  typeOptionActive: {
    backgroundColor: 'rgba(139,92,246,0.2)',
    borderColor: 'rgba(139,92,246,0.5)',
  },
  typeLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
  typeLabelActive: {
    color: '#fff',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: 'rgba(139,92,246,0.3)',
    borderColor: '#8b5cf6',
  },
  priorityButtonText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#4b5563',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  publishButton: {
    flex: 1,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailHeaderSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  detailIconBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  criticalBadgeLarge: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    alignItems: 'center',
  },
  criticalBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  metaSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(139,92,246,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  metaLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 22,
  },
  closeDetailButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeDetailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});