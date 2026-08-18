interface TicketQRUnitTabsProps {
  unitIds: string[];
  selectedIndex: number;
  statusMap: Record<string, string>;
  onSelectIndex: (index: number) => void;
}

export function TicketQRUnitTabs({
  unitIds,
  selectedIndex,
  statusMap,
  onSelectIndex,
}: TicketQRUnitTabsProps) {
  if (unitIds.length <= 1) return null;

  return (
    <div className="bg-gray-50 border-b border-gray-100 px-6 py-2.5 flex items-center justify-between gap-2">
      <span className="text-xs font-semibold text-gray-500">Pilih Tiket:</span>
      <div className="flex gap-1.5 overflow-x-auto py-0.5">
        {unitIds.map((uId, idx) => {
          const s = statusMap[uId];
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#0064D2] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span>Tiket #{idx + 1}</span>
              {s === 'ADMITTED' && <span className="text-[10px] opacity-80">(Terpakai)</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
