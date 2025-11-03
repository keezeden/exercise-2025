import { useCallback, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}
