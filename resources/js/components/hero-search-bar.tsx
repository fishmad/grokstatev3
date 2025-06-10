import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { AdvancedSearchSheet } from './advanced-search-sheet';
import 'rc-slider/assets/index.css';
import { router } from '@inertiajs/react';

interface HeroSearchBarProps {
  search?: string; // Add search prop
}

export function HeroSearchBar({ search: initialSearch = '' }: HeroSearchBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState(initialSearch); // Use initialSearch from props

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send search to properties.index with search param
    router.get(route('properties.index'), { search });
  };

  return (
    <form className="w-full flex flex-col gap-3 items-center" onSubmit={handleSubmit}>
      <div className="flex w-full flex-col md:flex-row gap-3 items-center relative">
        {/* Clear (X) icon appears when search has text */}
        {search && (
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
            style={{ zIndex: 2 }}
            tabIndex={0}
            aria-label="Clear search"
            onClick={() => {
              setSearch('');
              router.get(route('properties.index'), {}); // Clear search and reset results
            }}
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <Input
          className="px-5 flex-1 min-w-0 h-20 md:h-16 text-lg font-semibold bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-sm focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 focus:border-orange-400 dark:focus:border-orange-600 placeholder:text-lg placeholder:font-normal placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-lg md:rounded-xl transition-all pr-14 !text-xl py-4"
          style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04), 0 1.5px 3px 0 rgba(0,0,0,0.02)', ...(search ? { paddingLeft: '2.5rem' } : {}) }}
          placeholder="Search by suburb, postcode, or property type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-orange-500 active:bg-orange-600 text-neutral-700 dark:text-white shadow transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300"
          aria-label="Search"
        >
          <Search className="h-5 w-5 md:h-6 md:w-6 text-neutral-700 dark:text-white" />
        </button>
      </div>
      <AdvancedSearchSheet open={showAdvanced} onOpenChange={setShowAdvanced} />
    </form>
  );
}