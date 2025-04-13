import { usePostHog } from 'posthog-react-native';

// PostHog host URL - exported for use in the provider
export const POSTHOG_HOST = "https://eu.i.posthog.com";

// Export PostHog API key for use in the provider
export const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;

// Log analytics status in development
if (__DEV__) {
  console.log('PostHog analytics status:', POSTHOG_API_KEY ? 'enabled' : 'disabled (no API key)');
}

/**
 * Track pushup log event
 * Records when the user logs a new pushup set
 *
 * @param count - The number of pushups logged
 */
export const trackPushupLog = (count: number) => {
  const posthog = usePostHog();
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
  const posthog = usePostHog();
  if (!posthog) return;

  posthog.capture('Error', {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack,
    ...additionalInfo,
  });
};
