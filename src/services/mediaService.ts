import * as ImagePicker from 'expo-image-picker';

import type { PickedImage } from '@/types/media';

type PickImagesResult =
  | { ok: true; images: PickedImage[] }
  | { ok: false; reason: 'permission_denied' | 'cancelled' | 'error'; error?: unknown };

export const MediaService = {
  async pickImagesFromLibrary(): Promise<PickImagesResult> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== 'granted') {
      return { ok: false, reason: 'permission_denied' };
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.9,
      });

      if (result.canceled) {
        return { ok: false, reason: 'cancelled' };
      }

      const images: PickedImage[] = (result.assets ?? []).map((a: ImagePicker.ImagePickerAsset) => ({
        uri: a.uri,
        width: a.width,
        height: a.height,
        fileName: a.fileName ?? undefined,
        mimeType: a.mimeType ?? undefined,
        fileSize: a.fileSize ?? undefined,
      }));

      return { ok: true, images };
    } catch (error) {
      return { ok: false, reason: 'error', error };
    }
  },
};
