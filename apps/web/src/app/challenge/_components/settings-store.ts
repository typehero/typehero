import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_SETTINGS = {
  fontSize: '12',
  bindings: 'standard',
  tabSize: '2',
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
