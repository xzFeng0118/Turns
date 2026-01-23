import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/Screen';
import { mockItems } from '@/data/mockItems';
import type { RootStackParamList } from '@/navigation/types';
import type { MarketplaceItem } from '@/types/marketplace';

export function BrowseScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <Text style={styles.title}>Browse</Text>
      <Text style={styles.subtitle}>Tap an item to see details.</Text>

      <FlatList
        data={mockItems}
        keyExtractor={(item: MarketplaceItem) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }: { item: MarketplaceItem }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              ${(item.priceCents / 100).toFixed(2)} · {item.condition.replace('_', ' ')} · {item.location}
            </Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: 6, marginBottom: 12, color: '#666' },
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardMeta: { marginTop: 4, color: '#666' },
  separator: { height: 10 },
});
