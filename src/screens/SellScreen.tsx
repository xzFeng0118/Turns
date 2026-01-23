import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { useImagePicker } from '@/hooks/useImagePicker';

export function SellScreen() {
  const { images, isPicking, error, pickFromLibrary, removeImageByUri } = useImagePicker();

  return (
    <Screen>
      <Text style={styles.title}>Sell</Text>
      <Text style={styles.meta}>Add photos of your item to create a listing.</Text>

      <Pressable style={styles.button} onPress={pickFromLibrary} disabled={isPicking}>
        <Text style={styles.buttonText}>{isPicking ? 'Picking…' : 'Select photos'}</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.grid}>
        {images.map((img) => (
          <Pressable key={img.uri} style={styles.thumbWrap} onPress={() => removeImageByUri(img.uri)}>
            <Image source={{ uri: img.uri }} style={styles.thumb} />
          </Pressable>
        ))}
      </View>

      {images.length > 0 ? (
        <Text style={styles.hint}>Tip: tap an image to remove it.</Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  meta: { marginTop: 12, color: '#666' },
  button: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#111',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { marginTop: 12, color: '#b00020' },
  grid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  thumbWrap: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  thumb: { width: '100%', height: '100%' },
  hint: { marginTop: 12, color: '#666' },
});
