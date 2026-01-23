import type { Order } from '@/types/orders';

const mockOrders: Order[] = [
  {
    id: 'order_1',
    itemTitle: 'Sony WH-1000XM4 Headphones',
    priceCents: 22000,
    status: 'delivered',
  },
  {
    id: 'order_2',
    itemTitle: 'Nintendo Switch (Used)',
    priceCents: 28000,
    status: 'shipped',
  },
  {
    id: 'order_3',
    itemTitle: 'IKEA Lamp',
    priceCents: 1800,
    status: 'paid',
  },
];

export const OrdersService = {
  listMyPurchases(): Order[] {
    return mockOrders;
  },
};
