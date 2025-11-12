import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function SellerAnalytics() {
  const [sellers, setSellers] = useState([
    {
      id: 'S001',
      name: 'Ayesha Ahmed',
      brandName: 'Ayesha Fashion',
      email: 'ayesha.ahmed@email.com',
      totalProducts: 12,
      totalSales: 45,
      revenue: 180500,
      rating: 4.8,
      joinDate: '2024-09-20',
      monthlySales: [5, 8, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35],
      monthlyRevenue: [12000, 18000, 25000, 35000, 42000, 48000, 52000, 58000, 65000, 72000, 78000, 85000],
      productCategories: [
        { name: 'Dresses', count: 8, percentage: 67 },
        { name: 'Tops', count: 2, percentage: 17 },
        { name: 'Accessories', count: 2, percentage: 17 },
      ],
      monthlyViews: [150, 220, 310, 420, 550, 680, 750, 880, 950, 1100, 1250, 1400],
      conversionRate: 3.2,
      avgOrderValue: 4011,
    },
    {
      id: 'S003',
      name: 'Sara Ali',
      brandName: 'Sara Styles',
      email: 'sara.ali@email.com',
      totalProducts: 28,
      totalSales: 120,
      revenue: 480000,
      rating: 4.9,
      joinDate: '2024-08-10',
      monthlySales: [15, 22, 30, 38, 45, 52, 60, 68, 75, 82, 90, 98],
      monthlyRevenue: [45000, 65000, 85000, 110000, 130000, 150000, 175000, 195000, 220000, 240000, 260000, 280000],
      productCategories: [
        { name: 'Dresses', count: 15, percentage: 54 },
        { name: 'Tops', count: 8, percentage: 29 },
        { name: 'Accessories', count: 5, percentage: 18 },
      ],
      monthlyViews: [450, 650, 890, 1150, 1400, 1650, 1950, 2200, 2500, 2800, 3100, 3400],
      conversionRate: 4.1,
      avgOrderValue: 4000,
    },
    {
      id: 'S005',
      name: 'Hira Malik',
      brandName: 'Hira Fashion Hub',
      email: 'hira.malik@email.com',
      totalProducts: 18,
      totalSales: 76,
      revenue: 304000,
      rating: 4.7,
      joinDate: '2024-09-15',
      monthlySales: [8, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72],
      monthlyRevenue: [24000, 36000, 54000, 72000, 90000, 108000, 126000, 144000, 162000, 180000, 198000, 216000],
      productCategories: [
        { name: 'Dresses', count: 11, percentage: 61 },
        { name: 'Tops', count: 5, percentage: 28 },
        { name: 'Accessories', count: 2, percentage: 11 },
      ],
      monthlyViews: [250, 380, 550, 750, 950, 1150, 1400, 1650, 1900, 2150, 2400, 2650],
      conversionRate: 3.5,
      avgOrderValue: 4000,
    },
  ]);

  const [selectedSeller, setSelectedSeller] = useState(sellers[0]);
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="chart-line" size={32} color="#fff" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Analytics</Text>
            <Text style={styles.headerSubtitle}>Seller Performance</Text>
          </View>
        </View>
      </View>

      {/* Seller Selection */}
      <TouchableOpacity
        style={styles.sellerSelector}
        onPress={() => setShowDetailModal(true)}
      >
        <View style={styles.selectorContent}>
          <View style={styles.selectorAvatar}>
            <Icon name="store" size={20} color="#fff" />
          </View>
          <View style={styles.selectorText}>
            <Text style={styles.selectorLabel}>Seller</Text>
            <Text style={styles.selectorName}>{selectedSeller.name}</Text>
          </View>
        </View>
        <Icon name="chevron-down" size={24} color="#8b5cf6" />
      </TouchableOpacity>

      {/* Key Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, styles.metricCard1]}>
          <Icon name="package-variant" size={28} color="#fff" />
          <Text style={styles.metricValue}>{selectedSeller.totalProducts}</Text>
          <Text style={styles.metricLabel}>Products</Text>
        </View>

        <View style={[styles.metricCard, styles.metricCard2]}>
          <Icon name="shopping-bag" size={28} color="#fff" />
          <Text style={styles.metricValue}>{selectedSeller.totalSales}</Text>
          <Text style={styles.metricLabel}>Sales</Text>
        </View>

        <View style={[styles.metricCard, styles.metricCard3]}>
          <Icon name="currency-pkr" size={28} color="#fff" />
          <Text style={styles.metricValue}>
            {(selectedSeller.revenue / 1000).toFixed(0)}K
          </Text>
          <Text style={styles.metricLabel}>Revenue</Text>
        </View>

        <View style={[styles.metricCard, styles.metricCard4]}>
          <Icon name="star" size={28} color="#fff" />
          <Text style={styles.metricValue}>{selectedSeller.rating}</Text>
          <Text style={styles.metricLabel}>Rating</Text>
        </View>
      </View>

      {/* Stats Section */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.statsContainer}>
        
        {/* Sales Stats */}
        <View style={styles.statBox}>
          <View style={styles.statBoxHeader}>
            <Icon name="trending-up" size={24} color="#10b981" />
            <Text style={styles.statBoxTitle}>Monthly Sales</Text>
          </View>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {selectedSeller.monthlySales.map((sale, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (sale / Math.max(...selectedSeller.monthlySales)) * 80,
                        backgroundColor: '#10b981',
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.statBoxContent}>
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>Total</Text>
              <Text style={styles.statItemValue}>{selectedSeller.totalSales}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>Average</Text>
              <Text style={styles.statItemValue}>
                {Math.round(selectedSeller.totalSales / 12)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>Highest</Text>
              <Text style={styles.statItemValue}>
                {Math.max(...selectedSeller.monthlySales)}
              </Text>
            </View>
          </View>
        </View>

        {/* Revenue Stats */}
        <View style={styles.statBox}>
          <View style={styles.statBoxHeader}>
            <Icon name="cash" size={24} color="#3b82f6" />
            <Text style={styles.statBoxTitle}>Monthly Revenue</Text>
          </View>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {selectedSeller.monthlyRevenue.map((revenue, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (revenue / Math.max(...selectedSeller.monthlyRevenue)) * 80,
                        backgroundColor: '#3b82f6',
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.statBoxContent}>
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>Total</Text>
              <Text style={styles.statItemValue}>
                {(selectedSeller.revenue / 1000).toFixed(0)}K
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>Average</Text>
              <Text style={styles.statItemValue}>
                {(selectedSeller.revenue / 12 / 1000).toFixed(0)}K
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>Avg Order</Text>
              <Text style={styles.statItemValue}>
                {selectedSeller.avgOrderValue.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Views Stats */}
        <View style={styles.statBox}>
          <View style={styles.statBoxHeader}>
            <Icon name="eye" size={24} color="#f59e0b" />
            <Text style={styles.statBoxTitle}>Monthly Views</Text>
          </View>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {selectedSeller.monthlyViews.map((views, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (views / Math.max(...selectedSeller.monthlyViews)) * 80,
                        backgroundColor: '#f59e0b',
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.statBoxContent}>
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>Total</Text>
              <Text style={styles.statItemValue}>
                {Math.round(
                  selectedSeller.monthlyViews.reduce((a, b) => a + b, 0) / 1000
                )}K
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>Average</Text>
              <Text style={styles.statItemValue}>
                {Math.round(
                  selectedSeller.monthlyViews.reduce((a, b) => a + b, 0) /
                    selectedSeller.monthlyViews.length
                )}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statItemLabel}>Conversion</Text>
              <Text style={styles.statItemValue}>{selectedSeller.conversionRate}%</Text>
            </View>
          </View>
        </View>

        {/* Product Categories */}
        <View style={styles.statBox}>
          <View style={styles.statBoxHeader}>
            <Icon name="shapes" size={24} color="#8b5cf6" />
            <Text style={styles.statBoxTitle}>Product Categories</Text>
          </View>
          <View style={styles.categoriesContainer}>
            {selectedSeller.productCategories.map((cat, index) => (
              <View key={index} style={styles.categoryRow}>
                <View
                  style={[
                    styles.categoryDot,
                    {
                      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'][
                        index % 3
                      ],
                    },
                  ]}
                />
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryMeta}>
                    {cat.count} items • {cat.percentage}%
                  </Text>
                </View>
                <View
                  style={[
                    styles.categoryProgress,
                    {
                      width: `${cat.percentage}%`,
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Performance Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Icon name="account-star" size={20} color="#8b5cf6" />
            <View>
              <Text style={styles.summaryLabel}>Rating</Text>
              <Text style={styles.summaryValue}>{selectedSeller.rating}/5.0</Text>
            </View>
          </View>
          <View style={styles.summaryItem}>
            <Icon name="calendar" size={20} color="#8b5cf6" />
            <View>
              <Text style={styles.summaryLabel}>Member Since</Text>
              <Text style={styles.summaryValue}>{selectedSeller.joinDate}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Seller Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Icon name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Seller</Text>
              <View style={{ width: 28 }} />
            </View>

            <FlatList
              data={sellers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.sellerOption,
                    selectedSeller.id === item.id &&
                      styles.sellerOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedSeller(item);
                    setShowDetailModal(false);
                  }}
                >
                  <View style={styles.optionAvatar}>
                    <Icon name="store" size={24} color="#fff" />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionName}>{item.name}</Text>
                    <Text style={styles.optionBrand}>{item.brandName}</Text>
                    <View style={styles.optionStats}>
                      <Text style={styles.optionStat}>
                        📦 {item.totalProducts}
                      </Text>
                      <Text style={styles.optionStat}>
                        🛍️ {item.totalSales}
                      </Text>
                      <Text style={styles.optionStat}>⭐ {item.rating}</Text>
                    </View>
                  </View>
                  {selectedSeller.id === item.id && (
                    <View style={styles.checkMark}>
                      <Icon name="check" size={24} color="#10b981" />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e9d5ff',
    marginTop: 2,
  },
  sellerSelector: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: 'rgba(139,92,246,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  selectorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorText: {
    flex: 1,
  },
  selectorLabel: {
    fontSize: 11,
    color: '#9ca3af',
  },
  selectorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    justifyContent: 'space-between',
  },
  metricCard: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  metricCard1: {
    backgroundColor: '#3b82f6',
  },
  metricCard2: {
    backgroundColor: '#10b981',
  },
  metricCard3: {
    backgroundColor: '#f59e0b',
  },
  metricCard4: {
    backgroundColor: '#8b5cf6',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 3,
    textAlign: 'center',
    fontWeight: '500',
  },
  statsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statBox: {
    backgroundColor: 'rgba(139,92,246,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  statBoxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  statBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoriesContainer: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  categoryMeta: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  categoryProgress: {
    height: 3,
    backgroundColor: 'rgba(139,92,246,0.5)',
    borderRadius: 2,
    minWidth: 20,
  },
  summaryBox: {
    backgroundColor: 'rgba(139,92,246,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    elevation: 2,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    marginTop: 2,
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
  sellerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  sellerOptionActive: {
    backgroundColor: 'rgba(139,92,246,0.15)',
  },
  optionAvatar: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  optionBrand: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  optionStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  optionStat: {
    fontSize: 11,
    color: '#9ca3af',
  },
  checkMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    marginBottom: 12,
    paddingVertical: 12,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    paddingHorizontal: 4,
  },
  barWrapper: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  bar: {
    width: '80%',
    borderRadius: 4,
    minHeight: 5,
  },
  barLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
  },
  statItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: 'rgba(139,92,246,0.2)',
  },
});