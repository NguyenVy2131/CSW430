import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { updateService, getToken } from '../api/api';
import colors from '../theme/colors';

export default function EditServiceScreen({ route, navigation }) {
  const { service } = route.params;

  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(String(service.price));
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    if (!name.trim()) {
      Alert.alert('Missing info', 'Please enter a service name.');
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      await updateService(service._id, name.trim(), Number(price) || 0, token);
      navigation.pop(2);
    } catch (error) {
      console.log(
        'updateService error:',
        error?.response?.data || error.message,
      );
      Alert.alert('Error', 'Could not update the service.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Service name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Update</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    color: colors.white,
    fontSize: 22,
    marginRight: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
