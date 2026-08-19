import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { updateCustomer } from '../api';

export default function EditCustomerScreen({ navigation, route }) {
  const { customer } = route.params;
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    setMessage('');
    if (!name || !phone) {
      setMessage('Please input name and phone');
      return;
    }
    try {
      setLoading(true);
      await updateCustomer(customer._id, name, phone);
      navigation.goBack();
    } catch (e) {
      setMessage('Cannot update customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add customer</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>Customer name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {message ? <Text style={styles.error}>{message}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update</Text>
          )}
        </TouchableOpacity>
      </View>
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
  body: { padding: 16 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 20,
  },
  error: { color: PINK, marginBottom: 12, fontSize: 13 },
  button: {
    backgroundColor: PINK,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
