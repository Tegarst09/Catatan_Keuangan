import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// === DATA DUMMY ===
type FeatherIconName = keyof typeof Feather.glyphMap;

interface SummaryItem {
  id: string;
  icon: FeatherIconName;
  title: string;
  amount: string;
  color: string;
}

interface TransactionItem {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
}

const SUMMARY_DATA: SummaryItem[] = [
  { id: '1', icon: 'coffee', title: 'Makan', amount: 'Rp300.000', color: '#B45309' }, 
  { id: '2', icon: 'truck', title: 'Transportasi', amount: 'Rp150.000', color: '#1D4ED8' }, 
  { id: '3', icon: 'book', title: 'Kebutuhan Kuliah', amount: 'Rp200.000', color: '#6D28D9' },
  { id: '4', icon: 'grid', title: 'Lainnya', amount: 'Rp100.000', color: '#374151' },
];

const TRANSACTIONS_DATA: TransactionItem[] = [
  { id: 't1', title: 'Makan Siang', category: 'Makan', date: 'Hari ini, 12:30', amount: '-Rp25.000', type: 'expense' },
  { id: 't2', title: 'Uang Saku', category: 'Pemasukan', date: '27 Sep, 09:00', amount: '+Rp500.000', type: 'income' },
  { id: 't3', title: 'Transportasi', category: 'Transportasi', date: '27 Sep, 15:45', amount: '-Rp15.000', type: 'expense' },
];

// === COMPONENT: Header ===
const Header = ({ isSmallScreen }: { isSmallScreen: boolean }) => (
  <View style={styles.header}>
    <View 
      accessible={true} 
      accessibilityRole="header" 
      accessibilityLabel="Aplikasi SakuIn. Halo, Mahasiswa!"
    >
      <Text style={styles.appName}>SakuIn</Text>
      <Text style={[styles.greeting, isSmallScreen && { fontSize: 20 }]}>Halo, Mahasiswa! 👋</Text>
    </View>
    <Pressable 
      style={styles.notificationBtn} 
      onPress={() => console.log('Notifikasi')}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Notifikasi"
      accessibilityHint="Membuka daftar pemberitahuan terbaru"
    >
      <Feather name="bell" size={24} color="#1F2937" />
      <View style={styles.notificationDot} />
    </Pressable>
  </View>
);

// === COMPONENT: BalanceCard ===
const BalanceCard = ({ isTablet }: { isTablet: boolean }) => (
  <View 
    style={[styles.mainCard, isTablet && styles.mainCardTablet]}
    accessible={true}
    accessibilityLabel="Kartu Saldo Utama. Total Saldo 1 Juta 250 Ribu Rupiah. Pemasukan 2 Juta Rupiah. Pengeluaran 750 Ribu Rupiah."
  >
    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.cardTitle}>Total Saldo</Text>
        <Text style={styles.balanceText} numberOfLines={1} adjustsFontSizeToFit>Rp1.250.000</Text>
      </View>
      <Ionicons name="wallet-outline" size={40} color="#FFFFFF" />
    </View>

    <View style={styles.cardDivider} />

    <View style={styles.cardStats}>
      <View style={styles.statItem}>
        <View style={styles.statIconContainerIncome}>
          <Feather name="arrow-down-left" size={20} color="#065F46" /> 
        </View>
        <View style={styles.statTextContainer}>
          <Text style={styles.statLabel}>Pemasukan (+)</Text>
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>Rp2.000.000</Text>
        </View>
      </View>
      
      <View style={styles.statItem}>
        <View style={styles.statIconContainerExpense}>
          <Feather name="arrow-up-right" size={20} color="#991B1B" /> 
        </View>
        <View style={styles.statTextContainer}>
          <Text style={styles.statLabel}>Pengeluaran (-)</Text>
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>Rp750.000</Text>
        </View>
      </View>
    </View>
  </View>
);

