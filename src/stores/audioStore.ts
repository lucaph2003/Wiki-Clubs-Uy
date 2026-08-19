import { create } from 'zustand';

const STORAGE_KEY = 'garra:prefs:audio';

interface StoredAudioPrefs {
  enabled: boolean;
  volume: number;
}

function readStoredPrefs(): StoredAudioPrefs {
  if (typeof window === 'undefined') return { enabled: false, volume: 0.4 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { enabled: false, volume: 0.4 };
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'enabled' in parsed &&
      'volume' in parsed &&
      typeof (parsed as StoredAudioPrefs).enabled === 'boolean' &&
      typeof (parsed as StoredAudioPrefs).volume === 'number'
    ) {
      return parsed as StoredAudioPrefs;
    }
  } catch {
    // localStorage corrupto o inaccesible: usamos default.
  }
  return { enabled: false, volume: 0.4 };
}

function persist(prefs: StoredAudioPrefs): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

interface AudioState {
  enabled: boolean;
  volume: number;
  /** Src del audio activo, o null si no suena nada. */
  nowPlaying: string | null;
  /** Título legible del audio activo, para la etiqueta accesible del toggle (§10.2). */
  nowPlayingTitle: string | null;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setNowPlaying: (src: string | null, title?: string | null) => void;
}

const initial = readStoredPrefs();

export const useAudioStore = create<AudioState>((set) => ({
  enabled: initial.enabled,
  volume: initial.volume,
  nowPlaying: null,
  nowPlayingTitle: null,
  setEnabled: (enabled) =>
    set((state) => {
      persist({ enabled, volume: state.volume });
      return { enabled };
    }),
  setVolume: (volume) =>
    set((state) => {
      persist({ enabled: state.enabled, volume });
      return { volume };
    }),
  setNowPlaying: (nowPlaying, title = null) => set({ nowPlaying, nowPlayingTitle: nowPlaying ? title : null }),
}));
