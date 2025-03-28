import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useColours from "@/colours";
import { useFonts } from "expo-font";
import { Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { readAllData, AppData } from "@/storageUtils";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

interface AppDataContextType {
  data: AppData;
  refreshData: () => Promise<void>;
}

// Create the context
export const AppDataContext = createContext<AppDataContextType | null>(null);

// Create a hook to use the context
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === null) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
};

export default function RootLayout() {
  const colours = useColours();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [fontsLoaded] = useFonts({
    ZenDots: require("@/assets/fonts/ZenDots.ttf"),
  });

  const refreshData = useCallback(async () => {
    try {
      const data = await readAllData();
      setAppData(data);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        await refreshData();
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [refreshData]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && appData) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, appData]);

  if (!fontsLoaded || !appData) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppDataContext.Provider value={{ data: appData, refreshData }}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colours.background,
          }}
          onLayout={onLayoutRootView}
        >
          <Slot />
        </SafeAreaView>
      </AppDataContext.Provider>
    </SafeAreaProvider>
  );
}
