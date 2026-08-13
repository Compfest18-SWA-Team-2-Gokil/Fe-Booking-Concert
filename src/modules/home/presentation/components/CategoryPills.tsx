import { CATEGORIES } from '../../constants/homeData';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelect: (id: string) => void;
}

export function CategoryPills({ selectedCategory, onSelect }: CategoryPillsProps) {
  return (
    <section className="-mt-6 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`shrink-0 px-5 py-3 rounded-full text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-[#0064D2] text-white shadow-blue-500/25 shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-[#0064D2]'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
