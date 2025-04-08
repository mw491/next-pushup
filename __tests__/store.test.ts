import { store$ } from '../storage';
import { observable } from '@legendapp/state';

describe('Store Operations', () => {
  beforeEach(() => {
    // Reset store before each test
    store$.pushups.set([]);
    store$.settings.set({
      dailyGoal: 30,
      sendReminder: true,
      reminderTime: '12:00',
    });
  });

  describe('addPushup', () => {
    it('should add a new pushup entry for a new date', () => {
      const newEntry = {
        date: '01/05/2023',
        sets: [{ pushups: 10, time: '10:00' }],
      };

      store$.addPushup(newEntry);

      expect(store$.pushups.get()).toEqual([newEntry]);
    });

    it('should append sets to an existing date', () => {
      const existingEntry = {
        date: '01/05/2023',
        sets: [{ pushups: 10, time: '10:00' }],
      };

      store$.pushups.set([existingEntry]);

      const newSet = {
        date: '01/05/2023',
        sets: [{ pushups: 15, time: '14:00' }],
      };

      store$.addPushup(newSet);

      expect(store$.pushups.get()).toEqual([
        {
          date: '01/05/2023',
          sets: [
            { pushups: 10, time: '10:00' },
            { pushups: 15, time: '14:00' },
          ],
        },
      ]);
    });
  });

  describe('totalPushups', () => {
    it('should calculate total pushups correctly', () => {
      store$.pushups.set([
        {
          date: '01/05/2023',
          sets: [
            { pushups: 10, time: '10:00' },
            { pushups: 15, time: '14:00' },
          ],
        },
        {
          date: '02/05/2023',
          sets: [
            { pushups: 12, time: '09:00' },
            { pushups: 18, time: '15:00' },
          ],
        },
      ]);

      expect(store$.totalPushups()).toBe(55);
    });

    it('should return 0 when no pushups are recorded', () => {
      expect(store$.totalPushups()).toBe(0);
    });
  });

  describe('todayPushups', () => {
    it('should calculate today\'s pushups correctly', () => {
      const today = new Date().toLocaleDateString('en-GB');

      store$.pushups.set([
        {
          date: today,
          sets: [
            { pushups: 10, time: '10:00' },
            { pushups: 15, time: '14:00' },
          ],
        },
        {
          date: '01/05/2023',
          sets: [{ pushups: 12, time: '09:00' }],
        },
      ]);

      expect(store$.todayPushups()).toBe(25);
    });

    it('should return 0 when no pushups are recorded today', () => {
      store$.pushups.set([
        {
          date: '01/05/2023',
          sets: [{ pushups: 10, time: '10:00' }],
        },
      ]);

      expect(store$.todayPushups()).toBe(0);
    });
  });

  describe('updateSettings', () => {
    it('should update settings correctly', () => {
      const newSettings = {
        dailyGoal: 50,
        sendReminder: false,
        reminderTime: '08:00',
      };

      store$.updateSettings(newSettings);

      expect(store$.settings.get()).toEqual(newSettings);
    });
  });

  describe('clearAllData', () => {
    it('should clear all data and reset to default values', () => {
      // Add some data
      store$.pushups.set([
        {
          date: '01/05/2023',
          sets: [{ pushups: 10, time: '10:00' }],
        },
      ]);

      store$.settings.set({
        dailyGoal: 50,
        sendReminder: false,
        reminderTime: '08:00',
      });

      store$.clearAllData();

      expect(store$.pushups.get()).toEqual([]);
      expect(store$.settings.get()).toEqual({
        dailyGoal: 30,
        sendReminder: true,
        reminderTime: '12:00',
      });
    });
  });
}); 