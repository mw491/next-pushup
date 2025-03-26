import { View, Text, StyleSheet } from "react-native";
import useColours from "../../colours";
import { useFonts } from "expo-font";

export default function History() {
  const colours = useColours();
  const [fontsLoaded] = useFonts({
    ZenDots: require("../../assets/fonts/ZenDots.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

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
