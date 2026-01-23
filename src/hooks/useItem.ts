import { useMemo } from 'react';

import { ItemsService } from '@/services/itemsService';

export function useItem(itemId: string) {
  const item = useMemo(() => ItemsService.getItemById(itemId), [itemId]);
  return { item };
}
