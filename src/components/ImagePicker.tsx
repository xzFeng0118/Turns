import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { MediaService } from '@/services/mediaService';

type Props = {
  value: string[];
  onChange: (uris: string[]) => void;
  disabled?: boolean;
  buttonLabel?: string;
};

export function ImagePicker({ value, onChange, disabled = false, buttonLabel }: Props) {
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const effectiveLabel = useMemo(() => buttonLabel ?? 'Select photos', [buttonLabel]);

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
      <Pressable style={[styles.button, disabled || isPicking ? styles.buttonDisabled : null]} onPress={pickFromLibrary} disabled={disabled || isPicking}>
        <Text style={styles.buttonText}>{isPicking ? 'Picking…' : effectiveLabel}</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.grid}>
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
  button: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#111',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
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
