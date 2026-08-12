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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getCustomers } from '../Api';

export default function CustomerScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const formatMoney = (n) => (n || 0).toLocaleString('vi-VN') + ' đ';

  const renderItem = ({ item }) => {
    const isMember = (item.loyalty || '').toLowerCase() === 'member';
    return (
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.line}>Customer: {item.name}</Text>
          <Text style={styles.line}>Phone: {item.phone}</Text>
          <Text style={styles.line}>
            Total money: <Text style={styles.money}>{formatMoney(item.totalSpent)}</Text>
          </Text>
        </View>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="crown" size={22} color={PINK} />
          <Text style={[styles.badgeText, isMember && { color: PINK }]}>
            {isMember ? 'Member' : 'Guest'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customer</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={PINK} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddCustomer')}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: { fontSize: 14, color: '#333', marginBottom: 4, fontWeight: '600' },
  money: { color: PINK, fontWeight: 'bold' },
  badge: { alignItems: 'center', width: 70 },
  badgeText: { fontSize: 12, color: '#9e9e9e', marginTop: 2, fontWeight: 'bold' },
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