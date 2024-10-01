import lzstring from 'lz-string';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { usePlaygroundStore, type PlaygroundState } from './playground-store';

function writeQueryParam(value: string | null) {
  if (!value) {
    return '';
  }

  return lzstring.compressToEncodedURIComponent(value);
}

const writeStateToUrl = (newState: PlaygroundState): string | undefined => {
  try {
    const searchParams = new URLSearchParams();

    searchParams.set('tsVersion', newState.tsVersion.trim());
    searchParams.set('code', writeQueryParam(newState.code));
    searchParams.set('tsConfig', writeQueryParam(newState.tsConfig));

    return searchParams.toString();
  } catch (e) {
    console.warn(e);
  }
  return undefined;
};

export function usePlaygroundState() {
  const router = useRouter();
  const { playgroundState, updatePlaygroundState: _updatePlaygroundState } = usePlaygroundStore();

  const updatePlaygroundState = useCallback(
    (cfg: Partial<PlaygroundState>) => {
      const newState = { ...playgroundState, ...cfg };
      console.log({ newState });
      _updatePlaygroundState(newState);
      const hash = writeStateToUrl(newState);
      router.push(`${window.location.pathname}#${hash}`);
    },
    [playgroundState, _updatePlaygroundState, router],
  );

  return {
    // expose store so you can use selectors
    usePlaygroundStore,
    playgroundState,
    updatePlaygroundState,
  };
}
