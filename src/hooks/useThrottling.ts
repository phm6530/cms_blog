import { useRef } from "react";

export default function useThrottling() {
  const ref = useRef<boolean>(false);

  const throttle = async <T>(
    cb: () => Promise<T>,
    delay: number
  ): Promise<T | undefined> => {
    if (ref.current) return;

    ref.current = true;
    try {
      const data = await cb();
      return data;
    } finally {
      setTimeout(() => {
        ref.current = false;
      }, delay);
    }
  };

  return { throttle };
}
