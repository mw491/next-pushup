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
  onboardingCompleted: boolean;
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
  onboardingCompleted: false,
};

/**
 * Global observable store for the application
 * Contains all app data and provides methods to manipulate it
 */
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

  /**
   * Calculate the total number of pushups across all recorded days
   */
  totalPushups: (): number => {
    return store$.pushups.get().reduce(
      (total, day) => total + day.sets.reduce((dayTotal, set) => dayTotal + set.pushups, 0),
      0
    );
  },
  /**
   * Calculate the total number of pushups done today
   */
  todayPushups: (): number => {
    const today = new Date().toLocaleDateString('en-GB');
    const todayEntry = store$.pushups.get().find(day => day.date === today);
    return todayEntry?.sets.reduce((total, set) => total + set.pushups, 0) || 0;
  },

  /**
   * Add a new pushup entry or update an existing one for the same date
   * Sorts sets by time automatically
   *
   * @param newEntry - The pushup data to add
   */
  addPushup: (newEntry: PushupData) => {
    // Get current state once
    const currentPushups = store$.pushups.get();

    // Find existing entry for this date
    const existingDateIndex = currentPushups.findIndex(
      (entry) => entry.date === newEntry.date
    );

    let updatedPushups;
    if (existingDateIndex !== -1) {
      // Create new array with merged sets for existing date
      updatedPushups = currentPushups.map((entry, index) =>
        index === existingDateIndex
          ? {
            ...entry,
            sets: [...entry.sets, ...newEntry.sets].sort((a, b) =>
              a.time.localeCompare(b.time)
            ),
          }
          : entry
      );
    } else {
      // Add new entry with sorted sets
      updatedPushups = [
        ...currentPushups,
        {
          ...newEntry,
          sets: [...newEntry.sets].sort((a, b) => a.time.localeCompare(b.time))
        }
      ];
    }

    // Update state atomically
    store$.pushups.set(updatedPushups);
  },

  /**
   * Update user settings
   *
   * @param newSettings - The new settings to apply
   */
  updateSettings: (newSettings: UserSettings) => {
    store$.settings.set(newSettings);
  },

  /**
   * Reset all app data to default values
   * Clears pushup history and resets settings
   */
  clearAllData: () => {
    store$.pushups.set([]);
    store$.settings.set(DEFAULT_SETTINGS);
  }
});

/**
 * Helper function to read a specific pushup entry by date
 *
 * @param date - The date string in format DD/MM/YYYY
 */
export const readPushupEntry = (date: string): PushupData | undefined => {
  return store$.pushups.get().find((entry) => entry.date === date);
};