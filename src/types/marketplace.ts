export type MarketplaceItem = {
  id: string;
  title: string;
  priceCents: number;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  location: string;
};
