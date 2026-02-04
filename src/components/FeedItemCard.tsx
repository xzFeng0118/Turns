import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  priceCents: number;
  imageUri?: string;
  onPress: () => void;
};

function formatPrice(priceCents: number) {
  return `$${(priceCents / 100).toFixed(2)}`;
}

export function FeedItemCard({ title, priceCents, imageUri, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : <View style={styles.imagePlaceholder} />}
      </View>

      <View style={styles.body}>
        <Text style={styles.price}>{formatPrice(priceCents)}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    flex: 1,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#fafafa',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, backgroundColor: '#f1f1f1' },
  body: { padding: 10 },
  price: { fontSize: 14, fontWeight: '800', color: '#111' },
  title: { marginTop: 6, fontSize: 13, color: '#333', lineHeight: 18 },
});
