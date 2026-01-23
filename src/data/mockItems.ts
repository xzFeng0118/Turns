import type { MarketplaceItem } from '@/types/marketplace';

export const mockItems: MarketplaceItem[] = [
  {
    id: 'item_1',
    title: 'Mountain Bike - 27.5"',
    priceCents: 35000,
    condition: 'good',
    location: 'Melbourne',
  },
  {
    id: 'item_2',
    title: 'iPhone 13 Case (new)',
    priceCents: 1500,
    condition: 'new',
    location: 'Sydney',
  },
  {
    id: 'item_3',
    title: 'Standing Desk',
    priceCents: 12000,
    condition: 'fair',
    location: 'Brisbane',
  },
];
