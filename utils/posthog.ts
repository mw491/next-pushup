import { PostHog } from 'posthog-react-native';

// PostHog host URL - exported for use in the provider
export const POSTHOG_HOST = "https://eu.i.posthog.com";

// Export PostHog API key for use in the provider
export const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;

let posthogInstance: PostHog | null = null;

export const initPostHog = (instance: PostHog) => {
  if (!instance) {
    return;
  }

  posthogInstance = instance;
};

/**
 * Track pushup log event
 * Records when the user logs a new pushup set
 *
 * @param count - The number of pushups logged
 */
export const trackPushupLog = (count: number) => {
  if (!posthogInstance) return;

  posthogInstance.capture('Pushup Logged', {
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
  if (!posthogInstance) return;

  posthogInstance.captureException(error, additionalInfo);
};
