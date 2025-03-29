import { Pressable, Text, View, StyleSheet, ScrollView } from "react-native";
import useColours from "@/colours";
import { useState } from "react";
import { addPushup } from "@/storageUtils";
import { router } from "expo-router";
import { useAppData } from "../_layout";

export default function AddPushup() {
  const [count, setCount] = useState(0);
  const colours = useColours();
  const { refreshData, data: appData } = useAppData();

  // Get today's sets
  const today = new Date().toLocaleDateString("en-GB");
  const todayEntry = appData.pushupData.find((day) => day.date === today);
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
    setsList: {
      width: "90%",
      alignSelf: "center",
    },
    setItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colours.foreground + "22",
    },
    setText: {
      color: colours.foreground,
      fontFamily: "ZenDots",
      fontSize: 16,
    },
  });

  const handleSave = async () => {
    if (count > 0) {
      setCount(0);
      const today = new Date().toLocaleDateString("en-GB");
      await addPushup({
        date: today,
        sets: [{ pushups: count, time: new Date().toISOString() }],
      });
      await refreshData(); // Refresh the app data after adding new entry
      router.back();
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <View style={styles.setsList}>
            <Text style={[styles.setText, { marginBottom: 10 }]}>
              today's sets:
            </Text>
            {todaySets.map((item, index) => (
              <View key={index} style={styles.setItem}>
                <Text style={styles.setText}>set {index + 1}</Text>
                <Text style={styles.setText}>{item.pushups} pushups</Text>
                <Text style={styles.setText}>{formatTime(item.time)}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
