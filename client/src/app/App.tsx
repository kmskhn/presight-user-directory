import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Sun, Moon } from 'lucide-react';
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

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function Header({ theme, onToggleTheme }: HeaderProps) {
  const { filters, setFilters } = useFilterParams();
  const [searchInput, setSearchInput] = useState(filters.search);
  const { debouncedValue: debouncedSearch, isPending } = useDebounce(searchInput, 300);
  const location = useLocation();

  // Sync debounced value to URL — in useEffect, not during render
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, setFilters]);

  // Sync search input when URL changes externally (e.g., clear all filters)
  useEffect(() => {
    if (filters.search !== searchInput && !isPending) {
      setSearchInput(filters.search);
    }
  }, [filters.search, searchInput, isPending]);

  const handleSearchChange = useCallback((val: string) => {
    setSearchInput(val);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 py-4" role="banner">
      <Link to="/" className="flex items-center gap-3 text-text-primary text-xl font-semibold no-underline" aria-label="Presight home">
        <Users size={22} color="var(--color-accent)" aria-hidden="true" />
        <span>Presight</span>
      </Link>

      <div className="flex items-center gap-4 w-full max-w-[460px]">
        {location.pathname === '/' && (
          <div className="flex-1">
            <SearchInput value={searchInput} onChange={handleSearchChange} isPending={isPending} />
          </div>
        )}
        <button
          onClick={onToggleTheme}
          className="ml-auto flex items-center justify-center w-9 h-9 rounded-full bg-surface-raised border border-border text-text-secondary hover:text-text-primary hover:scale-105 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent outline-offset-2 shrink-0"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}

function AppInner() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text-primary font-sans">
      <Header theme={theme} onToggleTheme={toggleTheme} />
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
