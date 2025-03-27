import { View, Text, StyleSheet } from "react-native";
import useColours from "@/colours";

export default function History() {
  const colours = useColours();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colours.background,
      padding: 30,
    },
    text: {
      fontSize: 24,
      color: colours.foreground,
      fontFamily: "ZenDots",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your history</Text>
    </View>
  );
}
