import { useState } from 'react';

const useLocalStorage = (key: string, initialValue: string): [string, (v: string) => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return window.localStorage.getItem(key) || initialValue;
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
};

export default useLocalStorage;
