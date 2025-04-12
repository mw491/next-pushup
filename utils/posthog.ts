import { PostHog } from 'posthog-react-native';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// PostHog API key from environment variables
const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const POSTHOG_HOST = "https://eu.i.posthog.com";

// Initialize PostHog if API key is provided
const posthog = !POSTHOG_API_KEY ? null : new PostHog(POSTHOG_API_KEY, { host: POSTHOG_HOST });

// Log analytics status in development
if (__DEV__) {
  console.log('PostHog analytics status:', POSTHOG_API_KEY ? 'enabled' : 'disabled (no API key)');
}

/**
 * Initialize PostHog analytics
 * Sets up system information and tracks initial app open
 */
export const initializeAnalytics = () => {
  if (!posthog) {
    return;
  }

  // Add system info to all events
  posthog.register({
    app_version: Application.nativeApplicationVersion,
    build_version: Application.nativeBuildVersion,
    platform: Platform.OS,
    expo_version: Constants.expoVersion,
  });

  // Track app open event
  trackAppOpen();
};

/**
 * Track app open event
 * Records when the user opens the application
 */
export const trackAppOpen = () => {
  if (!posthog) return;

  posthog.capture('App Opened', {});
};

/**
 * Track pushup log event
 * Records when the user logs a new pushup set
 *
 * @param count - The number of pushups logged
 */
export const trackPushupLog = (count: number) => {
  if (!posthog) return;

  posthog.capture('Pushup Logged', {
    count,
  });
};

/**
 * Track error or crash
 * Records application errors for debugging and monitoring
 *
 * @param error - The error object that was thrown
 * @param additionalInfo - Optional additional context about the error
 */
export const trackError = (error: Error, additionalInfo?: Record<string, any>) => {
  if (!posthog) return;

  posthog.capture('Error', {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack,
    ...additionalInfo,
  });
};
