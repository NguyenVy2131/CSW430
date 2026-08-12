import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MenuProvider } from 'react-native-popup-menu';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

import LoginScreen from './screens/Loginscreen';
import HomeScreen from './screens/Homescreen';
import AddServiceScreen from './screens/Addservicescreen';
import DetailScreen from './screens/Detailscreen';
import EditServiceScreen from './screens/Editservicescreen';
import CustomerScreen from './screens/CustomerScreen';
import AddCustomerScreen from './screens/AddCustomerScreen';
import TransactionScreen from './screens/TransactionScreen';
import TransactionDetailScreen from './screens/TransactionDetailScreen';
import SettingScreen from './screens/SettingScreen';

const PINK = '#F5385D';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const CustomerStack = createNativeStackNavigator();
const TransactionStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="AddService" component={AddServiceScreen} />
      <HomeStack.Screen name="Detail" component={DetailScreen} />
      <HomeStack.Screen name="EditService" component={EditServiceScreen} />
    </HomeStack.Navigator>
  );
}

function CustomerStackScreen() {
  return (
    <CustomerStack.Navigator screenOptions={{ headerShown: false }}>
      <CustomerStack.Screen name="Customer" component={CustomerScreen} />
      <CustomerStack.Screen name="AddCustomer" component={AddCustomerScreen} />
    </CustomerStack.Navigator>
  );
}

function TransactionStackScreen() {
  return (
    <TransactionStack.Navigator screenOptions={{ headerShown: false }}>
      <TransactionStack.Screen name="Transaction" component={TransactionScreen} />
      <TransactionStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
      />
    </TransactionStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PINK,
        tabBarInactiveTintColor: '#9e9e9e',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TransactionTab"
        component={TransactionStackScreen}
        options={{
          tabBarLabel: 'Transaction',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="attach-money" size={size + 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CustomerTab"
        component={CustomerStackScreen}
        options={{
          tabBarLabel: 'Customer',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingTab"
        component={SettingScreen}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Main" component={MainTabs} />
        </RootStack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}