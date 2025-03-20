import { Text, View, StyleSheet } from "react-native";
import useColours from "./colours";
import { Link } from "expo-router";
import { useFonts } from "expo-font";

export default function Index() {
  const colours = useColours();
  const [fontsLoaded] = useFonts({
    ZenDots: require("../assets/fonts/ZenDots.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colours.background,
    },
    title: {
      fontSize: 24,
      fontFamily: "ZenDots",
      color: colours.foreground,
    },
    text: {
      color: colours.foreground,
      fontFamily: "ZenDots",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEXT PUSHUP</Text>
      <Link href="/history">
        <Text style={styles.text}>View your history</Text>
      </Link>
    </View>
  );
}
