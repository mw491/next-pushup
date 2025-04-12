import { PostHog } from 'posthog-react-native';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if we're in development mode
const IS_DEV = process.env.APP_VARIANT === 'development' ||
  process.env.NODE_ENV !== 'production' ||
  __DEV__;

// PostHog API key from environment variables
const POSTHOG_API_KEY = Constants.expoConfig?.extra?.posthogApiKey;
const POSTHOG_HOST = "https://eu.i.posthog.com";

// Only initialize PostHog in production and if API key is provided
const posthog = (IS_DEV || !POSTHOG_API_KEY) ? null : new PostHog(POSTHOG_API_KEY, { host: POSTHOG_HOST });

// Log analytics status in development
if (__DEV__) {
  if (!POSTHOG_API_KEY) {
    console.log('PostHog analytics disabled: No API key provided');
  } else if (IS_DEV) {
    console.log('PostHog analytics disabled in development mode');
  }
}

/**
 * Initialize PostHog analytics
 */
export const initializeAnalytics = () => {
  // Skip analytics in development
  if (IS_DEV || !posthog) {
    console.log('Analytics disabled in development mode');
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
 */
export const trackAppOpen = () => {
  if (IS_DEV || !posthog) return;

  posthog.capture('App Opened', {});
};

/**
 * Track pushup log event
 */
export const trackPushupLog = (count: number) => {
  if (IS_DEV || !posthog) return;

  posthog.capture('Pushup Logged', {
    count,
  });
};

/**
 * Track error or crash
 */
export const trackError = (error: Error, additionalInfo?: Record<string, any>) => {
  if (IS_DEV || !posthog) return;

  posthog.capture('Error', {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack,
    ...additionalInfo,
  });
};
