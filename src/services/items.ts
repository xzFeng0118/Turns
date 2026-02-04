import { supabase } from '@/lib/supabase';
import type { ListingStatus } from '@/types/listings';
import type { MarketplaceItem } from '@/types/marketplace';

type ItemsRow = {
  id: string;
  title: string;
  description: string | null;
  price_cents: number;
  condition: MarketplaceItem['condition'];
  location: string;
  images: string[] | null;
  status: ListingStatus;
  seller_id: string;
};

export type SellerItem = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  images: string[];
  status: ListingStatus;
  condition: MarketplaceItem['condition'];
  location: string;
};

type CreateItemInput = {
  title: string;
  description: string;
  priceCents: number;
  images: string[];
  status?: ListingStatus;
  condition?: MarketplaceItem['condition'];
  location?: string;
};

type UpdateItemInput = Partial<CreateItemInput>;

function toSellerItem(row: ItemsRow): SellerItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    priceCents: row.price_cents,
    images: row.images ?? [],
    status: row.status,
    condition: row.condition,
    location: row.location,
  };
}

function toItemsUpdate(input: UpdateItemInput) {
  const update: Partial<ItemsRow> = {};

  if (input.title !== undefined) update.title = input.title;
  if (input.description !== undefined) update.description = input.description;
  if (input.priceCents !== undefined) update.price_cents = input.priceCents;
  if (input.images !== undefined) update.images = input.images;
  if (input.status !== undefined) update.status = input.status;
  if (input.condition !== undefined) update.condition = input.condition;
  if (input.location !== undefined) update.location = input.location;

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
      price_cents: input.priceCents,
      images: input.images,
      status: input.status ?? 'active',
      condition: input.condition ?? 'good',
      location: input.location ?? '',
      seller_id: userId,
    })
    .select('id,title,description,price_cents,condition,location,images,status,seller_id')
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  if (!data) throw new Error('Failed to create item');

  return toSellerItem(data as ItemsRow);
}

export async function getMyItems(): Promise<SellerItem[]> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from('items')
    .select('id,title,description,price_cents,condition,location,images,status,seller_id')
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
    .select('id,title,description,price_cents,condition,location,images,status,seller_id')
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  if (!data) throw new Error('Item not found');

  return toSellerItem(data as ItemsRow);
}
