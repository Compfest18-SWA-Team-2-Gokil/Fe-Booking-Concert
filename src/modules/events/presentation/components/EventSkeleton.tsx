import { Skeleton } from '../../../../shared/components/ui/Skeleton';

export function EventSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-95 flex flex-col justify-between p-4">
      <Skeleton variant="shimmer" className="h-44 w-full rounded-xl" />
      <div className="space-y-3 my-4">
        <Skeleton variant="shimmer" className="h-4 w-3/4 rounded" />
        <Skeleton variant="shimmer" className="h-3 w-1/2 rounded" />
        <Skeleton variant="shimmer" className="h-3 w-2/3 rounded" />
      </div>
      <Skeleton variant="shimmer" className="h-10 w-full rounded-xl mt-auto" />
    </div>
  );
}
