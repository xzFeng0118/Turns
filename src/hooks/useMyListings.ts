import { useMemo } from 'react';

import { ListingsService } from '@/services/listingsService';

export function useMyListings() {
  const listings = useMemo(() => ListingsService.listMyListings(), []);
  return { listings };
}
