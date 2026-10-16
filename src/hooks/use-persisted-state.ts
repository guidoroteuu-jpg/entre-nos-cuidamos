import { useEffect, useState } from "react";

/** Restore after hydration; never overwrite stored data with the SSR fallback. */
export function usePersistedState<T>(key: string, initialState: T | (() => T)) {
  const [state, setState] = useState<T>(initialState);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) setState(JSON.parse(stored) as T);
    setRestored(true);
  }, [key]);

  useEffect(() => {
    if (restored) localStorage.setItem(key, JSON.stringify(state));
  }, [key, restored, state]);

  return [state, setState] as const;
}