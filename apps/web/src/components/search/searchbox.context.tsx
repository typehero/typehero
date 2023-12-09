import { debounce } from 'lodash';
import * as React from 'react';
import { useSearchProviderInput } from './search-provider';

interface SearchBoxContext {
  query: string;
  setQuery: (query: string) => void;
}

const searchBoxContext = React.createContext({} as SearchBoxContext);

export function SearchBoxContextProvider({ children }: { children: React.ReactNode }) {
  const { query, update } = useSearchProviderInput();
  const [inputValue, setInputValue] = React.useState(query);
  const debouncedRefine = React.useRef(
    debounce((newQuery: string) => update(newQuery), 700),
  ).current;

  const setQuery = React.useCallback(
    (newQuery: string) => {
      setInputValue(newQuery);
      debouncedRefine(newQuery);
    },
    [debouncedRefine],
  );

  return (
    <searchBoxContext.Provider
      value={{
        query: inputValue,
        setQuery,
      }}
    >
      {children}
    </searchBoxContext.Provider>
  );
}

export function useSearchBox() {
  const ctx = React.useContext(searchBoxContext);

  if (!ctx) {
    throw new Error('useSearch must be used within SearchContextProvider');
  }

  return ctx;
}
