import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { TabsParamList } from './types';
import { BrowseScreen } from '@/screens/BrowseScreen';
import { SellScreen } from '@/screens/SellScreen';
import { MessagesScreen } from '@/screens/MessagesScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';

const Tabs = createBottomTabNavigator<TabsParamList>();

export function TabsNavigator() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Browse" component={BrowseScreen} options={{ title: 'Browse' }} />
      <Tabs.Screen name="Sell" component={SellScreen} options={{ title: 'Sell' }} />
      <Tabs.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tabs.Navigator>
  );
}
