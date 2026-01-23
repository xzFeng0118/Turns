import type { Listing } from '@/types/listings';

const mockListings: Listing[] = [
  {
    id: 'listing_1',
    title: 'Dyson V8 Vacuum',
    priceCents: 19000,
    status: 'active',
  },
  {
    id: 'listing_2',
    title: 'Coffee Grinder',
    priceCents: 6500,
    status: 'paused',
  },
  {
    id: 'listing_3',
    title: 'Gaming Chair',
    priceCents: 9000,
    status: 'draft',
  },
];

export const ListingsService = {
  listMyListings(): Listing[] {
    return mockListings;
  },
};
