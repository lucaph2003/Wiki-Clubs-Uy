import { create } from 'zustand';

interface PreferencesState {
  gridSort: 'grandeza' | 'alfabetico' | 'antiguedad' | 'division';
  setGridSort: (sort: PreferencesState['gridSort']) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  gridSort: 'grandeza',
  setGridSort: (gridSort) => set({ gridSort }),
}));
