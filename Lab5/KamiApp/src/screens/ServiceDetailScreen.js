import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { getServiceById, deleteService, getToken } from '../api/api';
import colors from '../theme/colors';

function formatPrice(price) {
  return `${Number(price).toLocaleString('vi-VN')} đ`;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleString('en-GB');
}

export default function ServiceDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadService() {
    try {
      const data = await getServiceById(id);
      setService(data);
    } catch (error) {
      console.log('getServiceById error:', error.message);
      Alert.alert('Error', 'Could not load this service.');
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadService();
    }, [id]),
  );

  function confirmDelete() {
    Alert.alert(
      'Warning',
      'Are you sure you want to remove this service? This operation cannot be returned',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'DELETE',
          style: 'destructive',
          onPress: handleDelete,
        },
      ],
    );
  }

  async function handleDelete() {
    try {
      const token = await getToken();
      await deleteService(id, token);
      navigation.goBack();
    } catch (error) {
      console.log(
        'deleteService error:',
        error?.response?.data || error.message,
      );
      Alert.alert('Error', 'Could not delete the service.');
    }
  }

  if (loading || !service) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Service detail</Text>
        </View>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 40 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.backIcon} onPress={() => navigation.goBack()}>
          ←
        </Text>
        <Text style={styles.headerTitle}>Service detail</Text>

        <Menu>
          <MenuTrigger>
            <Text style={styles.menuIcon}>⋮</Text>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption
              onSelect={() => navigation.navigate('EditService', { service })}
              text="Edit"
            />
            <MenuOption onSelect={confirmDelete} text="Delete" />
          </MenuOptions>
        </Menu>
      </View>

      <View style={styles.content}>
        <Text style={styles.row}>
          <Text style={styles.label}>Service name: </Text>
          {service.name}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Price: </Text>
          {formatPrice(service.price)}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Creator: </Text>
          {service.createdBy}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Time: </Text>
          {formatDate(service.createdAt)}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Final update: </Text>
          {formatDate(service.updatedAt)}
        </Text>
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
    flex: 1,
  },
  menuIcon: {
    color: colors.white,
    fontSize: 22,
    paddingHorizontal: 6,
  },
  content: {
    padding: 20,
  },
  row: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 10,
    lineHeight: 20,
  },
  label: {
    fontWeight: 'bold',
  },
});
