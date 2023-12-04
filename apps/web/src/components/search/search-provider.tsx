import * as React from 'react';

import type { Challenge } from '@repo/db/types';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, useHits, useInstantSearch } from 'react-instantsearch';

const searchClient = algoliasearch(
  process.env['NEXT_PUBLIC_ALGOLIA_APP_ID'],
  process.env['NEXT_PUBLIC_ALGOLIA_API_KEY'],
);

const INDEX_NAME = 'typehero';

export function SearchProvider({ children }: { children: React.ReactNode }) {
  return (
    <InstantSearch searchClient={searchClient} indexName={INDEX_NAME}>
      {children}
    </InstantSearch>
  );
}

type ChallengeHits = Record<Challenge['difficulty'], Challenge[]>;

export function useSearchStatus() {
  const { status } = useInstantSearch();
  return { status };
}

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
    }, {} as ChallengeHits);
  }, [hits]);

  return { results: groupedHits, query };
}
