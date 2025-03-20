import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import useColours from "../colours";
import { useFonts } from "expo-font";
import Card from "./Card";

export default function TodayPushups() {
  const colours = useColours();
  const [fontsLoaded] = useFonts({
    ZenDots: require("../assets/fonts/ZenDots.ttf"),
  });
  let count = 19;

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  // Calculate responsive font size based on screen width
  // and number of digits in the pushup count
  const { width } = useWindowDimensions();
  const digitCount = count.toString().length;
  const baseFontSize = Math.min(80, width / 4);
  const numberFontSize =
    digitCount > 2 ? baseFontSize * (3 / digitCount) : baseFontSize;

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
    },
    text: {
      fontSize: Math.min(24, width / 16),
      fontFamily: "ZenDots",
      color: colours.foreground,
    },
    number: {
      fontSize: numberFontSize,
      fontFamily: "ZenDots",
      color: colours.foreground,
      textShadowColor: colours.foreground,
      textShadowRadius: 15,
      opacity: 0.8,
    },
  });

  return (
    <Card>
      <View style={styles.container}>
        <View style={{ position: "relative" }}>
          <Text style={[styles.number, { position: "absolute" }]}>{count}</Text>
          <Text style={styles.number}>{count}</Text>
        </View>
        <View style={{}}>
          <Text style={styles.text}>pushups</Text>
          <Text style={styles.text}>today</Text>
        </View>
      </View>
    </Card>
  );
}
