import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ProfileListSection } from '@/components/ProfileListSection';
import { useAuth } from '@/hooks/useAuth';
import { useMyListings } from '@/hooks/useMyListings';
import type { Listing } from '@/types/listings';

export function ProfileScreen() {
  const { currentUser, signOut, isLoading } = useAuth();
  const { listings } = useMyListings();

  const initials = (currentUser?.name ?? 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>

      {currentUser ? (
        <>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.name}>{currentUser.name}</Text>
              <Text style={styles.email}>{currentUser.email}</Text>
            </View>
          </View>

          <Pressable style={[styles.button, isLoading ? styles.buttonDisabled : null]} onPress={signOut} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Logging out…' : 'Logout'}</Text>
          </Pressable>

          <ProfileListSection
            title="My Listings"
            emptyText="No listings yet."
            data={listings.map((l: Listing) => ({
              id: l.id,
              title: l.title,
              subtitle: `$${(l.priceCents / 100).toFixed(2)} · ${l.status}`,
            }))}
          />
        </>
      ) : (
        <Text style={styles.meta}>You are not logged in.</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' },
  meta: { marginTop: 12, color: '#666' },
  header: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  userInfo: { marginLeft: 14, flex: 1 },
  name: { fontSize: 18, fontWeight: '700' },
  email: { marginTop: 4, color: '#666' },
  button: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#b00020',
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
