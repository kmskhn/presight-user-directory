import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Users } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { DirectoryPage } from './DirectoryPage.js';
import { NotFoundPage } from './NotFoundPage.js';
import { SearchInput } from '../components/SearchInput.js';
import { ErrorBoundary } from '../components/ErrorBoundary.js';
import { useFilterParams } from '../hooks/useFilterParams.js';
import { useDebounce } from '../hooks/useDebounce.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Header() {
  const { filters, setFilters } = useFilterParams();
  const [searchInput, setSearchInput] = useState(filters.search);
  const { debouncedValue: debouncedSearch, isPending } = useDebounce(searchInput, 300);

  // Sync debounced value to URL — in useEffect, not during render
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sync search input when URL changes externally (e.g., clear all filters)
  useEffect(() => {
    if (filters.search !== searchInput && !isPending) {
      setSearchInput(filters.search);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  const handleSearchChange = useCallback((val: string) => {
    setSearchInput(val);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 py-4" role="banner">
      <a href="/" className="flex items-center gap-3 text-text-primary text-xl font-semibold no-underline" aria-label="Presight home">
        <Users size={22} color="var(--color-accent)" aria-hidden="true" />
        <span>Presight</span>
      </a>

      <div className="w-full max-w-[400px]">
        <SearchInput value={searchInput} onChange={handleSearchChange} isPending={isPending} />
      </div>
    </header>
  );
}

function AppInner() {
  return (
    <div className="flex flex-col min-h-screen bg-bg text-text-primary font-sans">
      <Header />
      <Routes>
        <Route path="/" element={<DirectoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
