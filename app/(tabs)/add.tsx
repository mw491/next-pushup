import { Pressable, Text, View, StyleSheet, ScrollView } from "react-native";
import useColours from "@/utils/colours";
import { useState } from "react";
import { store$ } from "@/utils/storage";
import { router } from "expo-router";
import { use$ } from "@legendapp/state/react";

export default function AddPushup() {
  const [count, setCount] = useState(0);
  const colours = useColours();
  const pushups = use$(store$.pushups);

  // Get today's sets
  const today = new Date().toLocaleDateString("en-GB");
  const todayEntry = pushups.find((day) => day.date === today);
  const todaySets = todayEntry?.sets || [];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colours.background,
      padding: 30,
      paddingTop: 40,
    },
    title: {
      fontSize: 24,
      fontFamily: "ZenDots",
      color: colours.foreground,
      marginBottom: 20,
      marginTop: 20,
    },
    content: {
      marginTop: 20,
      alignItems: "center",
      gap: 30,
      paddingBottom: 40,
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
      width: "100%",
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
      fontSize: 16,
    },
    counter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
    },
    todayContainer: {
      width: "100%",
      gap: 10,
    },
    todayTitle: {
      color: colours.foreground,
      fontFamily: "ZenDots",
      fontSize: 16,
      opacity: 0.7,
    },
    todaySetContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colours.alt_background,
      padding: 15,
      borderRadius: 10,
    },
    todaySetText: {
      color: colours.foreground,
      fontFamily: "ZenDots",
      fontSize: 14,
    },
  });

  const handleSave = async () => {
    if (count > 0) {
      const now = new Date();
      const time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      store$.addPushup({
        date: today,
        sets: [
          {
            pushups: count,
            time,
          },
        ],
      });

      setCount(0);
      router.push("/");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOG PUSHUP</Text>
      <ScrollView contentContainerStyle={styles.content} fadingEdgeLength={10}>
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
            onPress={handleSave}
          >
            <Text style={styles.textSave}>save set</Text>
          </Pressable>
        </View>

        {todaySets.length > 0 && (
          <View style={styles.todayContainer}>
            <Text style={styles.todayTitle}>Today's Sets</Text>
            {todaySets.map((set, index) => (
              <View key={index} style={styles.todaySetContainer}>
                <Text style={styles.todaySetText}>Set {index + 1}</Text>
                <Text style={styles.todaySetText}>{set.pushups} pushups</Text>
                <Text style={styles.todaySetText}>{set.time}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
