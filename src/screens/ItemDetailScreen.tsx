import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FullScreenImageViewer } from '@/components/FullScreenImageViewer';
import { ImageCarousel } from '@/components/ImageCarousel';
import { Screen } from '@/components/Screen';
import { SellerInfo } from '@/components/SellerInfo';
import { useAuth } from '@/contexts/AuthContext';
import type { RootStackParamList } from '@/navigation/types';
import { getItemById } from '@/services/items';
import type { SellerItem } from '@/services/items';

type Props = NativeStackScreenProps<RootStackParamList, 'ItemDetails'>;

function formatPrice(priceCents: number) {
  return `$${(priceCents / 100).toFixed(2)}`;
}

function sellerLabelFromItem(item: SellerItem) {
  return item.sellerId;
}

function ItemDetailSkeleton() {
  return (
    <Screen style={styles.skeletonScreen}>
      <View style={styles.skeletonCarousel} />

      <View style={styles.skeletonSection}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonPrice} />
      </View>

      <View style={styles.skeletonSection}>
        <View style={styles.skeletonLabel} />
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
      </View>

      <View style={styles.skeletonSection}>
        <View style={styles.skeletonCard} />
      </View>
    </Screen>
  );
}

export function ItemDetailScreen({ route, navigation }: Props) {
  const { user } = useAuth();
  const { itemId } = route.params;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const [item, setItem] = useState<SellerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [buying, setBuying] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [descriptionHasOverflow, setDescriptionHasOverflow] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const descriptionMaxLines = 4;

  const isSeller = useMemo(() => {
    if (!item) return false;
    if (!user) return false;
    return user.id === item.sellerId;
  }, [item, user]);

  const isAvailable = useMemo(() => {
    if (!item) return false;
    return item.status === 'available';
  }, [item]);

  const buyDisabled = useMemo(() => {
    if (!item) return true;
    if (buying) return true;
    if (isSeller) return true;
    if (!isAvailable) return true;
    return false;
  }, [buying, isAvailable, isSeller, item]);

  const buyLabel = useMemo(() => {
    if (!item) return 'Buy';
    if (buying) return 'Buying…';
    if (isSeller) return 'Your item';
    if (!isAvailable) return 'Unavailable';
    return 'Buy';
  }, [buying, isAvailable, isSeller, item]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    const res = await getItemById(itemId);
    if (!res.ok) {
      setItem(null);
      setError(res.error);
      setLoading(false);
      return;
    }

    setItem(res.item);
    setDescriptionExpanded(false);
    setDescriptionHasOverflow(false);
    setLoading(false);
  }, [itemId]);

  useEffect(() => {
    load();
  }, [load]);

  const onPressBuy = useCallback(async () => {
    if (!item) return;
    if (buyDisabled) return;

    setBuying(true);
    try {
      if (!user) {
        navigation.navigate('Login');
        return;
      }

      Alert.alert('Buy', 'Checkout is not implemented yet.');
    } finally {
      setBuying(false);
    }
  }, [buyDisabled, item, navigation, user]);

  const onToggleDescription = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDescriptionExpanded((v) => !v);
  }, []);

  const onDescriptionTextLayout = useCallback(
    (e: { nativeEvent: { lines: Array<unknown> } }) => {
      const linesCount = e.nativeEvent.lines.length;
      if (linesCount > descriptionMaxLines) {
        setDescriptionHasOverflow(true);
      }
    },
    [descriptionMaxLines],
  );

  const viewerImages = useMemo(() => {
    if (!item) return [] as Array<{ uri: string }>;
    return item.images.map((uri) => ({ uri }));
  }, [item]);

  const onPressCarouselImage = useCallback(
    (index: number) => {
      setViewerIndex(index);
      setViewerVisible(true);
    },
    [setViewerIndex, setViewerVisible],
  );

  if (loading) {
    return <ItemDetailSkeleton />;
  }

  if (error) {
    return (
      <Screen>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.muted}>We couldn’t load this item right now.</Text>
        <Text style={styles.error}>{error}</Text>

        <View style={styles.stateActions}>
          <Pressable style={styles.secondaryButton} onPress={load}>
            <Text style={styles.secondaryButtonText}>Try again</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (!item) {
    return (
      <Screen>
        <Text style={styles.title}>Item not found</Text>
        <Text style={styles.muted}>It may have been sold, removed, or you might not have access to it.</Text>

        <View style={styles.stateActions}>
          <Pressable style={styles.secondaryButton} onPress={load}>
            <Text style={styles.secondaryButtonText}>Refresh</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]}>
        <View style={styles.carouselWrap}>
          <ImageCarousel images={item.images} height={320} onPressImage={onPressCarouselImage} />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>{formatPrice(item.priceCents)}</Text>
        </View>

        {item.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text
              style={styles.body}
              numberOfLines={descriptionExpanded ? undefined : descriptionMaxLines}
              onTextLayout={!descriptionExpanded ? onDescriptionTextLayout : undefined}
            >
              {item.description}
            </Text>

            {descriptionHasOverflow ? (
              <Pressable style={styles.descriptionToggle} onPress={onToggleDescription}>
                <Text style={styles.descriptionToggleText}>{descriptionExpanded ? 'Show less' : 'Show more'}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <View style={styles.section}>
          <SellerInfo sellerLabel={sellerLabelFromItem(item)} postedAt={item.createdAt} />
        </View>
      </ScrollView>

      <View style={[styles.stickyBar, { paddingBottom: 12 + insets.bottom }]}>
        <Pressable
          style={[styles.buyButton, buyDisabled ? styles.buyButtonDisabled : null]}
          onPress={onPressBuy}
          disabled={buyDisabled}
        >
          {buying ? <ActivityIndicator color="#fff" /> : null}
          <Text style={styles.buyButtonText}>{buyLabel}</Text>
        </Pressable>
      </View>

      <FullScreenImageViewer
        images={viewerImages}
        imageIndex={viewerIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        onImageIndexChange={setViewerIndex}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 0,
  },
  content: {
    paddingBottom: 20,
  },
  skeletonScreen: {
    padding: 0,
  },
  skeletonCarousel: {
    width: '100%',
    height: 320,
    backgroundColor: '#f1f1f1',
  },
  skeletonSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  skeletonTitle: {
    height: 26,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    width: '72%',
  },
  skeletonPrice: {
    marginTop: 10,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    width: '35%',
  },
  skeletonLabel: {
    height: 12,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    width: 110,
  },
  skeletonLine: {
    marginTop: 10,
    height: 14,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    width: '100%',
  },
  skeletonLineShort: {
    width: '70%',
  },
  skeletonCard: {
    height: 92,
    borderRadius: 16,
    backgroundColor: '#f1f1f1',
    width: '100%',
  },
  carouselWrap: {
    width: '100%',
    backgroundColor: '#fafafa',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  price: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  body: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  descriptionToggle: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  descriptionToggleText: {
    color: '#111',
    fontWeight: '800',
    fontSize: 13,
  },
  muted: {
    marginTop: 10,
    color: '#666',
    lineHeight: 20,
  },
  error: {
    marginTop: 10,
    color: '#b42318',
    lineHeight: 20,
  },
  stateActions: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111',
    fontWeight: '800',
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buyButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#111',
  },
  buyButtonDisabled: {
    opacity: 0.5,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
