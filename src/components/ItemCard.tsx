import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ListingStatus } from '@/types/listings';

type Props = {
  title: string;
  priceCents: number;
  status: ListingStatus;
  imageUri?: string;
  onEdit: () => void;
};

function formatPrice(priceCents: number) {
  return `$${(priceCents / 100).toFixed(2)}`;
}

function formatStatus(status: ListingStatus) {
  return status.replace('_', ' ');
}

export function ItemCard({ title, priceCents, status, imageUri, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.thumbWrap}>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.thumb} /> : <View style={styles.thumbPlaceholder} />}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.meta}>{formatPrice(priceCents)}</Text>

          <View style={styles.statusRow}>
            <View style={[styles.badge, styles[`badge_${status}`]]}>
              <Text style={styles.badgeText}>{formatStatus(status)}</Text>
            </View>

            <Pressable style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row' },
  thumbWrap: {
    width: 84,
    height: 84,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  thumb: { width: '100%', height: '100%' },
  thumbPlaceholder: { flex: 1, backgroundColor: '#f1f1f1' },
  content: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { marginTop: 6, color: '#666', fontWeight: '600' },
  statusRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f7f7f7',
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#333', textTransform: 'capitalize' },
  badge_draft: { backgroundColor: '#f7f7f7', borderColor: '#ddd' },
  badge_active: { backgroundColor: '#e9f7ef', borderColor: '#b7e4c7' },
  badge_paused: { backgroundColor: '#fff3cd', borderColor: '#ffe69c' },
  badge_sold: { backgroundColor: '#f8d7da', borderColor: '#f1aeb5' },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#111',
  },
  editButtonText: { color: '#fff', fontWeight: '700' },
});
