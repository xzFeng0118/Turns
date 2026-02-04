import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ImagePicker } from '@/components/ImagePicker';

export type ItemFormMode = 'create' | 'edit';

export type ItemFormValues = {
  title: string;
  description: string;
  priceCents: number;
  images: string[];
};

export type ItemFormSubmitData = ItemFormValues;

type Props = {
  mode: ItemFormMode;
  initialValues?: Partial<ItemFormValues>;
  onSubmit: (data: ItemFormSubmitData) => void | Promise<void>;
  submitting?: boolean;
  submitLabel?: string;
};

function centsToPriceText(priceCents: number) {
  if (!Number.isFinite(priceCents)) return '';
  return (priceCents / 100).toFixed(2);
}

function priceTextToCents(priceText: string) {
  const normalized = priceText.trim().replace(',', '.');
  if (!normalized) return NaN;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return NaN;
  return Math.round(value * 100);
}

export function ItemForm({ mode, initialValues, onSubmit, submitting = false, submitLabel }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [priceText, setPriceText] = useState(centsToPriceText(initialValues?.priceCents ?? 0));
  const [images, setImages] = useState<string[]>(initialValues?.images ?? []);
  const [errors, setErrors] = useState<{ title?: string; price?: string }>({});

  const effectiveSubmitLabel = useMemo(() => {
    if (submitLabel) return submitLabel;
    return mode === 'edit' ? 'Save changes' : 'Create item';
  }, [mode, submitLabel]);

  const handleSubmit = async () => {
    const nextErrors: { title?: string; price?: string } = {};

    if (!title.trim()) {
      nextErrors.title = 'Title is required.';
    }

    const priceCents = priceTextToCents(priceText);
    if (!Number.isFinite(priceCents) || priceCents <= 0) {
      nextErrors.price = 'Price is required.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      priceCents,
      images,
    });
  };

  return (
    <View>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Item title"
        style={[styles.input, errors.title ? styles.inputError : null]}
      />
      {errors.title ? <Text style={styles.error}>{errors.title}</Text> : null}

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your item"
        style={[styles.input, styles.textArea]}
        multiline
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        value={priceText}
        onChangeText={setPriceText}
        placeholder="0.00"
        keyboardType="decimal-pad"
        style={[styles.input, errors.price ? styles.inputError : null]}
      />
      {errors.price ? <Text style={styles.error}>{errors.price}</Text> : null}

      <Text style={styles.label}>Images</Text>
      <ImagePicker value={images} onChange={setImages} disabled={submitting} />

      <Pressable style={[styles.submitButton, submitting ? styles.buttonDisabled : null]} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.submitButtonText}>{submitting ? 'Saving…' : effectiveSubmitLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  inputError: { borderColor: '#b00020' },
  error: { marginTop: 8, color: '#b00020' },
  submitButton: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  submitButtonText: { color: '#fff', fontWeight: '700' },
});
