import { supabase } from '@/lib/supabase';
import type { ListingStatus } from '@/types/listings';

type ItemsRow = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  status: ListingStatus;
  seller_id: string;
  created_at: string;
};

export type SellerItem = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  images: string[];
  status: ListingStatus;
  sellerId: string;
  createdAt: string;
};

export type GetAvailableItemsResult =
  | { ok: true; items: SellerItem[] }
  | { ok: false; error: string };

 export type GetItemByIdResult =
   | { ok: true; item: SellerItem | null }
   | { ok: false; error: string };

type CreateItemInput = {
  title: string;
  description: string;
  priceCents: number;
  images: string[];
  status?: ListingStatus;
};

type UpdateItemInput = Partial<CreateItemInput>;

function normalizeImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((v): v is string => typeof v === 'string');
      }
    } catch {
      // ignore
    }

    return [value];
  }

  return [];
}

function toSellerItem(row: ItemsRow): SellerItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    priceCents: row.price,
    images: normalizeImages(row.images),
    status: row.status,
    sellerId: row.seller_id,
    createdAt: row.created_at,
  };
}

function toItemsUpdate(input: UpdateItemInput) {
  const update: Partial<ItemsRow> = {};

  if (input.title !== undefined) update.title = input.title;
  if (input.description !== undefined) update.description = input.description;
  if (input.priceCents !== undefined) update.price = input.priceCents;
  if (input.images !== undefined) update.images = input.images;
  if (input.status !== undefined) update.status = input.status;

  return update;
}

function formatSupabaseError(error: unknown) {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === 'string') return msg;
  }
  return 'Unknown error';
}

async function requireUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(formatSupabaseError(error));
  if (!data.user) throw new Error('Not authenticated');
  return data.user.id;
}

export async function createItem(input: CreateItemInput): Promise<SellerItem> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from('items')
    .insert({
      title: input.title,
      description: input.description,
      price: input.priceCents,
      images: input.images,
      status: input.status ?? 'active',
      seller_id: userId,
    })
    .select('id,title,description,price,images,status,seller_id,created_at')
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  if (!data) throw new Error('Failed to create item');

  return toSellerItem(data as ItemsRow);
}

export async function getAvailableItems(limit: number, offset: number): Promise<GetAvailableItemsResult> {
  try {
    const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)));
    const safeOffset = Math.max(0, Math.floor(offset));

    const from = safeOffset;
    const to = safeOffset + safeLimit - 1;

    const { data, error } = await supabase
      .from('items')
      .select('id,title,description,price,images,status,seller_id,created_at')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return { ok: false, error: formatSupabaseError(error) };
    }

    const items = ((data ?? []) as ItemsRow[]).map(toSellerItem);
    return { ok: true, items };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to load items.' };
  }
}

 export async function getItemById(itemId: string): Promise<GetItemByIdResult> {
   try {
     const trimmedId = itemId.trim();
     if (!trimmedId) {
       return { ok: false, error: 'Missing item id' };
     }

     const { data, error } = await supabase
       .from('items')
       .select('id,title,description,price,images,status,seller_id,created_at')
       .eq('id', trimmedId)
       .maybeSingle();

     if (error) {
       return { ok: false, error: formatSupabaseError(error) };
     }

     if (!data) {
       return { ok: true, item: null };
     }

     return { ok: true, item: toSellerItem(data as ItemsRow) };
   } catch (e) {
     return {
       ok: false,
       error: e instanceof Error ? e.message : 'Failed to load item.',
     };
   }
 }

export async function getMyItems(): Promise<SellerItem[]> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from('items')
    .select('id,title,description,price,images,status,seller_id,created_at')
    .eq('seller_id', userId)
    .order('id', { ascending: false });

  if (error) throw new Error(formatSupabaseError(error));

  return ((data ?? []) as ItemsRow[]).map(toSellerItem);
}

export async function updateItem(itemId: string, input: UpdateItemInput): Promise<SellerItem> {
  const userId = await requireUserId();

  const update = toItemsUpdate(input);
  if (Object.keys(update).length === 0) {
    throw new Error('No fields to update');
  }

  const { data, error } = await supabase
    .from('items')
    .update(update)
    .eq('id', itemId)
    .eq('seller_id', userId)
    .select('id,title,description,price,images,status,seller_id,created_at')
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  if (!data) throw new Error('Item not found');

  return toSellerItem(data as ItemsRow);
}
