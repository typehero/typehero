import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { type VimMode, initVimMode } from 'monaco-vim';

const vimEnabledKey = 'vim-mode-enabled';
const statusBarId = 'vim-status-bar';

export const VimStatusBar = () => {
  return (
    <div className="flex flex-row-reverse justify-between">
      <label className="flex gap-1">
        Vim Mode:
        <input
          type="checkbox"
          defaultChecked={localStorage.getItem(vimEnabledKey) === 'true'}
          onChange={function (ev) {
            if (ev.currentTarget.checked) {
              activateVimMode(globalThis.editor);
            } else {
              deactivateVimMode();
            }
          }}
        />
      </label>
      <div id={statusBarId} className="font-mono" />
    </div>
  );
};

export function loadVim(editor: monaco.editor.IStandaloneCodeEditor) {
  const status = localStorage.getItem(vimEnabledKey) ?? 'false';

  if (status === 'true') {
    activateVimMode(editor);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var vimMode: VimMode | undefined;
}

export function activateVimMode(editor: monaco.editor.IStandaloneCodeEditor) {
  if (globalThis.vimMode === undefined) {
    const statusBar = document.getElementById(statusBarId);

    if (statusBar === null) {
      return;
    }

    globalThis.vimMode = initVimMode(editor, statusBar);

    localStorage.setItem(vimEnabledKey, 'true');
  }
}

export function deactivateVimMode() {
  if (globalThis.vimMode !== undefined) {
    const statusBar = document.getElementById(statusBarId);

    if (statusBar === null) {
      return;
    }

    globalThis.vimMode.dispose();

    delete globalThis.vimMode;

    localStorage.setItem(vimEnabledKey, 'false');

    statusBar.textContent = '';
  }
}
