import { Image } from 'react-native';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';

const MAX_WIDTH = 1080;

async function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  return await new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error),
    );
  });
}

export async function compressImage(uri: string): Promise<string> {
  const { width, height } = await getImageSize(uri);

  const targetWidth = Math.min(width, MAX_WIDTH);
  const targetHeight = Math.round((height * targetWidth) / width);

  const result = await manipulateAsync(
    uri,
    [{ resize: { width: targetWidth, height: targetHeight } }],
    {
      compress: 0.7,
      format: SaveFormat.JPEG,
      base64: false,
    },
  );

  return result.uri;
}
