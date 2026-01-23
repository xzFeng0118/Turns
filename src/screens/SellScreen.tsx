import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/Screen';

export function SellScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Sell</Text>
      <Text style={styles.meta}>Placeholder: create listing form goes here.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  meta: { marginTop: 12, color: '#666' },
});
