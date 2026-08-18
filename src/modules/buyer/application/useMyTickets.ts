import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyOrders,
  requestRefund,
  initiatePayment,
  getStoredOrders,
  type StoredOrder,
  type Order,
} from '../../orders/infrastructure/ordersApi';
import { useAuth } from '../../auth/application/useAuth';
import { showAlert, showToast } from '../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../shared/utils/apiError';

export interface TicketItem {
  stored: StoredOrder;
  order: Order | null;
  isLoading: boolean;
}

export function useMyTickets() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState('');

  const isSearching = Boolean(search.trim());

  // Reset search page when query changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchPage(1);
  }, [search]);

  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundedIds, setRefundedIds] = useState<Set<string>>(new Set());
  const [payingId, setPayingId] = useState<string | null>(null);
  const [qrModalOrder, setQrModalOrder] = useState<StoredOrder | null>(null);

  // Primary source of truth:
  // Jika sedang mencari (search), ambil data global (limit: 1000) agar pencarian mencakup SEMUA halaman pesanan buyer.
  // Jika tidak mencari, gunakan pagination per halaman normal (limit: 10).
  const { data: serverResponse, isLoading: serverLoading, isError } = useQuery({
    queryKey: ['my-orders', isSearching ? 'search-all' : page, isSearching ? 1000 : limit],
    queryFn: () => getMyOrders(isSearching ? 1 : page, isSearching ? 1000 : limit),
    enabled: !!token,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });

  const serverOrders = useMemo(() => serverResponse?.orders ?? [], [serverResponse?.orders]);
  const serverPagination = serverResponse?.pagination;

  // Fallback cache di localStorage jika ada
  const localOrders = getStoredOrders();
  const localMap = useMemo(() => new Map(localOrders.map((o) => [o.orderId, o])), [localOrders]);

  // Buat list TicketItem dari serverOrders
  const allTickets: TicketItem[] = useMemo(() => {
    return serverOrders.map((order) => {
      const local = localMap.get(order.id);
      
      const eventName = order.event_name || local?.eventName || 'Event Tiket';
      const unitIds = (order.unit_ids && order.unit_ids.length > 0) 
        ? order.unit_ids 
        : (local?.unitIds ?? []);

      const stored: StoredOrder = {
        orderId: order.id,
        eventId: order.event_id,
        eventName,
        unitIds,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
      };

      return {
        stored,
        order,
        isLoading: false,
      };
    });
  }, [serverOrders, localMap]);

  // Pencarian global mencakup semua data pesanan
  const allMatchingTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allTickets;

    return allTickets.filter((t) => {
      const nameMatch = t.stored.eventName.toLowerCase().includes(q);
      const orderIdMatch = t.stored.orderId.toLowerCase().includes(q);
      return nameMatch || orderIdMatch;
    });
  }, [allTickets, search]);

  // Pagination untuk hasil pencarian
  const paginatedTickets = useMemo(() => {
    if (!isSearching) return allTickets;

    const start = (searchPage - 1) * limit;
    return allMatchingTickets.slice(start, start + limit);
  }, [isSearching, allTickets, allMatchingTickets, searchPage, limit]);

  // Objek pagination dinamis
  const pagination = useMemo(() => {
    if (isSearching) {
      const totalItems = allMatchingTickets.length;
      return {
        current_page: searchPage,
        per_page: limit,
        total_items: totalItems,
        total_pages: Math.max(1, Math.ceil(totalItems / limit)),
      };
    }
    return serverPagination;
  }, [isSearching, allMatchingTickets.length, searchPage, limit, serverPagination]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (isSearching) {
        setSearchPage(newPage);
      } else {
        setPage(newPage);
      }
    },
    [isSearching]
  );

  const refundMutation = useMutation({
    mutationFn: (orderId: string) => requestRefund(orderId),
    onSuccess: (_, orderId) => {
      setRefundedIds((prev) => new Set([...prev, orderId]));
      setRefundingId(null);
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      showAlert.success(
        'Pengajuan Refund Berhasil',
        'Permintaan refund tiket telah dicatat. Organizer akan memproses pengembalian dana.'
      );
    },
    onError: (error: unknown) => {
      setRefundingId(null);
      showAlert.error(
        'Gagal Mengajukan Refund',
        getApiErrorMessage(error, 'Terjadi kendala saat mengajukan refund. Silakan coba kembali.')
      );
    },
  });

  const handleRefundClick = useCallback(
    async (orderId: string, eventName: string) => {
      const isConfirmed = await showAlert.confirm({
        title: 'Ajukan Refund Tiket?',
        text: `Apakah kamu yakin ingin mengajukan refund untuk pesanan "${eventName}"?`,
        confirmText: 'Ya, Ajukan Refund',
        cancelText: 'Batalkan',
        icon: 'warning',
        isDanger: true,
      });
      if (isConfirmed) {
        setRefundingId(orderId);
        refundMutation.mutate(orderId);
      }
    },
    [refundMutation]
  );

  const handlePayClick = useCallback(async (orderId: string) => {
    setPayingId(orderId);
    try {
      const res = await initiatePayment(orderId);
      window.open(res.invoice_url, '_blank');
      showToast.success('Halaman pembayaran dibuka di tab baru!');
    } catch (error: unknown) {
      showAlert.error(
        'Gagal Membuka Pembayaran',
        getApiErrorMessage(error, 'Tidak dapat membuat invoice pembayaran untuk order ini.')
      );
    } finally {
      setPayingId(null);
    }
  }, []);

  const activeCount = allTickets.filter((t) => t.order?.status === 'PAID').length;
  const pendingCount = allTickets.filter(
    (t) => t.order?.status === 'PENDING' || t.order?.status === 'PAYMENT_PENDING'
  ).length;

  return {
    storedOrders: localOrders,
    tickets: allTickets,
    filteredTickets: paginatedTickets,
    totalMatchingCount: allMatchingTickets.length,
    search,
    setSearch,
    pagination,
    page: isSearching ? searchPage : page,
    setPage: handlePageChange,
    activeCount,
    pendingCount,
    refundingId,
    refundedIds,
    payingId,
    qrModalOrder,
    isLoading: serverLoading,
    isError,
    isRefunding: refundMutation.isPending,
    setQrModalOrder,
    handleRefundClick,
    handlePayClick,
  };
}
