import { useCallback, useRef } from "react";

export default function useDebounce(
  cb: (e: any) => void,
  delay: number = 1000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(
    (e: any) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        cb(e); // callback
      }, delay);
    },
    [cb, delay]
  );

  return { debounce };
}
