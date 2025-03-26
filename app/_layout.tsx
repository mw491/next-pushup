import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useColours from "../colours";

export default function RootLayout() {
  const colours = useColours();
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colours.background,
        }}
      >
        <Slot />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
