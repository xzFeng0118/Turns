import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { ProfileListSection } from '@/components/ProfileListSection';
import { useMyPurchases } from '@/hooks/useMyPurchases';
import type { Order } from '@/types/orders';

export function OrdersScreen() {
  const { orders } = useMyPurchases();

  return (
    <Screen>
      <Text style={styles.title}>Orders</Text>

      <ProfileListSection
        title="My Purchases"
        emptyText="No purchases yet."
        data={orders.map((o: Order) => ({
          id: o.id,
          title: o.itemTitle,
          subtitle: `$${(o.priceCents / 100).toFixed(2)} · ${o.status}`,
        }))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  meta: { marginTop: 12, color: '#666' },
});
