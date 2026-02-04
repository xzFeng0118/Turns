import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  images: Array<{ uri: string }>;
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  onImageIndexChange?: (index: number) => void;
};

export function FullScreenImageViewer({ images, imageIndex, visible, onRequestClose, onImageIndexChange }: Props) {
  const listRef = useRef<FlatList<{ uri: string }> | null>(null);
  const [activeIndex, setActiveIndex] = useState(imageIndex);

  const { width, height } = useMemo(() => {
    const d = Dimensions.get('window');
    return { width: d.width, height: d.height };
  }, []);

  useEffect(() => {
    setActiveIndex(imageIndex);
  }, [imageIndex]);

  useEffect(() => {
    if (!visible) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: width * imageIndex, animated: false });
    });
  }, [imageIndex, visible, width]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = width > 0 ? Math.round(x / width) : 0;
      setActiveIndex(next);
      onImageIndexChange?.(next);
    },
    [onImageIndexChange, width],
  );

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onRequestClose} transparent>
      <View style={styles.backdrop}>
        <View style={styles.topBar}>
          <Text style={styles.counter}>
            {images.length > 0 ? `${activeIndex + 1} / ${images.length}` : ''}
          </Text>
          <Pressable onPress={onRequestClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>

        <FlatList
          ref={(r) => {
            listRef.current = r;
          }}
          data={images}
          keyExtractor={(it, idx) => `${idx}-${it.uri}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={({ item }) => (
            <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={{ uri: item.uri }} style={[styles.image, { maxWidth: width, maxHeight: height }]} resizeMode="contain" />
            </View>
          )}
          getItemLayout={(_d, idx) => ({ length: width, offset: width * idx, index: idx })}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  counter: {
    color: '#fff',
    fontWeight: '800',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  closeText: {
    color: '#fff',
    fontWeight: '800',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