// === COMPONENT: ActionButtons ===
const ActionButtons = ({ isSmallScreen, isLandscape }: { isSmallScreen: boolean, isLandscape: boolean }) => {
  const handleAddIncome = () => console.log('Tombol + Pemasukan ditekan');
  const handleAddExpense = () => console.log('Tombol - Pengeluaran ditekan');
  
  return (
    <View style={[styles.actionContainer, isSmallScreen && !isLandscape && { flexDirection: 'column' }]}>
      <Pressable 
        style={[styles.actionButton, styles.btnIncome]} 
        onPress={handleAddIncome}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Tambah Pemasukan"
        accessibilityHint="Membuka form untuk menambahkan transaksi pemasukan"
      >
        <Feather name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.actionButtonText}>Pemasukan</Text>
      </Pressable>
      
      <Pressable 
        style={[styles.actionButton, styles.btnExpense]} 
        onPress={handleAddExpense}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Tambah Pengeluaran"
        accessibilityHint="Membuka form untuk menambahkan transaksi pengeluaran"
      >
        <Feather name="minus" size={20} color="#B91C1C" /> 
        <Text style={[styles.actionButtonText, styles.textExpense]}>Pengeluaran</Text>
      </Pressable>
    </View>
  );
};

// === COMPONENT: ExpenseSummary ===
const ExpenseSummary = ({ isTablet, isLandscape }: { isTablet: boolean, isLandscape: boolean }) => {
  const useGrid = isTablet || isLandscape;
  
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle} accessible={true} accessibilityRole="header">Ringkasan Pengeluaran</Text>
      <View style={[styles.summaryCard, useGrid && styles.summaryCardGrid]}>
        {SUMMARY_DATA.map((item, index) => (
          <View 
            key={item.id} 
            style={[
              styles.summaryItem, 
              useGrid && styles.summaryItemGrid,
              !useGrid && index !== SUMMARY_DATA.length - 1 && styles.borderBottom
            ]}
            accessible={true}
            accessibilityLabel={`Ringkasan ${item.title}: ${item.amount}`}
          >
            <View style={styles.summaryItemLeft}>
              <View style={[styles.summaryIconContainer, { backgroundColor: `${item.color}20` }]}>
                <Feather name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.summaryItemTitle} numberOfLines={1}>{item.title}</Text>
            </View>
            <Text style={[styles.summaryItemAmount, useGrid && { marginTop: 4 }]}>{item.amount}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// === COMPONENT: TransactionList ===
const TransactionList = () => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle} accessible={true} accessibilityRole="header">Transaksi Terbaru</Text>
      <Pressable 
        onPress={() => console.log('Lihat Semua Transaksi')}
        style={styles.seeAllBtn}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Lihat Semua Transaksi Terbaru"
        accessibilityHint="Navigasi ke daftar seluruh transaksi"
      >
        <Text style={styles.seeAllText}>Lihat Semua</Text>
      </Pressable>
    </View>
    
    {TRANSACTIONS_DATA.map((item) => (
      <View 
        key={item.id} 
        style={styles.transactionItem}
        accessible={true}
        accessibilityLabel={`Transaksi ${item.title}, kategori ${item.category}, pada ${item.date}. Nominal: ${item.amount}.`}
      >
        <View style={styles.transactionLeft}>
          <View style={[
            styles.transactionIcon, 
            { backgroundColor: item.type === 'income' ? '#E0F2FE' : '#FCE7F3' }
          ]}>
            <Feather 
              name={item.type === 'income' ? 'arrow-down-left' : 'arrow-up-right'} 
              size={24} 
              color={item.type === 'income' ? '#0369A1' : '#BE123C'} 
            />
          </View>
          <View style={styles.transactionTextContainer}>
            <Text style={styles.transactionTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.transactionCategory} numberOfLines={1}>{item.category} • {item.date}</Text>
          </View>
        </View>
        <Text style={[
          styles.transactionAmount, 
          { color: item.type === 'income' ? '#047857' : '#B91C1C' }
        ]}>
          {item.amount}
        </Text>
      </View>
    ))}
  </View>
);

// === COMPONENT: BottomNavigation ===
const BottomNavigation = ({ isTablet }: { isTablet: boolean }) => (
  <View style={styles.bottomNavContainer}>
    <View style={[styles.bottomNav, isTablet && styles.bottomNavTablet]}>
      <BottomNavItem icon="home" label="Beranda" active />
      <BottomNavItem icon="clock" label="Riwayat" />
      <BottomNavItem icon="pie-chart" label="Ringkasan" />
      <BottomNavItem icon="user" label="Profil" />
    </View>
  </View>
);

