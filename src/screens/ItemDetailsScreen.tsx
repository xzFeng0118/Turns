import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '@/components/Screen';
import { mockItems } from '@/data/mockItems';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ItemDetails'>;

export function ItemDetailsScreen({ route }: Props) {
  const item = mockItems.find((i) => i.id === route.params.itemId);

  return (
    <Screen>
      <Text style={styles.title}>{item?.title ?? 'Item not found'}</Text>
      <Text style={styles.meta}>This is a placeholder details screen.</Text>

      {item ? (
        <Text style={styles.meta}>
          Price: ${(item.priceCents / 100).toFixed(2)}\nCondition: {item.condition.replace('_', ' ')}\nLocation: {item.location}
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700' },
  meta: { marginTop: 12, color: '#666', lineHeight: 20 },
});
