import React from 'react';
import { Calendar, Zap } from 'lucide-react';
import type { Event } from '../../../../events/domain/models/Event';
import type { UseQueryResult } from '@tanstack/react-query';
import type { EventMetricsResponse } from '../../../application/useOrganizerEvents';
import { Skeleton } from '../../../../../shared/components/ui/Skeleton';
import { formatDate } from '../../../../../shared/utils/dateUtils';

interface OrganizerStats {
  totalQuota: number;
  available: number;
  held: number;
  sold: number;
  admitted: number;
  refunded: number;
}

interface OrganizerAnalyticsOverviewProps {
  events: Event[];
  eventsLoading: boolean;
  stats: OrganizerStats;
  metricQueries: UseQueryResult<EventMetricsResponse, Error>[];
}

export function OrganizerAnalyticsOverview({
  events,
  eventsLoading,
  stats,
  metricQueries,
}: OrganizerAnalyticsOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Card 1: Graph & Data */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 self-start mb-4">Total Penjualan</h3>
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" className="stroke-gray-100" strokeWidth="12" fill="transparent" />
            <circle
              cx="70"
              cy="70"
              r="60"
              className="stroke-[#0064D2]"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 60}
              strokeDashoffset={
                2 * Math.PI * 60 -
                ((stats.totalQuota > 0 ? (stats.sold / stats.totalQuota) : 0) * 2 * Math.PI * 60)
              }
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-black text-gray-900">
              {stats.totalQuota > 0 ? Math.round((stats.sold / stats.totalQuota) * 100) : 0}%
            </span>
          </div>
        </div>
        <div className="w-full flex justify-between items-center text-center">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Kuota Platform</p>
            <p className="text-lg font-black text-slate-800">{stats.totalQuota.toLocaleString('id-ID')}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tiket Terjual</p>
            <p className="text-lg font-black text-[#0064D2]">{stats.sold.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Card 2: Current Event & Gate Data */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Live Gate Check-in
        </h3>

        {(() => {
          if (eventsLoading) return (
            <div className="flex flex-col gap-4 flex-1 justify-center mt-2">
              <div className="flex items-center gap-4">
                <Skeleton variant="shimmer" className="w-12 h-12 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="shimmer" className="h-4 w-3/4" />
                  <Skeleton variant="shimmer" className="h-3 w-1/2" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4 mt-1">
                <div className="flex justify-between items-center">
                  <Skeleton variant="shimmer" className="h-3 w-1/3" />
                  <Skeleton variant="shimmer" className="h-4 w-1/4" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton variant="shimmer" className="h-3 w-1/3" />
                  <Skeleton variant="shimmer" className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          );
          if (!events || events.length === 0) return <div className="text-sm text-gray-400 my-auto text-center">Belum ada event</div>;

          const now = new Date();
          const eventsWithMetrics = events.map((evt, idx) => {
            const metrics = metricQueries[idx]?.data?.metrics ?? [];
            const totals = metrics.reduce(
              (acc, m) => ({
                total: acc.total + (m.total || 0),
                sold: acc.sold + (m.sold || 0),
                admitted: acc.admitted + (m.admitted || 0),
              }),
              { total: 0, sold: 0, admitted: 0 }
            );
            return { evt, totals };
          });

          const currentEvent = eventsWithMetrics.length > 0
            ? eventsWithMetrics.reduce((prev, current) => {
                const prevDiff = Math.abs(new Date(prev.evt.date).getTime() - now.getTime());
                const currDiff = Math.abs(new Date(current.evt.date).getTime() - now.getTime());
                return currDiff < prevDiff ? current : prev;
              })
            : null;

          if (!currentEvent) return <div className="text-sm text-gray-400 my-auto text-center">Belum ada event</div>;

          return (
            <div className="flex flex-col gap-4 flex-1 justify-center">
              <div className="flex items-center gap-4">
                {currentEvent.evt.image_url ? (
                  <img
                    src={currentEvent.evt.image_url}
                    alt={currentEvent.evt.name}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-gray-300" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-black text-gray-900 line-clamp-2 leading-tight">
                    {currentEvent.evt.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                    {formatDate(currentEvent.evt.date)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 mt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Total Sold</span>
                  <span className="text-sm font-black text-gray-700">{currentEvent.totals.sold.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Gate Admitted</span>
                  <span className="text-sm font-black text-purple-600">{currentEvent.totals.admitted.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
