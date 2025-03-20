import useColours from "@/colours";
import { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";

type Props = PropsWithChildren<{}>;

export default function Card({ children }: Props) {
  const colours = useColours();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colours.alt_background,
      borderRadius: 10,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return <View style={styles.container}>{children}</View>;
}
