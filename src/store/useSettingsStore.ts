import { create } from 'zustand';

interface SettingsState {
  whatsapp_number: string;
  site_name: string;
  support_email: string;
  upi_id: string;
  upi_name: string;
  loaded: boolean;
  load: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  whatsapp_number: '',
  site_name: 'AI Nest',
  support_email: '',
  upi_id: '',
  upi_name: 'AI Nest',
  loaded: false,
  load: async () => {
    if (get().loaded) return;
    try {
      const res = await fetch('/api/settings');
      const { settings } = await res.json();
      set({ ...settings, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },
}));