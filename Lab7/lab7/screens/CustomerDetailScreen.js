import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
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
import { getTransactions, deleteCustomer } from '../api';

const PINK = '#F5385D';

export default function CustomerDetailScreen({ navigation, route }) {
  const { customer } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatMoney = (n) => (n || 0).toLocaleString('vi-VN') + ' đ';

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };

  useFocusEffect(
    useCallback(() => {
      const loadTransactions = async () => {
        try {
          setLoading(true);
          const data = await getTransactions();
          const customerTransactions = data.filter(
            (transaction) => transaction.customer?._id === customer._id
          );
          setTransactions(customerTransactions);
        } catch (error) {
          console.log('Load customer transactions error:', error);
          setTransactions([]);
        } finally {
          setLoading(false);
        }
      };

      loadTransactions();
    }, [customer?._id])
  );

  const handleDelete = () => {
    Alert.alert(
      'Alert',
      'Are you sure you want to remove this client? This will not be possible to return',
      [
        {
          text: 'DELETE',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCustomer(customer._id);
              navigation.popToTop();
            } catch (e) {
              Alert.alert('Alert', 'Unable to delete customer');
            }
          },
        },
        { text: 'CANCEL', style: 'cancel' },
      ]
    );
  };

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={25} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Customer detail</Text>

      <Menu>
        <MenuTrigger>
          <View style={styles.moreButton}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color="#fff"
            />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: styles.actionMenu }}>
          <MenuOption
  onSelect={() => navigation.navigate('EditCustomer', { customer })}
>
  <View style={styles.menuItem}>
    <Ionicons name="pencil-outline" size={18} color="#666" />
    <Text style={styles.menuText}>Edit</Text>
  </View>
</MenuOption>
<MenuOption onSelect={handleDelete}>
  <View style={styles.menuItem}>
    <Ionicons name="trash-outline" size={18} color="#666" />
    <Text style={styles.menuText}>Delete</Text>
  </View>
</MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>General information</Text>

          <Text style={styles.infoLine}>
            <Text style={styles.label}>Name: </Text>
            {customer?.name || ''}
          </Text>

          <Text style={styles.infoLine}>
            <Text style={styles.label}>Phone: </Text>
            {customer?.phone || ''}
          </Text>

          <Text style={styles.infoLine}>
            <Text style={styles.label}>Total spent: </Text>
            <Text style={styles.money}>{formatMoney(customer?.totalSpent)}</Text>
          </Text>

          <Text style={styles.infoLine}>
            <Text style={styles.label}>Time: </Text>
            {customer?.createdAt ? formatDate(customer.createdAt) : ''}
          </Text>

          <Text style={styles.infoLine}>
            <Text style={styles.label}>Last update: </Text>
            {customer?.updatedAt ? formatDate(customer.updatedAt) : ''}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Transaction history</Text>

          {loading ? (
            <ActivityIndicator size="small" color={PINK} style={styles.loading} />
          ) : transactions.length === 0 ? (
            <Text style={styles.emptyText}>No transaction history</Text>
          ) : (
            transactions.map((transaction) => (
              <View key={transaction._id} style={styles.transaction}>
                <Text style={styles.transactionTitle}>
                  {transaction.id}
                  {' - '}
                  {formatDate(transaction.createdAt)}
                </Text>

                {transaction.services?.map((service, i) => (
                  <Text
                    key={service._id || i}
                    style={styles.service}
                    numberOfLines={1}
                  >
                    - {service.name}
                    {service.quantity > 1 ? ` × ${service.quantity}` : ''}
                  </Text>
                ))}

                <Text style={styles.transactionMoney}>
                  {formatMoney(transaction.price)}
                </Text>

                <Text
                  style={[
                    styles.status,
                    transaction.status === 'cancelled'
                      ? styles.cancelled
                      : styles.completed,
                  ]}
                >
                  {transaction.status}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: PINK,
    paddingTop: Constants.statusBarHeight + 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  backButton: {
    width: 32,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  moreButton: {
    width: 32,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 8,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 9,
    padding: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    color: PINK,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoLine: {
    fontSize: 14,
    color: '#333',
    marginBottom: 7,
    lineHeight: 18,
  },
  label: {
    fontWeight: 'bold',
    color: '#222',
  },
  money: {
    color: PINK,
    fontWeight: 'bold',
  },
  loading: {
    marginVertical: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    paddingVertical: 15,
  },
  transaction: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    position: 'relative',
    minHeight: 90,
  },
  transactionTitle: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 7,
    paddingRight: 5,
  },
  service: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    paddingRight: 105,
  },
  transactionMoney: {
    position: 'absolute',
    right: 10,
    bottom: 30,
    color: PINK,
    fontSize: 12,
    fontWeight: 'bold',
  },
  status: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cancelled: {
    color: '#999',
  },
  completed: {
    color: PINK,
  },
  actionMenu: {
    width: 172,
    backgroundColor: '#fff',
    borderRadius: 2,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    height: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    color: PINK,
    fontSize: 14,
    marginLeft: 10,
  },
});