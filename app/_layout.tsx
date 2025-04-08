import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useColours from "@/colours";
import { useFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { initializeNotifications } from "@/utils/notifications";

// Enable legend-state React hooks
enableReactUse();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colours = useColours();
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
      // Initialize notifications when the app is loaded
      initializeNotifications();
    }
  }, [fontsLoaded]);

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
