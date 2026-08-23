'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

/**
 * A hook for syncing state with URL search parameters.
 * Returns the state and a setter that also updates the URL.
 */
export function useUrlFilter<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL or default
  const [value, setValue] = useState<T>(() => {
    const param = searchParams.get(key);
    return (param as T) || defaultValue;
  });

  // Sync state if URL changes externally
  useEffect(() => {
    const param = searchParams.get(key);
    setValue((param as T) || defaultValue);
  }, [searchParams, key, defaultValue]);

  const setFilter = useCallback(
    (newValue: T) => {
      setValue(newValue);
      
      const params = new URLSearchParams(searchParams.toString());
      if (newValue === defaultValue || newValue === '') {
        params.delete(key);
      } else {
        params.set(key, newValue);
      }
      
      // Use replace so we don't build a massive history stack while filtering
      router.replace(`\${pathname}?\${params.toString()}`, { scroll: false });
    },
    [key, defaultValue, pathname, router, searchParams]
  );

  return [value, setFilter];
}
