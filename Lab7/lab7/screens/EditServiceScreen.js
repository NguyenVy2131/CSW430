import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { updateService } from '../api';

export default function EditServiceScreen({ navigation, route }) {
  const { service } = route.params;
  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(String(service.price));

  const handleUpdate = async () => {
    if (!name || !price) {
      Alert.alert('Notice', 'Please input service name and price');
      return;
    }
    try {
      await updateService(service._id, name, Number(price));
      Alert.alert('Success', 'Service updated successfully');
      navigation.navigate('Detail', { id: service._id });
    } catch (e) {
      Alert.alert('Error', 'Cannot update service');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>Service name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
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
  button: {
    backgroundColor: PINK,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});