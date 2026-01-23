export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  itemTitle: string;
  priceCents: number;
  status: OrderStatus;
};
