import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabsNavigator } from './TabsNavigator';
import type { RootStackParamList } from './types';
import { ItemDetailsScreen } from '@/screens/ItemDetailsScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { useAuth } from '@/hooks/useAuth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { currentUser } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUser ? (
          <>
            <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} options={{ title: 'Item' }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
