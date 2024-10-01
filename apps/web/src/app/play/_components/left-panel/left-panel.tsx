'use client';
import { PlaygroundEditor } from '@repo/monaco/playground-editor';
import { EditorShortcutsButton } from '~/app/challenge/_components/editor-shortcuts/editor-shortcuts-button';
import { SettingsButton } from '~/app/challenge/_components/settings/settings-button';
import { FullscreenButton } from '../../../../components/fullscreen-button';
import { TsVersionSelect } from './ts-version-select';
import { usePlaygroundState } from './usePlaygroundState';
import { useEffect } from 'react';

export function LeftPanel() {
  const { usePlaygroundStore, playgroundState } = usePlaygroundState();
  const tsVersion = usePlaygroundStore((state) => state.playgroundState.tsVersion);
  console.log({ playgroundState });
  useEffect(() => {
    console.log('left panel', playgroundState);
  }, [playgroundState]);
  return (
    <>
      <div className="sticky top-0 flex h-[40px] shrink-0 items-center justify-end gap-4 border-b border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
        <SettingsElements />
      </div>
      <PlaygroundEditor tsVersion={tsVersion} />
    </>
  );
}

function SettingsElements() {
  const { playgroundState, updatePlaygroundState } = usePlaygroundState();
  const handleVersionChange = (version: string) => {
    console.log(`update version to ${version}`);
    updatePlaygroundState({ tsVersion: version });
  };

  return (
    <>
      <TsVersionSelect version={playgroundState.tsVersion} onVersionChange={handleVersionChange} />
      <EditorShortcutsButton />
      <SettingsButton />
      <FullscreenButton />
    </>
  );
}
