import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
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
import { getService, deleteService } from '../Api';

export default function DetailScreen({ navigation, route }) {
  const { id } = route.params;
  const [service, setService] = useState(null);

  const load = async () => {
    try {
      const data = await getService(id);
      setService(data);
    } catch (e) {}
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [id])
  );

  const formatDate = (iso) => {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const handleDelete = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to remove this service? This operation cannot be returned',
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'DELETE',
          onPress: async () => {
            try {
              await deleteService(id);
              navigation.goBack();
            } catch (e) {
              Alert.alert('Error', 'Cannot delete service');
            }
          },
        },
      ]
    );
  };

  if (!service) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service detail</Text>
          <View style={{ width: 24 }} />
        </View>
        <ActivityIndicator size="large" color={PINK} style={{ marginTop: 30 }} />
      </View>
    );
  }

  const creator =
    typeof service.createdBy === 'object'
      ? service.createdBy?.name
      : service.createdBy;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service detail</Text>
        <Menu>
          <MenuTrigger>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="#fff" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption
              text="Edit"
              onSelect={() => navigation.navigate('EditService', { service })}
            />
            <MenuOption text="Delete" onSelect={handleDelete} />
          </MenuOptions>
        </Menu>
      </View>

      <View style={styles.body}>
        <Text style={styles.row}>
          <Text style={styles.bold}>Service name: </Text>
          {service.name}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.bold}>Price: </Text>
          {service.price.toLocaleString('vi-VN')} đ
        </Text>
        <Text style={styles.row}>
          <Text style={styles.bold}>Creator: </Text>
          {creator}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.bold}>Time: </Text>
          {formatDate(service.createdAt)}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.bold}>Final update: </Text>
          {formatDate(service.updatedAt)}
        </Text>
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
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1, marginLeft: 16 },
  body: { padding: 16 },
  row: { fontSize: 15, color: '#222', marginBottom: 8, lineHeight: 22 },
  bold: { fontWeight: 'bold' },
});