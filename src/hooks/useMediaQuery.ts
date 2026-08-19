import { useSyncExternalStore } from 'react';

function getServerSnapshot(): boolean {
  return false;
}

export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void): (() => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  };
  const getSnapshot = (): boolean => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
