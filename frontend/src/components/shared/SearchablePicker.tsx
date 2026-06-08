import type { ReactNode } from 'react';
import { Search } from 'lucide-react';

interface SearchablePickerProps<T extends { id: number }> {
  items: T[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedId?: number;
  onSelect: (item: T) => void;
  searchPlaceholder?: string;
  isLoading?: boolean;
  isError?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  renderItem: (item: T, isSelected: boolean) => ReactNode;
  maxHeight?: string;
}

export function SearchablePicker<T extends { id: number }>({
  items,
  searchTerm,
  onSearchChange,
  selectedId,
  onSelect,
  searchPlaceholder = 'Buscar...',
  isLoading,
  isError,
  loadingMessage = 'Cargando...',
  errorMessage = 'Error al cargar los datos.',
  emptyMessage = 'No se encontraron resultados.',
  emptyIcon,
  renderItem,
  maxHeight = '280px',
}: SearchablePickerProps<T>) {
  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">{loadingMessage}</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-xs text-rose-500">{errorMessage}</div>;
  }

  return (
    <>
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs outline-hidden focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 focus:bg-white transition-all"
        />
      </div>

      <div
        className="border border-slate-200 rounded-xl overflow-y-auto bg-white shadow-3xs"
        style={{ maxHeight }}
      >
        {items.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
            {emptyIcon && <div className="mb-2 text-slate-300">{emptyIcon}</div>}
            <p className="text-xs font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={`flex items-center justify-between p-3 cursor-pointer transition-all ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/60'}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {renderItem(item, isSelected)}
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}
                  >
                    {isSelected && <span className="text-[9px] font-bold">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
