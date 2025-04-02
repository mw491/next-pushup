import { View, Text, StyleSheet, ScrollView } from "react-native";
import useColours from "@/colours";
import { useAppData } from "../_layout";

export default function History() {
  const colours = useColours();
  const { data: appData } = useAppData();

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
      paddingBottom: 40,
    },
    setsList: {
      width: "100%",
      gap: 20,
    },
    dayContainer: {
      marginBottom: 20,
    },
    dateHeader: {
      backgroundColor: colours.alt_background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 10,
      width: "100%",
    },
    dateText: {
      color: colours.foreground,
      fontFamily: "ZenDots",
      textAlign: "center",
    },
    setItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colours.foreground + "22",
    },
    setText: {
      color: colours.foreground,
      fontFamily: "ZenDots",
      fontSize: 18,
    },
    emptyText: {
      color: colours.foreground,
      fontFamily: "ZenDots",
      fontSize: 18,
      textAlign: "center",
      marginTop: 50,
    },
  });

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDayOfWeek = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-GB", { weekday: "long" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PUSHUP HISTORY</Text>
      <ScrollView contentContainerStyle={styles.content}>
        {appData.pushupData.length > 0 ? (
          <View style={styles.setsList}>
            {appData.pushupData
              .sort((a, b) => {
                // Sort by date descending (newest first)
                const [aDay, aMonth, aYear] = a.date.split("/").map(Number);
                const [bDay, bMonth, bYear] = b.date.split("/").map(Number);
                return (
                  new Date(bYear, bMonth - 1, bDay).getTime() -
                  new Date(aYear, aMonth - 1, aDay).getTime()
                );
              })
              .map((day) => {
                const totalPushups = day.sets.reduce(
                  (sum, set) => sum + set.pushups,
                  0
                );

                return (
                  <View key={day.date} style={styles.dayContainer}>
                    <View style={styles.dateHeader}>
                      <Text
                        style={styles.dateText}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                      >
                        {getDayOfWeek(day.date)} ({day.date}): {totalPushups}{" "}
                        pushups
                      </Text>
                    </View>
                    {day.sets.map((set, index) => (
                      <View key={index} style={styles.setItem}>
                        <Text style={styles.setText}>set {index + 1}</Text>
                        <Text style={styles.setText}>
                          {set.pushups} pushups
                        </Text>
                        <Text style={styles.setText}>
                          {formatTime(set.time)}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              })}
          </View>
        ) : (
          <Text style={styles.emptyText}>No pushup data yet</Text>
        )}
      </ScrollView>
    </View>
  );
}
