import { useCallback, useEffect, useState } from 'react';

import { getItemById } from '@/services/items';
import type { SellerItem } from '@/services/items';

export function useItem(itemId: string) {
  const [item, setItem] = useState<SellerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    const res = await getItemById(itemId);
    if (!res.ok) {
      setItem(null);
      setError(res.error);
      setLoading(false);
      return;
    }

    setItem(res.item);
    setLoading(false);
  }, [itemId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { item, loading, error, refresh };
}
