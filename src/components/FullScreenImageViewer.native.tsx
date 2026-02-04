import React from 'react';
import ImageViewing from 'react-native-image-viewing';

type Props = {
  images: Array<{ uri: string }>;
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  onImageIndexChange?: (index: number) => void;
};

export function FullScreenImageViewer({ images, imageIndex, visible, onRequestClose, onImageIndexChange }: Props) {
  return (
    <ImageViewing
      images={images}
      imageIndex={imageIndex}
      visible={visible}
      onRequestClose={onRequestClose}
      onImageIndexChange={onImageIndexChange}
      swipeToCloseEnabled
      doubleTapToZoomEnabled
    />
  );
}
