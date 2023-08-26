import { VimMode } from 'monaco-vim';

type Keybind = {
  key: string;
  action: string;
  name: string;
};

function registerKeybind({ key, action, name }: Keybind) {
  VimMode.Vim.defineAction(name, function (ctx) {
    ctx.editor.trigger('action', action, null);
  });
  VimMode.Vim.mapCommand(key, 'action', name);
}

const KEYBINDS: Keybind[] = [
  {
    key: 'K',
    action: 'editor.action.showHover',
    name: 'hover',
  },
  {
    key: 'gd',
    action: 'editor.action.goToDeclaration',
    name: 'goToDeclaration',
  },
  {
    key: 'gr',
    action: 'editor.action.goToReferences',
    name: 'goToReferences',
  },
  {
    key: 'gi',
    action: 'editor.action.goToImplementation',
    name: 'goToImplementation',
  },
  {
    key: 'gx',
    action: 'editor.action.openLink',
    name: 'goToLink',
  },
  {
    key: ']d',
    action: 'editor.action.marker.next',
    name: 'nextDiagnostic',
  },
  {
    key: '[d',
    action: 'editor.action.marker.prev',
    name: 'prevDiagnostic',
  },
];

KEYBINDS.forEach(registerKeybind);
