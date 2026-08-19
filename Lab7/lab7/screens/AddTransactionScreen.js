import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {
  getCustomers,
  getServices,
  addTransaction,
  getUserId,
} from '../api';

export default function AddTransactionScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [selected, setSelected] = useState({});
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [cs, sv, uid] = await Promise.all([
          getCustomers(),
          getServices(),
          getUserId(),
        ]);
        setCustomers(cs);
        setServices(sv);
        setUserId(uid);
      } catch (error) {

          console.log(
            'Load add transaction error:',
            error?.response?.data || error
          );

          Alert.alert(
            'Alert',
            'Unable to load data'
          );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const money = (n) => (n || 0).toLocaleString('vi-VN') + ' đ';

  const toggle = (id, checked) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (checked) next[id] = { quantity: 1, userId };
      else delete next[id];
      return next;
    });
  };

  const changeQty = (id, delta) => {
    setSelected((prev) => {
      if (!prev[id]) return prev;
      const q = Math.max(1, prev[id].quantity + delta);
      return { ...prev, [id]: { ...prev[id], quantity: q } };
    });
  };

  const setExecutor = (id, uid) => {
    setSelected((prev) =>
      prev[id] ? { ...prev, [id]: { ...prev[id], userId: uid } } : prev
    );
  };

  const total = services.reduce((sum, s) => {
    const sel = selected[s._id];
    return sel ? sum + s.price * sel.quantity : sum;
  }, 0);

  const customerData = customers.map((c) => ({
    label: `${c.name} - ${c.phone}`,
    value: c._id,
  }));

  const executorData = userId ? [{ label: 'Me', value: userId }] : [];

  const handleSubmit = async () => {
    setMessage('');
    if (!customerId) {
      setMessage('Please select a customer');
      return;
    }
    const ids = Object.keys(selected);
    if (ids.length === 0) {
      setMessage('Please select at least one service');
      return;
    }
    const payload = ids.map((id) => {
      const o = { _id: id, quantity: selected[id].quantity };
      if (selected[id].userId) o.userId = selected[id].userId;
      return o;
    });
    try {
      setSubmitting(true);
      await addTransaction(customerId, payload);
      navigation.goBack();
    } catch (e) {
      setMessage('Cannot create transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add transaction</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={PINK} style={{ marginTop: 30 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <Text style={styles.label}>Customer *</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            data={customerData}
            labelField="label"
            valueField="value"
            placeholder="Select custommer"
            value={customerId}
            onChange={(item) => setCustomerId(item.value)}
          />

          {services.map((s) => {
            const sel = selected[s._id];
            return (
              <View key={s._id} style={styles.serviceBlock}>
                <BouncyCheckbox
                  size={24}
                  fillColor={PINK}
                  text={s.name}
                  textStyle={{ textDecorationLine: 'none', color: '#222' }}
                  onPress={(checked) => toggle(s._id, checked)}
                />
                {sel ? (
                  <View style={styles.selArea}>
                    <View style={styles.qtyRow}>
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => changeQty(s._id, -1)}
                        >
                          <Text style={styles.stepTxt}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyNum}>{sel.quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => changeQty(s._id, 1)}
                        >
                          <Text style={styles.stepTxt}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <Dropdown
                        style={styles.executor}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={executorData}
                        labelField="label"
                        valueField="value"
                        placeholder="Executor"
                        value={sel.userId}
                        onChange={(item) => setExecutor(s._id, item.value)}
                      />
                    </View>
                    <Text style={styles.priceLine}>
                      Price:{' '}
                      <Text style={styles.money}>
                        {money(s.price * sel.quantity)}
                      </Text>
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}

          {message ? <Text style={styles.error}>{message}</Text> : null}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.summaryBtn}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.summaryText}>See summary: ({money(total)})</Text>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 16 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  dropdown: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  placeholder: { color: '#9e9e9e', fontSize: 14 },
  selectedText: { color: '#222', fontSize: 14 },
  serviceBlock: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selArea: { marginLeft: 34, marginTop: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 12,
  },
  stepBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  stepTxt: { fontSize: 18, color: '#333' },
  qtyNum: { fontSize: 15, minWidth: 24, textAlign: 'center' },
  executor: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  priceLine: { marginTop: 8, fontSize: 14, color: '#222' },
  money: { color: PINK, fontWeight: 'bold' },
  error: { color: PINK, marginTop: 12, fontSize: 13 },
  summaryBtn: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: PINK,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  summaryText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
