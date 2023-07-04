import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_SETTINGS = {
  width: '500px',
  height: '300px',
};

type Settings = typeof DEFAULT_SETTINGS;

interface State {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export const useLayoutSettingsStore = create<State>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (settings) => set({ settings: { ...get().settings, ...settings } }),
    }),
    {
      name: 'challenge-layout-settings',
    },
  ),
);
