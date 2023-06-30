import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { type VimMode, initVimMode } from 'monaco-vim';
import { useEditorSettingsStore } from '../settings-store';

const STATUS_BAR_ID = 'vim-status-bar';

export const VimStatusBar = () => {
  const { settings } = useEditorSettingsStore();
  if (settings.bindings === 'vim' && globalThis.editor) {
    activateVimMode(globalThis.editor);
  } else {
    deactivateVimMode();
  }
  return (
    <div className="flex">
      <div id={STATUS_BAR_ID} className="font-mono" />
    </div>
  );
};

export function loadVim(editor: monaco.editor.IStandaloneCodeEditor) {
  // eslint-disable-next-line
  const settings = localStorage.getItem('editor-settings');
  if (!settings) return;

  // eslint-disable-next-line
  const parsedSettings = JSON.parse(settings);

  // eslint-disable-next-line
  if (parsedSettings?.state?.settings?.bindings === 'vim') {
    activateVimMode(editor);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var vimMode: VimMode | undefined;
}

export function activateVimMode(editor: monaco.editor.IStandaloneCodeEditor) {
  if (globalThis.vimMode === undefined) {
    const statusBar = document.getElementById(STATUS_BAR_ID);

    if (statusBar === null) {
      return;
    }

    globalThis.vimMode = initVimMode(editor, statusBar);
  }
}

export function deactivateVimMode() {
  if (globalThis.vimMode !== undefined) {
    const statusBar = document.getElementById(STATUS_BAR_ID);

    if (statusBar === null) {
      return;
    }

    globalThis.vimMode.dispose();

    delete globalThis.vimMode;

    statusBar.textContent = '';
  }
}
