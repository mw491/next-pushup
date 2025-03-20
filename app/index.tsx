import { Text, View, StyleSheet } from "react-native";
import useColours from "../colours";
import { useFonts } from "expo-font";
import TodayPushups from "../components/TodayPushups";

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
      rowGap: 20,
      backgroundColor: colours.background,
    },
    title: {
      fontSize: 24,
      fontFamily: "ZenDots",
      color: colours.foreground,
      marginBottom: 10,
    },
    text: {
      color: colours.foreground,
      fontFamily: "ZenDots",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEXT PUSHUP</Text>
      <TodayPushups />
    </View>
  );
}
