import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { FeedItemCard } from '@/components/FeedItemCard';
import { Screen } from '@/components/Screen';
import type { RootStackParamList } from '@/navigation/types';
import { getAvailableItems } from '@/services/items';
import type { SellerItem } from '@/services/items';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<SellerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    const res = await getAvailableItems(50, 0);
    if (!res.ok) {
      setItems([]);
      setError(res.error);
      setLoading(false);
      return;
    }

    setItems(res.items);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Screen>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Browse items for sale. Tap an item to see details.</Text>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrap}
        contentContainerStyle={styles.list}
        onRefresh={load}
        refreshing={loading}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No items available right now.</Text> : null}
        renderItem={({ item }) => (
          <FeedItemCard
            title={item.title}
            priceCents={item.priceCents}
            imageUri={item.images[0]}
            onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: 6, marginBottom: 12, color: '#666' },
  loadingWrap: { paddingVertical: 10 },
  error: { marginBottom: 10, color: '#b00020' },
  list: { paddingBottom: 24 },
  columnWrap: { gap: 12 },
  empty: { marginTop: 18, color: '#666' },
});
