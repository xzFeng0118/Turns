import { useMemo } from 'react';

import { ItemsService } from '@/services/itemsService';

export function useItems() {
  const items = useMemo(() => ItemsService.listItems(), []);
  return { items };
}
