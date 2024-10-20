'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export const useQueryParamState = <T extends number | string>(key: string, defaultValue: T) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const getValue = (): T => {
    const value = searchParams.get(key);
    if (!value) {
      return defaultValue;
    }
    return (typeof defaultValue === 'number' ? Number(value) : value) as T;
  };
  const value = getValue();

  const setQueryParam = (value: T) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return [value, setQueryParam] as const;
};
