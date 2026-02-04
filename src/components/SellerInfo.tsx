import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  sellerLabel: string;
  postedAt: string | Date;
};

function formatPostedAt(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

export function SellerInfo({ sellerLabel, postedAt }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Seller</Text>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={styles.label}>Identifier</Text>
          <Text style={styles.value} numberOfLines={1}>
            {sellerLabel}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Posted</Text>
          <Text style={styles.value}>{formatPostedAt(postedAt)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e9e9e9',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#f8fafc',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111',
  },
  rows: {
    marginTop: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#667085',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
  },
});
