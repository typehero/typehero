import * as React from 'react';

import type { Challenge } from '@repo/db/types';
import type { SearchClient } from 'algoliasearch';
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
    <InstantSearchNext
      searchClient={{
        ...searchClient,
        search<TObject>(requests: Parameters<SearchClient['search']>[0]) {
          const isEmptyQuery = requests.every(({ params }) => !params?.query);
          if (isEmptyQuery) {
            return Promise.resolve({
              results: requests.map(() => ({
                hits: [],
                nbHits: 0,
                nbPages: 0,
                page: 0,
                processingTimeMS: 0,
                hitsPerPage: 0,
                exhaustiveNbHits: false,
                query: '',
                params: '',
              })),
            });
          }

          return searchClient.search<TObject>(requests);
        },
      }}
      indexName={INDEX_NAME}
    >
      {children}
    </InstantSearchNext>
  );
}

export function useSearchStatus() {
  const { status } = useInstantSearch();
  return { status };
}

export function useSearchResult() {
  const { items, results } = useHits<Challenge>();
  const query = results?.query;

  return { results: items, query };
}
export type Result = ReturnType<typeof useSearchResult>['results'][number];

export function useSearchProviderInput() {
  const { query, refine } = useSearchBox();

  const update = (newQuery: string) => {
    refine(newQuery);
  };

  return { query, update };
}
