import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrder, getStoredOrders } from '../infrastructure/ordersApi';

export function usePaymentCallback() {
  const [searchParams] = useSearchParams();
  const [showQR, setShowQR] = useState(false);

  const queryOrderId =
    searchParams.get('order_id') ||
    searchParams.get('orderId') ||
    searchParams.get('external_id') ||
    searchParams.get('id') ||
    '';

  const storedOrders = getStoredOrders();
  const targetOrderId = queryOrderId || storedOrders[0]?.orderId || '';
  const matchingStored = storedOrders.find((o) => o.orderId === targetOrderId) || storedOrders[0];

  const {
    data: order,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['order-callback', targetOrderId],
    queryFn: () => getOrder(targetOrderId),
    enabled: !!targetOrderId,
    refetchInterval: (query) => {
      const st = query.state.data?.status;
      return st === 'PENDING' || st === 'PAYMENT_PENDING' ? 2500 : false;
    },
  });

  const status = order?.status ?? 'PENDING';
  const isPaid = status === 'PAID';
  const isPending = status === 'PENDING' || status === 'PAYMENT_PENDING';
  const isCancelled = status === 'CANCELLED';
  const isRefund = status === 'REFUND_REQUESTED' || status === 'REFUNDED';

  return {
    targetOrderId,
    matchingStored,
    order,
    status,
    isLoading,
    isPaid,
    isPending,
    isCancelled,
    isRefund,
    isFetching,
    refetch,
    showQR,
    setShowQR,
  };
}
