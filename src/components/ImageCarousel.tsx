import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

type Props = {
  images: string[];
  height?: number;
  aspectRatio?: number;
  onPressImage?: (index: number) => void;
};

type ImageItemProps = {
  uri: string;
  width: number;
  height: number;
  active: boolean;
  onPress?: () => void;
};

const ImageItem = memo(function ImageItem({ uri, width, height, active, onPress }: ImageItemProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View style={[styles.slide, { width, height }, !active ? styles.slideInactive : null]}>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      </View>
    </Pressable>
  );
});

export function ImageCarousel({ images, height, aspectRatio = 1, onPressImage }: Props) {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<string> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const data = useMemo(() => images.filter(Boolean), [images]);

  const resolvedHeight = useMemo(() => {
    if (typeof height === 'number') return height;
    const safeRatio = aspectRatio > 0 ? aspectRatio : 1;
    return width > 0 ? width / safeRatio : 320;
  }, [aspectRatio, height, width]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = width > 0 ? Math.round(x / width) : 0;
      setActiveIndex(Math.max(0, Math.min(next, data.length - 1)));
    },
    [data.length, width],
  );

  const keyExtractor = useCallback((uri: string, index: number) => `${index}-${uri}`, []);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<string>) => {
      return (
        <ImageItem
          uri={item}
          width={width}
          height={resolvedHeight}
          active={index === activeIndex}
          onPress={onPressImage ? () => onPressImage(index) : undefined}
        />
      );
    },
    [activeIndex, onPressImage, resolvedHeight, width],
  );

  if (data.length === 0) {
    return <View style={[styles.empty, { height: resolvedHeight }]} />;
  }

  return (
    <View style={[styles.wrap, { height: resolvedHeight }]}>
      <FlatList
        ref={(r) => {
          listRef.current = r;
        }}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        snapToInterval={width}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={2}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
        getItemLayout={(_d, index) => ({ length: width, offset: width * index, index })}
      />

      {data.length > 1 ? (
        <View style={styles.dots} pointerEvents="none">
          {data.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex ? styles.dotActive : undefined]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: '#fafafa',
    borderRadius: 16,
    overflow: 'hidden',
  },
  slide: {
    backgroundColor: '#f1f1f1',
  },
  slideInactive: {
    opacity: 0.92,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  empty: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    borderRadius: 14,
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: {
    width: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
});
