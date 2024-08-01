import { useState } from 'react';

export function useLocalStorage(key: string, initialValue: string): [string, (v: string) => void] {
  const [storedValue, setStoredValue] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key) || initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, value);

      localStorage.setItem(key, value);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
