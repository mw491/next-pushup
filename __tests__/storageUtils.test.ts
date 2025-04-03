import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  readAllData,
  addPushup,
  readPushupEntry,
  updateSettings,
  clearAllData,
  ensureDefaultValues,
  type Pushup,
  type PushupData,
  type UserSettings,
} from '../storageUtils';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Storage Utils', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('readAllData', () => {
    it('should return default data when no data is found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await readAllData();

      expect(result).toEqual({
        pushupData: [],
        userSettings: {
          dailyGoal: 30,
          sendReminder: true,
          reminderTime: '12:00',
        },
      });
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });

    it('should return parsed data when data exists', async () => {
      const mockData = {
        pushupData: [{ date: '2023-05-01', sets: [{ pushups: 10, time: '10:00' }] }],
        userSettings: {
          dailyGoal: 50,
          sendReminder: false,
          reminderTime: '08:00',
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      const result = await readAllData();

      expect(result).toEqual(mockData);
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  describe('addPushup', () => {
    it('should add pushup entry for a new date', async () => {
      const existingData = {
        pushupData: [],
        userSettings: {
          dailyGoal: 30,
          sendReminder: true,
          reminderTime: '12:00',
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingData));

      const newEntry: PushupData = {
        date: '2023-05-01',
        sets: [{ pushups: 15, time: '14:00' }],
      };

      await addPushup(newEntry);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'pushupData',
        JSON.stringify({
          ...existingData,
          pushupData: [newEntry],
        })
      );
    });

    it('should append pushup sets to an existing date', async () => {
      const existingDate = '2023-05-01';
      const existingData = {
        pushupData: [
          {
            date: existingDate,
            sets: [{ pushups: 10, time: '10:00' }],
          },
        ],
        userSettings: {
          dailyGoal: 30,
          sendReminder: true,
          reminderTime: '12:00',
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingData));

      const newEntry: PushupData = {
        date: existingDate,
        sets: [{ pushups: 15, time: '14:00' }],
      };

      await addPushup(newEntry);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'pushupData',
        JSON.stringify({
          ...existingData,
          pushupData: [
            {
              date: existingDate,
              sets: [
                { pushups: 10, time: '10:00' },
                { pushups: 15, time: '14:00' },
              ],
            },
          ],
        })
      );
    });
  });

  describe('readPushupEntry', () => {
    it('should return undefined when entry does not exist', async () => {
      const existingData = {
        pushupData: [
          {
            date: '2023-05-01',
            sets: [{ pushups: 10, time: '10:00' }],
          },
        ],
        userSettings: {
          dailyGoal: 30,
          sendReminder: true,
          reminderTime: '12:00',
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingData));

      const result = await readPushupEntry('2023-05-02');

      expect(result).toBeUndefined();
    });

    it('should return entry when it exists', async () => {
      const existingDate = '2023-05-01';
      const existingEntry = {
        date: existingDate,
        sets: [{ pushups: 10, time: '10:00' }],
      };

      const existingData = {
        pushupData: [existingEntry],
        userSettings: {
          dailyGoal: 30,
          sendReminder: true,
          reminderTime: '12:00',
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingData));

      const result = await readPushupEntry(existingDate);

      expect(result).toEqual(existingEntry);
    });
  });

  describe('updateSettings', () => {
    it('should update user settings', async () => {
      const existingData = {
        pushupData: [],
        userSettings: {
          dailyGoal: 30,
          sendReminder: true,
          reminderTime: '12:00',
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingData));

      const newSettings: UserSettings = {
        dailyGoal: 50,
        sendReminder: false,
        reminderTime: '08:00',
      };

      await updateSettings(newSettings);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'pushupData',
        JSON.stringify({
          ...existingData,
          userSettings: newSettings,
        })
      );
    });
  });

  describe('clearAllData', () => {
    it('should clear all data', async () => {
      await clearAllData();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('pushupData');
    });
  });

  describe('ensureDefaultValues', () => {
    it('should merge default values with existing data', async () => {
      const existingData = {
        pushupData: [{ date: '2023-05-01', sets: [{ pushups: 10, time: '10:00' }] }],
        userSettings: {
          // Missing some fields
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingData));

      await ensureDefaultValues();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'pushupData',
        expect.stringContaining('"dailyGoal":30')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'pushupData',
        expect.stringContaining('"sendReminder":true')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'pushupData',
        expect.stringContaining('"reminderTime":"12:00"')
      );

    });
  });
});