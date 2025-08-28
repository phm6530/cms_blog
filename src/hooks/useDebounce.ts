import { useCallback, useEffect, useRef } from "react";

export default function useDebounce<T extends (...args: any[]) => void>(
  cb: T,
  delay: number = 1000
) {
  const cbRef = useRef(cb);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // cb 변경 시 최신 값 보관
  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  const debounce = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        cbRef.current(...args);
      }, delay);
    },
    [delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      cbRef.current();
      timeoutRef.current = null;
    }
  }, []);

  return { debounce, cancel, flush };
}
