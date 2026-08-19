import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getTransactions } from '../api';

export default function TransactionScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(
        data || []
      );
    } catch (error) {

      console.log(
        'Get transactions error:',
        error?.response?.data ||
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const pad = (n) => String(n).padStart(2, '0');
  const shortDate = (iso) => {
    const d = new Date(iso);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(
      d.getFullYear()
    ).slice(-2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const formatMoney = (n) => (n || 0).toLocaleString('vi-VN') + ' đ';

  const renderItem = ({ item }) => {
    const cancelled = (item.status || '').toLowerCase() === 'cancelled';
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('TransactionDetail', { id: item._id })
        }
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.code}>
            {item.id} - {shortDate(item.createdAt)}
          </Text>
          {(item.services || []).map((s, i) => (
            <Text key={i} style={styles.service} numberOfLines={1}>
              - {s.name}
            </Text>
          ))}
          <Text style={styles.customer}>
            Customer: {item.customer?.name || ''}
          </Text>
        </View>
        <Text style={styles.price}>{formatMoney(item.price)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={PINK} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const PINK = '#F5385D';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: PINK,
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  item: {
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  code: { fontSize: 13, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  service: { fontSize: 13, color: '#333' },
  customer: { fontSize: 13, color: '#666', marginTop: 4 },
  price: { fontSize: 14, fontWeight: 'bold', color: PINK },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: PINK,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
