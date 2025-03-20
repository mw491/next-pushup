import { Text, View, StyleSheet } from "react-native";
import useColours from "./colours";
import { Link } from "expo-router";

export default function Index() {
  const colours = useColours();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colours.background,
    },
    text: {
      color: colours.foreground,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/history">
        <Text style={styles.text}>View your history</Text>
      </Link>
    </View>
  );
}
