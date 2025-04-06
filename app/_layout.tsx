import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useColours from "@/colours";
import { useFonts } from "expo-font";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";

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
