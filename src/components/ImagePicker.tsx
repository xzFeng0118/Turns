import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { MediaService } from '@/services/mediaService';

type Props = {
  value: string[];
  onChange: (uris: string[]) => void;
  disabled?: boolean;
};

export function ImagePicker({ value, onChange, disabled = false }: Props) {
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const pickFromLibrary = async () => {
    setIsPicking(true);
    setError(undefined);

    try {
      const result = await MediaService.pickImagesFromLibrary();

      if (!result.ok) {
        const message =
          result.reason === 'permission_denied'
            ? 'Media library permission denied.'
            : result.reason === 'cancelled'
              ? undefined
              : 'Failed to pick images.';

        setError(message);
        return;
      }

      const newUris = result.images.map((i) => i.uri);
      const merged = Array.from(new Set([...value, ...newUris]));
      onChange(merged);
    } finally {
      setIsPicking(false);
    }
  };

  const removeUri = (uri: string) => {
    onChange(value.filter((v) => v !== uri));
  };

  return (
    <View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.grid}>
        <Pressable
          style={[styles.addTile, disabled || isPicking ? styles.tileDisabled : null]}
          onPress={pickFromLibrary}
          disabled={disabled || isPicking}
        >
          <View style={styles.plusIcon}>
            <View style={styles.plusBarH} />
            <View style={styles.plusBarV} />
          </View>
          <Text style={styles.addTileText}>{isPicking ? 'Picking…' : 'Add'}</Text>
        </Pressable>

        {value.map((uri) => (
          <Pressable key={uri} style={styles.thumbWrap} onPress={() => removeUri(uri)} disabled={disabled || isPicking}>
            <Image source={{ uri }} style={styles.thumb} />
          </Pressable>
        ))}
      </View>

      {value.length > 0 ? <Text style={styles.hint}>Tip: tap an image to remove it.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  error: { marginTop: 12, color: '#b00020' },
  grid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  addTile: {
    width: 96,
    height: 96,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileDisabled: { opacity: 0.6 },
  plusIcon: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBarH: {
    position: 'absolute',
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#111',
  },
  plusBarV: {
    position: 'absolute',
    width: 3,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#111',
  },
  addTileText: { marginTop: 8, fontWeight: '700', color: '#111', fontSize: 12 },
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
