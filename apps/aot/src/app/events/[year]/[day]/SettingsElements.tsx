'use client';
import { ResetEditorButton } from './_components/reset-editor-button';
import { EditorShortcutsButton } from './_components/editor-shortcuts/editor-shortcuts-button';
import { SettingsButton } from './_components/settings/settings-button';
import { FullscreenButton } from './fullscreen-button';

export function SettingsElements() {
  return (
    <>
      <ResetEditorButton />
      <EditorShortcutsButton />
      <SettingsButton />
      <FullscreenButton />
    </>
  );
}
