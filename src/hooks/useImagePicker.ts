import { useCallback, useState } from 'react';

import { MediaService } from '@/services/mediaService';
import type { PickedImage } from '@/types/media';

type UseImagePickerState = {
  images: PickedImage[];
  isPicking: boolean;
  error?: string;
};

export function useImagePicker() {
  const [state, setState] = useState<UseImagePickerState>({
    images: [],
    isPicking: false,
  });

  const pickFromLibrary = useCallback(async () => {
    setState((s) => ({ ...s, isPicking: true, error: undefined }));

    const result = await MediaService.pickImagesFromLibrary();

    if (!result.ok) {
      const message =
        result.reason === 'permission_denied'
          ? 'Media library permission denied.'
          : result.reason === 'cancelled'
            ? undefined
            : 'Failed to pick images.';

      setState((s) => ({ ...s, isPicking: false, error: message }));
      return;
    }

    setState((s) => ({
      ...s,
      isPicking: false,
      images: [...s.images, ...result.images],
    }));
  }, []);

  const removeImageByUri = useCallback((uri: string) => {
    setState((s) => ({ ...s, images: s.images.filter((i) => i.uri !== uri) }));
  }, []);

  const clear = useCallback(() => {
    setState({ images: [], isPicking: false });
  }, []);

  return {
    images: state.images,
    isPicking: state.isPicking,
    error: state.error,
    pickFromLibrary,
    removeImageByUri,
    clear,
  };
}
