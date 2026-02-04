import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ItemCard } from '@/components/ItemCard';
import { ItemForm, type ItemFormSubmitData } from '@/components/ItemForm';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import type { ListingStatus } from '@/types/listings';
import { createItem, getMyItems, updateItem, type SellerItem } from '@/services/items';
import { compressImage } from '@/utils/imageCompression';
import { uploadImage } from '@/utils/uploadImage';

export function SellScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<SellerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingItem, setEditingItem] = useState<SellerItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const data = await getMyItems();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const headerSubtitle = useMemo(() => {
    if (mode === 'create') return 'Create a new item.';
    if (mode === 'edit') return 'Edit your item.';
    return 'Manage your items and create new listings.';
  }, [mode]);

  const startCreate = () => {
    setEditingItem(null);
    setMode('create');
  };

  const startEdit = (item: SellerItem) => {
    setEditingItem(item);
    setMode('edit');
  };

  const cancelForm = () => {
    setEditingItem(null);
    setMode('list');
  };

  const handleSubmit = async (data: ItemFormSubmitData) => {
    setSubmitting(true);
    setError(undefined);

    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const isRemoteUrl = (uri: string) => uri.startsWith('http://') || uri.startsWith('https://');

      if (mode === 'edit' && editingItem) {
        const uploadedUrls: string[] = [];

        for (const uri of data.images) {
          if (isRemoteUrl(uri)) {
            uploadedUrls.push(uri);
            continue;
          }

          const compressedUri = await compressImage(uri);
          const publicUrl = await uploadImage(compressedUri, user.id, editingItem.id);
          uploadedUrls.push(publicUrl);
        }

        await updateItem(editingItem.id, {
          title: data.title,
          description: data.description,
          priceCents: data.priceCents,
          images: uploadedUrls,
        });
      } else {
        const created = await createItem({
          title: data.title,
          description: data.description,
          priceCents: data.priceCents,
          images: [],
          status: 'active' as ListingStatus,
        });

        const uploadedUrls: string[] = [];
        for (const uri of data.images) {
          if (isRemoteUrl(uri)) {
            uploadedUrls.push(uri);
            continue;
          }

          const compressedUri = await compressImage(uri);
          const publicUrl = await uploadImage(compressedUri, user.id, created.id);
          uploadedUrls.push(publicUrl);
        }

        if (uploadedUrls.length > 0) {
          await updateItem(created.id, { images: uploadedUrls });
        }
      }

      await loadItems();
      cancelForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save item.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Sell</Text>
      <Text style={styles.meta}>{headerSubtitle}</Text>

      {mode === 'list' ? (
        <>
          <View style={styles.actionsRow}>
            <Pressable style={styles.button} onPress={startCreate}>
              <Text style={styles.buttonText}>Create new item</Text>
            </Pressable>
            <Pressable style={[styles.secondaryButton, loading ? styles.buttonDisabled : null]} onPress={loadItems} disabled={loading}>
              <Text style={styles.secondaryButtonText}>{loading ? 'Refreshing…' : 'Refresh'}</Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={!loading ? <Text style={styles.hint}>No items yet. Create your first one.</Text> : null}
            renderItem={({ item }) => (
              <ItemCard
                title={item.title}
                priceCents={item.priceCents}
                status={item.status}
                imageUri={item.images[0]}
                onEdit={() => startEdit(item)}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </>
      ) : (
        <>
          <Pressable style={styles.secondaryButton} onPress={cancelForm} disabled={submitting}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <ItemForm
            mode={mode === 'edit' ? 'edit' : 'create'}
            initialValues={
              editingItem
                ? {
                    title: editingItem.title,
                    description: editingItem.description,
                    priceCents: editingItem.priceCents,
                    images: editingItem.images,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  meta: { marginTop: 12, color: '#666' },
  actionsRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#111', fontWeight: '700' },
  buttonDisabled: { opacity: 0.6 },
  error: { marginTop: 12, color: '#b00020' },
  list: { marginTop: 16, paddingBottom: 24 },
  separator: { height: 12 },
  hint: { marginTop: 12, color: '#666' },
});
