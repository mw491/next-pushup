import { Pressable, Text, View, StyleSheet } from "react-native";
import useColours from "@/colours";
import { useState } from "react";
import { addPushup } from "@/storageUtils";
import { router } from "expo-router";

export default function AddPushup() {
  const [count, setCount] = useState(0);
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
    },
    buttonSave: {
      backgroundColor: count > 0 ? colours.foreground : colours.alt_background,
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
      color: count > 0 ? colours.background : colours.foreground,
      opacity: count == 0 ? 0.5 : 1,
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
                if (count > 0) {
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
            onPress={() => {
              addPushup({
                date: new Date().toLocaleDateString("en-GB"),
                sets: [
                  {
                    pushups: count,
                    time: new Date().toLocaleTimeString("en-GB", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                ],
              })
                .then(() => {
                  router.replace("/(tabs)");
                })
                .catch((error) => {
                  console.error("Error saving pushup:", error);
                });
            }}
          >
            <Text style={styles.textSave}>save set</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
