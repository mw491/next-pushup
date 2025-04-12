import useColours from "@/utils/colours";
import { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";

/**
 * Props for the Card component
 */
type Props = PropsWithChildren<{}>;

/**
 * Card component that provides a consistent container style
 * Used throughout the app for grouping related UI elements
 *
 * @param props - Component props
 * @param props.children - Child elements to render inside the card
 */
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
