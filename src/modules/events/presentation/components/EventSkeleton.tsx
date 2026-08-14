export function EventSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse h-[380px] flex flex-col justify-between p-4">
      <div className="h-44 bg-gray-200 rounded-xl" />
      <div className="space-y-3 my-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="h-10 bg-gray-200 rounded-xl mt-auto" />
    </div>
  );
}
