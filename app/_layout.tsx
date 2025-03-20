import { Stack } from "expo-router";
import useColours from "./colours";

export default function RootLayout() {
  const colours = useColours();
  return (
    <Stack screenOptions={{ statusBarBackgroundColor: colours.background }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ headerShown: false }} />
    </Stack>
  );
}
