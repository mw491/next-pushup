import { Text, View, StyleSheet } from "react-native";
import useColours from "../../colours";
import { useFonts } from "expo-font";
import TodayPushups from "../../components/TodayPushups";
import Stat from "../../components/Stat";

export default function Index() {
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
      rowGap: 20,
      backgroundColor: colours.background,
      padding: 30,
      paddingTop: 40,
    },
    title: {
      fontSize: 24,
      fontFamily: "ZenDots",
      color: colours.foreground,
      marginBottom: 10,
      marginTop: 20,
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
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Stat label="personal best" value={24} />
        </View>
        <View style={{ flex: 1 }}>
          <Stat label="rep average" value={12} />
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "stretch" }}>
        <View style={{ flex: 1 }}>
          <Stat label="this week" value={50} />
        </View>
        <View style={{ flex: 1 }}>
          <Stat label="this month" value={138} />
        </View>
        <View style={{ flex: 1 }}>
          <Stat label="this year" value={5827} />
        </View>
      </View>
    </View>
  );
}
