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

function inferContentType(filename: string, blobType?: string) {
  if (blobType && blobType.includes('/')) return blobType;
  const lower = filename.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

async function uriToBlob(localUri: string): Promise<Blob> {
  const res = await fetch(localUri);
  if (!res.ok) {
    throw new Error(`Failed to read image: ${res.status}`);
  }

  const blob = await res.blob();
  if (!blob || blob.size === 0) {
    throw new Error('Failed to read image: empty blob');
  }

  return blob;
}

export async function uploadImage(localUri: string, userId: string, itemId: string): Promise<string> {
  const filename = getFileName(localUri);
  const path = `${userId}/${itemId}/${filename}`;

  const blob = await uriToBlob(localUri);

  const contentType = inferContentType(filename, blob.type);
  const FileCtor = (globalThis as unknown as { File?: unknown }).File;
  const body =
    typeof FileCtor === 'function'
      ? new (FileCtor as any)([blob], filename, { type: contentType })
      : blob;

  const { error: uploadError } = await supabase.storage.from('item-images').upload(path, body, {
    contentType,
    upsert: true,
  });

  if (uploadError) {
    const details = JSON.stringify(uploadError, Object.getOwnPropertyNames(uploadError));
    throw new Error(`${uploadError.message}${details ? ` (${details})` : ''}`);
  }

  const { data } = supabase.storage.from('item-images').getPublicUrl(path);

  if (!data.publicUrl) {
    throw new Error('Failed to get public URL');
  }

  return data.publicUrl;
}
