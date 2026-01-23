import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/Screen';

export function MessagesScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.meta}>Placeholder: buyer/seller chat list goes here.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  meta: { marginTop: 12, color: '#666' },
});
