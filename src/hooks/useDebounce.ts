import { useCallback, useRef } from "react";

export default function useDebounce(cb: () => void, delay: number = 1000) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      cb(); // callback
    }, delay);
  }, [cb, delay]);

  return { debounce };
}
