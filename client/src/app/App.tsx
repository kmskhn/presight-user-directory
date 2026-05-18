import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Users } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { DirectoryPage } from './DirectoryPage.js';
import { SearchInput } from '../components/SearchInput.js';
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
    <header className="app-header" role="banner">
      <a href="/" className="app-header__logo" aria-label="Presight home">
        <Users size={22} color="#8b5cf6" aria-hidden="true" />
        <span>Presight</span>
      </a>

      <div className="app-header__search">
        <SearchInput value={searchInput} onChange={handleSearchChange} isPending={isPending} />
      </div>
    </header>
  );
}

function AppInner() {
  return (
    <div className="app-layout">
      <Header />
      <Routes>
        <Route path="*" element={<DirectoryPage />} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