const BottomNavItem = ({ icon, label, active }: { icon: FeatherIconName, label: string, active?: boolean }) => (
  <Pressable 
    style={styles.navItem} 
    onPress={() => console.log(`Navigasi ke ${label}`)}
    accessible={true}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
    accessibilityLabel={`Menu ${label}`}
  >
    <Feather name={icon} size={28} color={active ? '#047857' : '#4B5563'} />
    <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
  </Pressable>
);

// === MAIN SCREEN ===
export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  
  const isSmallScreen = width < 360;
  const isTablet = width >= 768;
  const isLandscape = width > height;

  const contentPadding = isTablet ? 40 : (isSmallScreen ? 16 : 20);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer, 
          { padding: contentPadding, paddingTop: Platform.OS === 'android' ? 40 : contentPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.contentWrapper, isTablet && styles.contentWrapperTablet]}>
          <Header isSmallScreen={isSmallScreen} />
          
          <View style={isLandscape && isTablet ? styles.landscapeRow : null}>
            <View style={isLandscape && isTablet ? { flex: 1, marginRight: 24 } : null}>
              <BalanceCard isTablet={isTablet} />
              <ActionButtons isSmallScreen={isSmallScreen} isLandscape={isLandscape} />
            </View>
            
            <View style={isLandscape && isTablet ? { flex: 1 } : null}>
              <ExpenseSummary isTablet={isTablet} isLandscape={isLandscape} />
              <TransactionList />
            </View>
          </View>
          
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      <BottomNavigation isTablet={isTablet} />
    </SafeAreaView>
  );
}

// === STYLESHEET ===
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Slightly darker than F5F7FA for better contrast with white cards
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  contentWrapperTablet: {
    maxWidth: 900,
  },
  landscapeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  /* Header Styles */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 16, // Increased for readability
    fontWeight: '700',
    color: '#047857', // Darker emerald for contrast
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 24, // Increased
    fontWeight: 'bold',
    color: '#111827', // Almost black
  },
  notificationBtn: {
    minWidth: 48, // Touch target >= 44
    minHeight: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10, // slightly bigger
    height: 10,
    backgroundColor: '#DC2626', // Higher contrast red
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  
  /* Main Card Styles */
  mainCard: {
    backgroundColor: '#047857', // Darker green
    borderRadius: 24,
    padding: 24,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
    width: '100%',
  },
  mainCardTablet: {
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    color: '#ECFDF5', // Higher contrast light green
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIconContainerIncome: {
    width: 40, // Increased
    height: 40,
    backgroundColor: '#D1FAE5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statIconContainerExpense: {
    width: 40,
    height: 40,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    color: '#ECFDF5',
    fontSize: 14,
    marginBottom: 2,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18, // Increased
    fontWeight: '700',
  },
  
  /* Action Button Styles */
  actionContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16, // Increased for touch target
    minHeight: 52, // Touch target
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  btnIncome: {
    backgroundColor: '#047857',
  },
  btnExpense: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FECACA', // Stronger border contrast
  },
  actionButtonText: {
    fontSize: 16, // Increased
    fontWeight: '700',
    color: '#FFFFFF',
  },
  textExpense: {
    color: '#B91C1C', // High contrast red
  },
  
  /* Section Styles */
  sectionContainer: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20, // Increased
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAllBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 44, // Touch target
    justifyContent: 'center',
  },
  seeAllText: {
    fontSize: 16, // Increased
    fontWeight: '700',
    color: '#047857',
  },
  
  /* Summary Section Styles */
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14, // Touch target friendly
  },
  summaryItemGrid: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // slightly darker line
  },
  summaryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryIconContainer: {
    width: 44, // Touch target size visually
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryItemTitle: {
    fontSize: 16, // Increased
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  summaryItemAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  
  /* Transaction Item Styles */
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    minHeight: 64, // Good touch target implicitly
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionTextContainer: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16, // Increased
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14, // Increased
    color: '#4B5563', // Darker gray for contrast
  },
  transactionAmount: {
    fontSize: 16, // Increased
    fontWeight: 'bold',
  },
  
  /* Bottom Navigation Styles */
  bottomSpacer: {
    height: 100, 
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    width: '100%',
    alignSelf: 'center',
  },
  bottomNavTablet: {
    maxWidth: 600,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 48, // Accessible touch target
  },
  navLabel: {
    fontSize: 14, // Increased
    marginTop: 4,
    color: '#4B5563', // Darker gray for readability
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#047857',
    fontWeight: '700',
  },
});
