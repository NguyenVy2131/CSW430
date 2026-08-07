import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuProvider } from 'react-native-popup-menu';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddServiceScreen from './screens/AddServiceScreen';
import DetailScreen from './screens/DetailScreen';
import EditServiceScreen from './screens/EditServiceScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddService" component={AddServiceScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="EditService" component={EditServiceScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}