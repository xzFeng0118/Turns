import { supabase } from '@/lib/supabase';

function getFileName(localUri: string) {
  const stripped = localUri.split('?')[0] ?? localUri;
  const parts = stripped.split('/').filter(Boolean);
  const last = parts[parts.length - 1] ?? `image_${Date.now()}`;

  if (last.toLowerCase().endsWith('.jpg') || last.toLowerCase().endsWith('.jpeg')) {
    return last.replace(/\.jpeg$/i, '.jpg');
  }

  return `${last}.jpg`;
}

async function uriToBlob(localUri: string): Promise<Blob> {
  const res = await fetch(localUri);
  if (!res.ok) {
    throw new Error(`Failed to read image: ${res.status}`);
  }
  return await res.blob();
}

export async function uploadImage(localUri: string, userId: string, itemId: string): Promise<string> {
  const filename = getFileName(localUri);
  const path = `${userId}/${itemId}/${filename}`;

  const blob = await uriToBlob(localUri);

  const { error: uploadError } = await supabase.storage.from('item-images').upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: true,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from('item-images').getPublicUrl(path);

  if (!data.publicUrl) {
    throw new Error('Failed to get public URL');
  }

  return data.publicUrl;
}
