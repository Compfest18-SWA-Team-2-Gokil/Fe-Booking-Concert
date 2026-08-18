import React from 'react';
import { Ticket, ShoppingBag, Shield, QrCode, RotateCcw } from 'lucide-react';

export const ROLE_LABEL: Record<string, string> = {
  BUYER: 'Pembeli',
  ORGANIZER: 'Organizer',
  GATE_OPERATOR: 'Gate Operator',
  ADMIN: 'Admin',
};

export const ROLE_BADGE: Record<string, string> = {
  BUYER: 'bg-blue-100 text-[#0064D2]',
  ORGANIZER: 'bg-purple-100 text-purple-700',
  GATE_OPERATOR: 'bg-emerald-100 text-emerald-700',
  ADMIN: 'bg-red-100 text-red-700',
};

export type NavLink = { to: string; label: string; matchPrefix?: string };

export function getNavLinks(role?: string): NavLink[] {
  switch (role) {
    case 'BUYER':
      return [
        { to: '/events', label: 'Semua Events' },
        { to: '/my-tickets', label: 'Tiket Saya', matchPrefix: '/my-tickets' },
      ];
    case 'ORGANIZER':
      return [
        { to: '/events', label: 'Semua Events' },
        { to: '/organizer/my-events', label: 'Event Saya', matchPrefix: '/organizer/my-events' },
        { to: '/organizer/refunds', label: 'Persetujuan Refund', matchPrefix: '/organizer/refunds' },
      ];
    case 'ADMIN':
      return [
        { to: '/events', label: 'Semua Events' },
        { to: '/admin/dashboard', label: 'Admin Panel', matchPrefix: '/admin' },
      ];
    case 'GATE_OPERATOR':
      return [
        { to: '/events', label: 'Semua Events' },
        { to: '/gate/scan', label: 'Scan QR', matchPrefix: '/gate' },
      ];
    default:
      return [
        { to: '/', label: 'Beranda' },
        { to: '/events', label: 'Semua Events' },
      ];
  }
}

export type DropdownItem = { to: string; label: string; icon: React.ElementType };

export function getDropdownItems(role?: string): DropdownItem[] {
  switch (role) {
    case 'BUYER':
      return [
        { to: '/events', label: 'Semua Events', icon: ShoppingBag },
        { to: '/my-tickets', label: 'Tiket Saya', icon: Ticket },
      ];
    case 'ORGANIZER':
      return [
        { to: '/events', label: 'Semua Events', icon: ShoppingBag },
        { to: '/organizer/my-events', label: 'Event Saya', icon: ShoppingBag },
        { to: '/organizer/refunds', label: 'Persetujuan Refund', icon: RotateCcw },
        { to: '/organizer/events/create', label: 'Buat Event Baru', icon: ShoppingBag },
      ];
    case 'ADMIN':
      return [
        { to: '/events', label: 'Semua Events', icon: ShoppingBag },
        { to: '/admin/dashboard', label: 'Admin Panel', icon: Shield },
      ];
    case 'GATE_OPERATOR':
      return [
        { to: '/events', label: 'Semua Events', icon: ShoppingBag },
        { to: '/gate/scan', label: 'Scanner QR', icon: QrCode },
      ];
    default:
      return [];
  }
}

export function getAvatarBg(role?: string): string {
  switch (role) {
    case 'ADMIN':
      return 'bg-gradient-to-br from-red-500 to-red-700';
    case 'ORGANIZER':
      return 'bg-gradient-to-br from-purple-500 to-purple-700';
    case 'GATE_OPERATOR':
      return 'bg-gradient-to-br from-emerald-500 to-emerald-700';
    default:
      return 'bg-gradient-to-br from-[#0064D2] to-blue-700';
  }
}
