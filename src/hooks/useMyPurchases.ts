import { useMemo } from 'react';

import { OrdersService } from '@/services/ordersService';

export function useMyPurchases() {
  const orders = useMemo(() => OrdersService.listMyPurchases(), []);
  return { orders };
}
