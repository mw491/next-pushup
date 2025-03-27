import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import useColours from "@/colours";
import Card from "./Card";
import StatNumber from "./StatNumber";

export default function TodayPushups() {
  const colours = useColours();
  let count = 18;

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
      textShadowRadius: 3,
    },
    emboss: {
      fontSize: numberFontSize,
      fontFamily: "ZenDots",
      color: colours.background,
      position: "absolute",
      left: 3,
      top: 3,
      textShadowColor: colours.foreground,
      textShadowRadius: 10,
      opacity: 0.8,
    },
  });

  return (
    <Card>
      <View style={styles.container}>
        <View style={{ position: "relative" }}>
          {/* <Text style={styles.emboss}>{count}</Text>
          <Text style={styles.number}>{count}</Text> */}
          <StatNumber style={styles.emboss} targetValue={count} />
          <StatNumber style={styles.number} targetValue={count} />
        </View>
        <View>
          <Text style={styles.text}>pushups</Text>
          <Text style={styles.text}>today</Text>
        </View>
      </View>
    </Card>
  );
}
