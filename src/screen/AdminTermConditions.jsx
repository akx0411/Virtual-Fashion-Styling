import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default function AdminTermConditions() {
  const [expandedTerms, setExpandedTerms] = useState({});
  const [agreeSeller, setAgreeSeller] = useState(false);

  const sellerTerms = [
    {
      id: 1,
      title: 'Outfit Posts Only',
      content: 'You can only upload posts for clothing and fashion items. Posts containing non-fashion items, services, or inappropriate content will be rejected immediately. This includes but is not limited to: accessories, shoes, bags, jewelry, and complete outfit combinations.'
    },
    {
      id: 2,
      title: 'Clear Images Required',
      content: 'All posts must include at least one clear, high-quality image of the outfit. Multiple angles are encouraged for better visibility and customer trust. Images must show the actual item, not stock photos. Minimum image resolution should be 800x600 pixels.'
    },
    {
      id: 3,
      title: 'Accurate Descriptions',
      content: 'Provide honest and detailed descriptions of the outfit including brand, size, color, condition, and any defects or wear. Misleading descriptions will result in post rejection. Include information about fabric material, washing instructions, and any special features.'
    },
    {
      id: 4,
      title: 'Reasonable Pricing',
      content: 'Prices must be fair and reasonable for the condition and quality of the outfit. Suspiciously high or predatory pricing may result in rejection. Consider market value and condition when setting prices. Clearly mention if the price is negotiable.'
    },
    {
      id: 5,
      title: 'No Prohibited Items',
      content: 'Do not post counterfeit items, damaged beyond repair outfits, or anything that violates platform guidelines. Repeated violations may result in account suspension. Never post items with brand name misrepresentation or fake designer items.'
    },
    {
      id: 6,
      title: 'Professional Conduct',
      content: 'Maintain professional behavior in all communications. Respect the admin review process and provide constructive information if your post is rejected. Respond promptly to buyer inquiries and maintain courteous interactions. Abusive behavior will result in warnings and potential account suspension.'
    },
    {
      id: 7,
      title: 'Post Accuracy',
      content: 'Ensure all details about size, color, brand, and condition match the images provided. If your post is rejected, review the admin feedback and make necessary corrections before resubmitting. Do not duplicate posts of the same item multiple times.'
    },
    {
      id: 8,
      title: 'Photo Guidelines',
      content: 'Photos should be well-lit and show the outfit clearly. Include close-up shots of any defects or wear. Do not edit photos excessively or use filters that misrepresent the actual appearance. Background should be clean and not distracting.'
    },
  ];

  const toggleTerm = (id) => {
    setExpandedTerms(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAccept = () => {
    if (agreeSeller) {
      Alert.alert('Success', '✅ Seller Terms Accepted! Your account is now active.', [
        { text: 'OK', onPress: () => {
          setAgreeSeller(false);
        }}
      ]);
    } else {
      Alert.alert('Error', 'Please agree to the terms to continue.');
    }
  };

  const handleCheckboxPress = () => {
    setAgreeSeller(!agreeSeller);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="shirt-outline" size={32} color="#fff" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Seller Terms & Conditions</Text>
            <Text style={styles.headerSubtitle}>Please read carefully before posting</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <View style={styles.introIcon}>
            <Icon name="information" size={28} color="#ec4899" />
          </View>
          <Text style={styles.introText}>
            By posting on our platform, you agree to follow all the terms and conditions listed below. Failure to comply may result in post rejection or account suspension.
          </Text>
        </View>

        {/* Terms List */}
        <View style={styles.termsList}>
          {sellerTerms.map((term, index) => (
            <View key={term.id} style={styles.termCard}>
              <TouchableOpacity
                style={styles.termHeader}
                onPress={() => toggleTerm(term.id)}
                activeOpacity={0.7}
              >
                <View style={styles.termTitleContainer}>
                  <View style={styles.termNumberBadge}>
                    <Text style={styles.termNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.termTitle}>{term.title}</Text>
                </View>
                <Icon 
                  name={expandedTerms[term.id] ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color="#f472b6" 
                />
              </TouchableOpacity>

              {expandedTerms[term.id] && (
                <View style={styles.termContent}>
                  <Text style={styles.termText}>{term.content}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Key Points Section */}
        <View style={styles.keyPointsSection}>
          <Text style={styles.keyPointsTitle}>Key Points to Remember:</Text>
          
          <View style={styles.keyPoint}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.keyPointText}>Only fashion and clothing items allowed</Text>
          </View>

          <View style={styles.keyPoint}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.keyPointText}>High-quality, clear images are mandatory</Text>
          </View>

          <View style={styles.keyPoint}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.keyPointText}>Be honest about item condition and description</Text>
          </View>

          <View style={styles.keyPoint}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.keyPointText}>Price items fairly and reasonably</Text>
          </View>

          <View style={styles.keyPoint}>
            <Icon name="close-circle" size={20} color="#ef4444" />
            <Text style={styles.keyPointText}>No counterfeit or damaged items</Text>
          </View>

          <View style={styles.keyPoint}>
            <Icon name="close-circle" size={20} color="#ef4444" />
            <Text style={styles.keyPointText}>Maintain professional communication</Text>
          </View>
        </View>

        {/* Agreement Section */}
        <TouchableOpacity 
          style={styles.agreementSection}
          onPress={handleCheckboxPress}
          activeOpacity={0.7}
        >
          <View style={styles.checkboxContainer}>
            <View style={[styles.customCheckbox, agreeSeller && styles.customCheckboxChecked]}>
              {agreeSeller && (
                <Icon name="check" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.agreementText}>
              I have read and agree to all the Seller Terms & Conditions. I understand that posting non-fashion items or violating these terms may result in rejection or account suspension.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.declineButton}
            onPress={() => Alert.alert('Cancelled', 'You must accept the terms to continue.')}
            activeOpacity={0.7}
          >
            <Icon name="close" size={20} color="#fff" />
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.acceptButton, 
              !agreeSeller && styles.acceptButtonDisabled
            ]}
            onPress={handleAccept}
            disabled={!agreeSeller}
            activeOpacity={0.7}
          >
            <Icon name="check" size={20} color="#fff" />
            <Text style={styles.acceptButtonText}>Accept & Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#db2777',
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#fce7f3',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  introSection: {
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    borderWidth: 1,
    borderColor: '#ec4899',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 12,
  },
  introIcon: {
    paddingTop: 2,
  },
  introText: {
    flex: 1,
    fontSize: 13,
    color: '#f472b6',
    lineHeight: 18,
    fontWeight: '500',
  },
  termsList: {
    gap: 10,
    marginBottom: 20,
  },
  termCard: {
    borderWidth: 1,
    borderColor: 'rgba(244, 114, 182, 0.4)',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(219, 39, 119, 0.08)',
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 72, 153, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  termTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  termNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  termTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  termContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(244, 114, 182, 0.3)',
  },
  termText: {
    fontSize: 13,
    color: '#e0e7ff',
    lineHeight: 19,
  },
  keyPointsSection: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  keyPointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 12,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  keyPointText: {
    fontSize: 13,
    color: '#d1fae5',
    lineHeight: 18,
    flex: 1,
    fontWeight: '500',
  },
  agreementSection: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderWidth: 1,
    borderColor: '#ec4899',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    backgroundColor: 'transparent',
  },
  customCheckboxChecked: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  agreementText: {
    flex: 1,
    fontSize: 13,
    color: '#f3f4f6',
    lineHeight: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#4b5563',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  declineButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#ec4899',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  acceptButtonDisabled: {
    backgroundColor: '#6b7280',
    opacity: 0.5,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});