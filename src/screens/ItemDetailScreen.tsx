import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ImageCarousel } from '@/components/ImageCarousel';
import { Screen } from '@/components/Screen';
import { SellerInfo } from '@/components/SellerInfo';
import { useAuth } from '@/contexts/AuthContext';
import type { RootStackParamList } from '@/navigation/types';
import { getItemById } from '@/services/items';
import type { SellerItem } from '@/services/items';

type Props = NativeStackScreenProps<RootStackParamList, 'ItemDetails'>;

function formatPrice(priceCents: number) {
  return `$${(priceCents / 100).toFixed(2)}`;
}

function sellerLabelFromItem(item: SellerItem) {
  return item.sellerId;
}

export function ItemDetailScreen({ route, navigation }: Props) {
  const { user } = useAuth();
  const { itemId } = route.params;

  const [item, setItem] = useState<SellerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const canBuy = useMemo(() => {
    if (!item) return false;
    if (!user) return true;
    return user.id !== item.sellerId;
  }, [item, user]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    const res = await getItemById(itemId);
    if (!res.ok) {
      setItem(null);
      setError(res.error);
      setLoading(false);
      return;
    }

    setItem(res.item);
    setLoading(false);
  }, [itemId]);

  useEffect(() => {
    load();
  }, [load]);

  const onPressBuy = useCallback(() => {
    if (!item) return;

    if (!user) {
      navigation.navigate('Login');
      return;
    }

    Alert.alert('Buy', 'Checkout is not implemented yet.');
  }, [item, navigation, user]);

  if (loading) {
    return (
      <Screen style={styles.loadingScreen}>
        <ActivityIndicator />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Text style={styles.title}>Item</Text>
        <Text style={styles.error}>{error}</Text>
      </Screen>
    );
  }

  if (!item) {
    return (
      <Screen>
        <Text style={styles.title}>Item not found</Text>
        <Text style={styles.muted}>This item may have been removed or is no longer available.</Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.carouselWrap}>
          <ImageCarousel images={item.images} height={320} />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>{formatPrice(item.priceCents)}</Text>
        </View>

        {item.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.body}>{item.description}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <SellerInfo sellerLabel={sellerLabelFromItem(item)} postedAt={item.createdAt} />
        </View>

        {canBuy ? (
          <Pressable style={styles.buyButton} onPress={onPressBuy}>
            <Text style={styles.buyButtonText}>Buy</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 0,
  },
  content: {
    paddingBottom: 20,
  },
  loadingScreen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselWrap: {
    width: '100%',
    backgroundColor: '#fafafa',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  price: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  body: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  muted: {
    marginTop: 10,
    color: '#666',
    lineHeight: 20,
  },
  error: {
    marginTop: 10,
    color: '#b42318',
    lineHeight: 20,
  },
  buyButton: {
    marginTop: 18,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#111',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
