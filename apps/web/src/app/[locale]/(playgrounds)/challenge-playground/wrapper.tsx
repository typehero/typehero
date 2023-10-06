'use client';
import { CodePanel } from '@repo/monaco';
import { ResetEditorButton } from '../../challenge/_components/reset-editor-button';
import { EditorShortcutsButton } from '../../challenge/_components/editor-shortcuts/editor-shortcuts-button';
import { SettingsButton } from '../../challenge/_components/settings/settings-button';
import { FullscreenButton } from '../../challenge/_components/fullscreen';

const MOCK_CHALLENGE = {
  id: 1,
  code: 'type Foo = true;',
  tests: '// some test cases',
};
export function Wrapper() {
  return (
    <CodePanel
      challenge={MOCK_CHALLENGE}
      saveSubmission={(() => {}) as any}
      submissionDisabled={false}
      settingsElement={<SettingsElements />}
    />
  );
}

function SettingsElements() {
  return (
    <>
      <ResetEditorButton />
      <EditorShortcutsButton />
      <SettingsButton />
      <FullscreenButton />
    </>
  );
}
