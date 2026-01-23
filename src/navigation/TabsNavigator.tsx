import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { TabsParamList } from './types';
import { HomeScreen } from '@/screens/HomeScreen';
import { SellScreen } from '@/screens/SellScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';

const Tabs = createBottomTabNavigator<TabsParamList>();

export function TabsNavigator() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tabs.Screen name="Sell" component={SellScreen} options={{ title: 'Sell' }} />
      <Tabs.Screen name="Orders" component={OrdersScreen} options={{ title: 'Orders' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tabs.Navigator>
  );
}
