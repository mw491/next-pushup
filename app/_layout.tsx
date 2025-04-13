import { Slot, useRouter, useSegments } from "expo-router";
import { Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useColours from "@/utils/colours";
import { useFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { initializeNotifications } from "@/utils/notifications";
import { trackError, POSTHOG_API_KEY, POSTHOG_HOST, initPostHog } from "@/utils/posthog";
import { store$ } from "@/utils/storage";
import { use$ } from "@legendapp/state/react";
import { PostHogProvider, usePostHog } from "posthog-react-native";

// Enable legend-state React hooks
enableReactUse();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

/**
 * Global error handler for React Native
 * Displays an error alert to the user and tracks the error in analytics
 *
 * @param error - The error that was thrown
 * @param isFatal - Whether the error is fatal
 */
const errorHandler = (error: Error, isFatal?: boolean) => {
  // Show user an error message
  Alert.alert(
    'Error',
    error.message,
  );
  // Track the error with PostHog
  trackError(error, { isFatal });
};

// Add error event listener
if (typeof ErrorUtils !== 'undefined') {
  ErrorUtils.setGlobalHandler(errorHandler);
}

function AppContent() {
  const colours = useColours();
  const router = useRouter();
  const segments = useSegments();
  const settings = use$(store$.settings);
  const posthog = usePostHog();
  const [fontsLoaded] = useFonts({
    ZenDots: require("@/assets/fonts/ZenDots.ttf"),
  });

  // Initialize PostHog as soon as possible
  useEffect(() => {
    if (posthog) {
      initPostHog(posthog);
    }
  }, [posthog]);

  /**
   * Callback function to hide the splash screen once fonts are loaded
   * Called when the root view is laid out
   */
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Handle other initializations
  useEffect(() => {
    if (fontsLoaded) {
      // Initialize notifications when the app is loaded
      initializeNotifications();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded) return;

    const isOnboarding = segments[0] === "onboarding";

    if (!settings.onboardingCompleted && !isOnboarding) {
      router.replace("/onboarding");
    } else if (settings.onboardingCompleted && isOnboarding) {
      router.replace("/");
    }
  }, [fontsLoaded, segments, settings.onboardingCompleted]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colours.background,
      }}
      onLayout={onLayoutRootView}
    >
      <Slot />
    </SafeAreaView>
  );
}

/**
 * Root layout component for the application
 * Handles initialization, theme setup, and navigation routing
 */
export default function RootLayout() {
  if (!POSTHOG_API_KEY) {
    console.warn('PostHog API key is not set');
  }

  return (
    <PostHogProvider
      apiKey={POSTHOG_API_KEY}
      options={{
        host: POSTHOG_HOST,
      }}
    >
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </PostHogProvider>
  );
}
