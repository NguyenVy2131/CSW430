import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import { useFocusEffect } from '@react-navigation/native';
import { getTransaction, deleteTransaction } from '../api';

export default function TransactionDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const [t, setT] = useState(null);

  const load = async () => {
    try {
      const data = await getTransaction(id);
      setT(data);
    } catch (e) {}
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [id])
  );

  const pad = (n) => String(n).padStart(2, '0');
  const fullDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const money = (n) => (n || 0).toLocaleString('vi-VN') + ' đ';

  const handleCancel = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to cancel this transaction? This will affect the customer transaction information',
      [
        {
          text: 'YES',
          onPress: async () => {
            try {
              await deleteTransaction(id);
              navigation.goBack();
            } catch (e) {
              Alert.alert('Warning', 'Unable to cancel transaction');
            }
          },
        },
        { text: 'CANCEL', style: 'cancel' },
      ]
    );
  };

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Transaction detail</Text>
      <Menu>
        <MenuTrigger>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#fff" />
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: styles.actionMenu }}>
          <MenuOption onSelect={() => {}}>
            <Text style={styles.menuNormal}>See more details</Text>
          </MenuOption>
          <MenuOption onSelect={handleCancel}>
            <Text style={styles.menuCancel}>Cancel transaction</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );

  if (!t) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color={PINK} style={{ marginTop: 30 }} />
      </View>
    );
  }

  const amount = t.priceBeforePromotion || 0;
  const payment = t.price || 0;
  const discount = amount - payment;

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={styles.containerDetail}>
        <Text style={styles.section}>General information</Text>
        <Row label="Transaction code" value={t.id} />
        <Row
          label="Customer"
          value={`${t.customer?.name || ''} - ${t.customer?.phone || ''}`}
        />
        <Row label="Creation time" value={fullDate(t.createdAt)} />
      </View>
      <View style={styles.containerDetail}>
        <Text style={styles.section}>Services list</Text>
        {(t.services || []).map((s, i) => (
          <View key={i} style={styles.serviceRow}>
            <Text style={styles.serviceName}>{s.name}</Text>
            <Text style={styles.qty}>x{s.quantity || 1}</Text>
            <Text style={styles.servicePrice}>
              {money((s.price || 0) * (s.quantity || 1))}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{money(amount)}</Text>
        </View>
      </View>
      <View style={styles.containerDetail}>
        <Text style={styles.section}>Cost</Text>
        <Row label="Amount of money" value={money(amount)} right />
        <Row label="Discount" value={`-${money(discount)}`} right />
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Total payment</Text>
          <Text style={styles.paymentValue}>{money(payment)}</Text>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value, right }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, right && { fontWeight: 'bold' }]}>
        {value}
      </Text>
    </View>
  );
}

const PINK = '#F5385D';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eee' },
  header: {
    backgroundColor: PINK,
    paddingTop: Constants.statusBarHeight + 5,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerDetail: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 9,
    marginBottom: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
  },
  section: {
    color: PINK,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowLabel: { color: '#666', fontSize: 14 },
  rowValue: { color: '#222', fontSize: 14 },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: { flex: 1, color: '#222', fontSize: 14 },
  qty: { color: '#999', fontSize: 13, marginHorizontal: 10 },
  servicePrice: { color: '#222', fontSize: 14, fontWeight: 'bold' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: { color: '#666', fontSize: 14 },
  totalValue: { color: '#222', fontSize: 14, fontWeight: 'bold' },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  paymentLabel: {
    color: '#222',
    fontSize: 15,
    fontWeight: 'bold',
  },
  paymentValue: { color: PINK, fontSize: 18, fontWeight: 'bold' },
  actionMenu: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuNormal: { color: '#333', fontSize: 14, padding: 10 },
  menuCancel: { color: PINK, fontSize: 14, padding: 10 },
});