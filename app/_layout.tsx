import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useColours from "@/colours";
import { useFonts } from "expo-font";
import { Text, View } from "react-native";

export default function RootLayout() {
  const colours = useColours();
  const [fontsLoaded] = useFonts({
    ZenDots: require("@/assets/fonts/ZenDots.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colours.background,
        }}
      >
        <Text style={{ color: colours.foreground }}>Loading fonts...</Text>
      </View>
    );
  }

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
