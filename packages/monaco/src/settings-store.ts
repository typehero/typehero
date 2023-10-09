import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_SETTINGS = {
  fontSize: '12',
  bindings: 'standard',
  tabSize: '2',
  vimConfig: `" - this is a comment
" - nmap == normal map
" - \`:M\` is an ex command to run a monaco action
nmap K  :M<Space>editor.action.showHover
nmap gd :M<Space>editor.action.goToDeclaration
nmap gr :M<Space>editor.action.goToReferences
nmap gi :M<Space>editor.action.goToImplementation
nmap gx :M<Space>editor.action.openLink
nmap ]d :M<Space>editor.action.marker.next
nmap [d :M<Space>editor.action.marker.prev
nmap gcc :M<Space>editor.action.commentLine`,
  testPanelHeight: 300,
};

type Settings = typeof DEFAULT_SETTINGS;

interface State {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export const useEditorSettingsStore = create<State>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (settings) => set({ settings: { ...get().settings, ...settings } }),
    }),
    {
      name: 'editor-settings',
    },
  ),
);
