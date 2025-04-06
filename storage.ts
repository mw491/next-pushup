import { observable } from '@legendapp/state';
import { configureSynced, synced } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';

// Setup configured persist options with MMKV
const persistWithMMKV = configureSynced(synced, {
  persist: {
    plugin: ObservablePersistMMKV
  }
});

// Types
export interface Pushup {
  pushups: number;
  time: string;
}

export interface PushupData {
  date: string;
  sets: Pushup[];
}

export interface UserSettings {
  dailyGoal: number;
  sendReminder: boolean;
  reminderTime: string;
}

export interface Store {
  pushups: PushupData[];
  settings: UserSettings;
  totalPushups: () => number;
  todayPushups: () => number;
  addPushup: (newEntry: PushupData) => void;
  updateSettings: (settings: UserSettings) => void;
  clearAllData: () => void;
}

// Default values
const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 30,
  sendReminder: true,
  reminderTime: '12:00',
};

// Create global observable store
export const store$ = observable<Store>({
  // Synced observables with persistence
  pushups: persistWithMMKV({
    initial: [],
    persist: {
      name: 'pushups'
    }
  }),
  settings: persistWithMMKV({
    initial: DEFAULT_SETTINGS,
    persist: {
      name: 'settings'
    }
  }),

  // Computed values
  totalPushups: (): number => {
    return store$.pushups.get().reduce(
      (total, day) => total + day.sets.reduce((dayTotal, set) => dayTotal + set.pushups, 0),
      0
    );
  },
  todayPushups: (): number => {
    const today = new Date().toLocaleDateString('en-GB');
    const todayEntry = store$.pushups.get().find(day => day.date === today);
    return todayEntry?.sets.reduce((total, set) => total + set.pushups, 0) || 0;
  },

  // Actions
  addPushup: (newEntry: PushupData) => {
    const pushups = store$.pushups.get();
    const existingDateIndex = pushups.findIndex(
      (entry) => entry.date === newEntry.date
    );

    if (existingDateIndex !== -1) {
      // If entry for this date exists, append the new sets
      const updatedPushups = [...pushups];
      updatedPushups[existingDateIndex] = {
        ...updatedPushups[existingDateIndex],
        sets: [...updatedPushups[existingDateIndex].sets, ...newEntry.sets],
      };
      store$.pushups.set(updatedPushups);
    } else {
      // If no entry for this date exists, add new entry
      store$.pushups.push(newEntry);
    }
  },

  updateSettings: (newSettings: UserSettings) => {
    store$.settings.set(newSettings);
  },

  clearAllData: () => {
    store$.pushups.set([]);
    store$.settings.set(DEFAULT_SETTINGS);
  }
});

// Helper functions for easier access
export const readPushupEntry = (date: string): PushupData | undefined => {
  return store$.pushups.get().find((entry) => entry.date === date);
}; 