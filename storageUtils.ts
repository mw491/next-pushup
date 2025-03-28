import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pushupData'; // Centralize the key

export interface Pushup {
  pushups: number;
  time: string;
}

export interface PushupData {
  date: string;
  sets: Pushup[];
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface UserSettings {
  theme: Theme;
  dailyGoal: number;
  sendReminder: boolean;
  reminderTime: string;
}

export interface AppData {
  pushupData: PushupData[];
  userSettings: UserSettings;
}

// Helper function to get the default data
const getDefaultData = (): AppData => ({
  pushupData: [],
  userSettings: {
    theme: Theme.SYSTEM,
    dailyGoal: 30,
    sendReminder: true,
    reminderTime: '12:00',
  },
});

// Helper function to merge existing data with defaults
export const ensureDefaultValues = async (): Promise<void> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      const existingData = JSON.parse(jsonValue);
      const defaultData = getDefaultData();

      // Deep merge existing data with default values
      const mergedData: AppData = {
        pushupData: existingData.pushupData || defaultData.pushupData,
        userSettings: {
          ...defaultData.userSettings,
          ...existingData.userSettings,
        },
      };

      // Save the merged data back to storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
    }
  } catch (error) {
    console.error('Error ensuring default values:', error);
    throw error;
  }
};

// --- CREATE ---
export const addPushup = async (newEntry: PushupData): Promise<void> => {
  try {
    const existingData = await readAllData();
    const updatedData: AppData = {
      ...existingData,
      pushupData: [...existingData.pushupData, newEntry],
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error creating pushup entry:', error);
    throw error; // Re-throw to signal failure to the caller
  }
};

// --- READ ---
export const readAllData = async (): Promise<AppData> => {
  try {
    await ensureDefaultValues(); // Ensure defaults before reading
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue) as AppData;
    } else {
      return getDefaultData(); // Return default if no data exists
    }
  } catch (error) {
    console.error('Error reading all data:', error);
    return getDefaultData(); // Return default on error, preventing app crash
  }
};

export const readPushupEntry = async (date: string): Promise<PushupData | undefined> => {
  try {
    const allData = await readAllData();
    return allData.pushupData.find((entry) => entry.date === date);
  } catch (error) {
    console.error('Error reading pushup entry:', error);
    return undefined; // Return undefined on error
  }
};

// --- UPDATE ---
export const updateSettings = async (newSettings: UserSettings): Promise<void> => {
  try {
    await ensureDefaultValues(); // Ensure defaults before updating
    const allData = await readAllData();
    const updatedData: AppData = { ...allData, userSettings: newSettings };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};


// --- DELETE ---
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
