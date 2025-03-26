import { Pressable, Text, View, StyleSheet } from "react-native";
import useColours from "../../colours";
import { useState } from "react";

export default function AddPushup() {
  const [count, setCount] = useState(1);
  const colours = useColours();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      rowGap: 20,
      backgroundColor: colours.background,
      padding: 30,
      paddingTop: 40,
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 30,
    },
    title: {
      fontSize: 24,
      fontFamily: "ZenDots",
      color: colours.foreground,
      marginBottom: 10,
      marginTop: 20,
    },
    button: {
      width: 75,
      height: 75,
      borderRadius: 100,
      backgroundColor: colours.alt_background,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    buttonContainer: {
      borderRadius: 100,
      overflow: "hidden",
      backgroundColor: colours.alt_background,
    },
    buttonSave: {
      backgroundColor: colours.foreground,
      alignItems: "center",
      justifyContent: "center",
      padding: 15,
      borderRadius: 10,
    },
    buttonSaveContainer: {
      width: "90%",
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: colours.alt_background,
    },
    text: {
      color: colours.foreground,
      fontFamily: "ZenDots",
      fontSize: 40,
    },
    number: {
      color: colours.foreground,
      fontFamily: "ZenDots",
      fontSize: 50,
      minWidth: 100,
      maxWidth: 100,
      textAlign: "center",
    },
    textSave: {
      color: colours.background,
      fontFamily: "ZenDots",
      fontSize: 24,
      overflow: "hidden",
    },
    counter: {
      width: "90%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      gap: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOG PUSHUP</Text>
      <View style={styles.content}>
        <View style={styles.counter}>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              android_ripple={{
                color: colours.background,
              }}
              onPress={() => {
                setCount(count + 1);
              }}
            >
              <Text style={styles.text}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.number} adjustsFontSizeToFit numberOfLines={1}>
            {count}
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              android_ripple={{
                color: colours.background,
              }}
              onPress={() => {
                if (count > 1) {
                  setCount(count - 1);
                }
              }}
            >
              <Text style={styles.text}>-</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.buttonSaveContainer}>
          <Pressable
            style={styles.buttonSave}
            android_ripple={{
              color: colours.alt_background,
            }}
            onPress={() => {}}
          >
            <Text style={styles.textSave}>save rep</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
