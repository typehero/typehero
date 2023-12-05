import * as React from 'react';

import type { Challenge } from '@repo/db/types';
import algoliasearch from 'algoliasearch/lite';
import { useHits, useInstantSearch, useSearchBox } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

const searchClient = algoliasearch(
  // eslint-disable-next-line @typescript-eslint/dot-notation
  process.env['NEXT_PUBLIC_ALGOLIA_APP_ID'],
  // eslint-disable-next-line @typescript-eslint/dot-notation
  process.env['NEXT_PUBLIC_ALGOLIA_API_KEY'],
);

const INDEX_NAME = 'typehero';

export function SearchProvider({ children }: { children: React.ReactNode }) {
  return (
    <InstantSearchNext searchClient={searchClient} indexName={INDEX_NAME} routing>
      {children}
    </InstantSearchNext>
  );
}

type ChallengeHits = Record<Challenge['difficulty'], Challenge[]>;

export function useSearchStatus() {
  const { status } = useInstantSearch();
  return { status };
}

const initialState = {} as ChallengeHits;

export function useSearchResult() {
  const { hits, results } = useHits<Challenge>();
  const query = results?.query;

  const groupedHits = React.useMemo(() => {
    return hits.reduce((acc, item) => {
      if (!acc[item.difficulty]) {
        acc[item.difficulty] = [];
      }

      acc[item.difficulty].push(item);

      return acc;
    }, initialState);
  }, [hits]);

  return { results: groupedHits, query };
}

export function useSearchProviderInput() {
  const { query, refine } = useSearchBox();

  const update = (newQuery: string) => {
    refine(newQuery);
  };

  return { query, update };
}
