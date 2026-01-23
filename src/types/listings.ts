export type ListingStatus = 'draft' | 'active' | 'paused' | 'sold';

export type Listing = {
  id: string;
  title: string;
  priceCents: number;
  status: ListingStatus;
};
