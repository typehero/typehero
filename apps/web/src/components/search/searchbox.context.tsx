import { debounce } from 'lodash';
import * as React from 'react';
import { useSearchBox as useAlgoliaSearchBox } from 'react-instantsearch';

interface SearchBoxContext {
  query: string;
  setQuery: (query: string) => void;
}

const searchBoxContext = React.createContext({} as SearchBoxContext);

export function SearchBoxContextProvider({ children }: { children: React.ReactNode }) {
  const { query, refine } = useAlgoliaSearchBox();
  const [inputValue, setInputValue] = React.useState(query);
  const debouncedRefine = React.useRef(
    debounce((newQuery: string) => refine(newQuery), 300),
  ).current;

  const setQuery = React.useCallback(
    (newQuery: string) => {
      setInputValue(newQuery);
      debouncedRefine(newQuery);
      console.log({ newQuery });
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
