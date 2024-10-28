import { useEffect, useState } from 'react';

export const useDebouncedValue = <T>(value: T, threshold = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), threshold);

    return () => clearTimeout(id);
  }, [value, threshold]);

  return debouncedValue;
};
