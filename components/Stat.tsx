import { Text, View, StyleSheet } from "react-native";
import useColours from "../colours";
import Card from "./Card";
import StatNumber from "./StatNumber";

type Props = {
  label: string;
  value: number;
};

export default function Stat({ label, value }: Props) {
  const colours = useColours();

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      height: 75,
    },
    value: {
      fontSize: 40,
      fontFamily: "ZenDots",
      color: colours.alt_foreground,
    },
    text: {
      fontSize: 9,
      fontFamily: "ZenDots",
      color: colours.alt_foreground + "80",
    },
    // emboss: {
    //   fontSize: 40,
    //   fontFamily: "ZenDots",
    //   // color: colours.foreground + "00",
    //   position: "absolute",
    //   left: 3,
    //   top: 3,
    //   textShadowColor: colours.foreground,
    //   textShadowRadius: 10,
    //   opacity: 0.8,
    // },
  });

  return (
    <Card>
      <View style={styles.container}>
        <View style={{ position: "relative" }}>
          {/* <Text style={styles.emboss} adjustsFontSizeToFit numberOfLines={1}>
            {value}
          </Text> */}
          <StatNumber style={styles.value} targetValue={value} />
          {/* <Text style={styles.value} adjustsFontSizeToFit numberOfLines={1}>
            {value}
          </Text> */}
        </View>
        <Text style={styles.text}>{label}</Text>
      </View>
    </Card>
  );
}
