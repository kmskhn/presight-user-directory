import { useEffect, useRef, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300): { debouncedValue: T; isPending: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setIsPending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value === debouncedValue) {
      setIsPending(false);
      return;
    }

    setIsPending(true);

    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsPending(false);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay, debouncedValue]);

  return { debouncedValue, isPending };
}
