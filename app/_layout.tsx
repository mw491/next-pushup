import { Slot, useRouter, useSegments } from "expo-router";
import { Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useColours from "@/utils/colours";
import { useFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { initializeNotifications } from "@/utils/notifications";
import { initializeAnalytics, trackError } from "@/utils/posthog";
import { store$ } from "@/utils/storage";
import { use$ } from "@legendapp/state/react";

// Enable legend-state React hooks
enableReactUse();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set up global error handler for React Native
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

export default function RootLayout() {
  const colours = useColours();
  const router = useRouter();
  const segments = useSegments();
  const settings = use$(store$.settings);
  const [fontsLoaded] = useFonts({
    ZenDots: require("@/assets/fonts/ZenDots.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      // Initialize notifications and analytics when the app is loaded
      initializeNotifications();
      initializeAnalytics();
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
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colours.background,
        }}
        onLayout={onLayoutRootView}
      >
        <Slot />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
