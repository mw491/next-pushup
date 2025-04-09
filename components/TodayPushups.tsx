import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import useColours from "@/utils/colours";
import Card from "./Card";
import StatNumber from "./StatNumber";

export default function TodayPushups({ count }: { count: number }) {
  const colours = useColours();
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
    },
    numberContainer: {
      position: "relative",
      width: width * 0.4, // 40% of screen width
    },
    numbersWrapper: {
      position: "relative",
      width: "100%",
    },
    embossContainer: {
      position: "absolute",
      width: "100%",
      left: 3,
      top: 3,
      zIndex: 1,
    },
    mainNumberContainer: {
      position: "relative",
      width: "100%",
      zIndex: 2,
    },
    text: {
      fontSize: Math.min(24, width / 16),
      fontFamily: "ZenDots",
      color: colours.foreground,
    },
    number: {
      fontSize: 100,
      fontFamily: "ZenDots",
      color: colours.foreground,
      textShadowColor: colours.foreground,
      textShadowRadius: 3,
    },
    emboss: {
      fontSize: 100,
      fontFamily: "ZenDots",
      color: colours.background,
      textShadowColor: colours.foreground,
      textShadowRadius: 10,
      opacity: 0.8,
    },
  });

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.numberContainer}>
          <View style={styles.numbersWrapper}>
            <View style={styles.embossContainer}>
              <StatNumber
                style={styles.emboss}
                targetValue={count}
                variant="large"
              />
            </View>
            <View style={styles.mainNumberContainer}>
              <StatNumber
                style={styles.number}
                targetValue={count}
                variant="large"
              />
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.text}>pushups</Text>
          <Text style={styles.text}>today</Text>
        </View>
      </View>
    </Card>
  );
}
