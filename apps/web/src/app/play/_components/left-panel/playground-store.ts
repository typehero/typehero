import lzstring from 'lz-string';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supportedVersions } from './ts-supported-versions';
import { merge } from 'lodash';

export interface PlaygroundState {
  code: string;
  tsVersion: string;
  tsConfig: string;
}

export const DEFAULT_SETTINGS = {
  // we will ensure latest is first item in version list
  tsVersion: supportedVersions[0],
  tsConfig: 'standard',
  code: '',
} satisfies PlaygroundState;

export interface State {
  playgroundState: PlaygroundState;
  updatePlaygroundState: (state: PlaygroundState) => void;
}

export const usePlaygroundStore = create<State>()(
  persist(
    (set, get) => {
      // url takes precedence over local storage
      const urlState = parseStateFromUrl(window.location.hash.slice(1), DEFAULT_SETTINGS);
      const initialState = { ...DEFAULT_SETTINGS, ...urlState };

      return {
        playgroundState: initialState,
        updatePlaygroundState: (state) =>
          set({ playgroundState: { ...get().playgroundState, ...state } }),
      };
    },
    {
      name: 'playground-settings',
      // we need to override local storage with the initial state
      // which comes from the URL in usePlaygroundState
      merge: (persistedState, currentState) => {
        console.log('merge', { persistedState, currentState });
        return merge(persistedState, currentState);
      },
    },
  ),
);

function parseStateFromUrl(
  hash: string,
  initialState: PlaygroundState,
): Partial<PlaygroundState> | undefined {
  console.log('hash', hash);
  if (!hash) {
    return;
  }

  try {
    const searchParams = new URLSearchParams(hash);

    let tsconfig: string | undefined;
    if (searchParams.has('tsConfig')) {
      tsconfig = readQueryParam(searchParams.get('tsConfig'), '');
    }

    const code = searchParams.has('code') ? readQueryParam(searchParams.get('code'), '') : '';

    return {
      code,
      tsVersion: searchParams.get('tsVersion') ?? DEFAULT_SETTINGS.tsVersion,
      tsConfig: tsconfig ?? initialState.tsConfig,
    };
  } catch (e) {
    console.warn(e);
  }
  return undefined;
}

function readQueryParam(value: string | null, fallback: string): string {
  if (!value) {
    return fallback;
  }
  return lzstring.decompressFromEncodedURIComponent(value);
}
