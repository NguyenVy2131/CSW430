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
import { getServices } from '../api';

export default function HomeScreen({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
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

  const formatPrice = (p) => p.toLocaleString('vi-VN') + ' đ';

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Detail', { id: item._id })}
    >
      <Text style={styles.itemName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HUYỀN TRINH</Text>
        <Ionicons name="person-circle-outline" size={30} color="#fff" />
      </View>

      <View style={styles.logoWrap}>
        <MaterialCommunityIcons name="flower-tulip" size={26} color={PINK} />
        <Text style={styles.logo}>KAMI SPA</Text>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Danh sách dịch vụ</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddService')}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={PINK} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  logo: { color: PINK, fontSize: 22, fontWeight: 'bold', marginLeft: 6 },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  addBtn: {
    backgroundColor: PINK,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginRight: 10,
  },
  itemPrice: { fontSize: 14, color: '#222' },
});