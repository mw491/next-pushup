import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { store$ } from '@/utils/storage';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions
export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// Schedule daily reminder notification
export async function scheduleReminderNotification(time: string) {
  // Cancel any existing notifications first
  await cancelScheduledNotifications();

  // Only schedule if reminders are enabled
  if (!store$.settings.get().sendReminder) {
    return;
  }

  // Parse time string (format: "HH:MM")
  const [hours, minutes] = time.split(':').map(Number);

  // Create trigger for specified time
  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: hours,
    minute: minutes,
  };

  // Schedule the notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time for your pushups!",
      body: "You've got this! Every pushup counts towards your goal.",
      sound: true,
    },
    trigger,
  });
}

// Cancel all scheduled notifications
export async function cancelScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Initialize notifications on app start
export async function initializeNotifications() {
  const hasPermission = await requestNotificationPermissions();

  if (hasPermission) {
    const settings = store$.settings.get();
    if (settings.sendReminder) {
      await scheduleReminderNotification(settings.reminderTime);
    }
  }
}
