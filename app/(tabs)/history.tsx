import { View, Text, StyleSheet, FlatList } from "react-native";
import useColours from "@/utils/colours";
import { store$ } from "@/utils/storage";
import { use$ } from "@legendapp/state/react";

/**
 * History screen of the application
 * Displays a chronological list of all pushup sets recorded by the user
 */
export default function History() {
  const colours = useColours();
  const pushups = use$(store$.pushups);

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
      gap: 20,
      paddingBottom: 40,
    },
    setsList: {
      gap: 20,
    },
    dayContainer: {
      backgroundColor: colours.alt_background,
      borderRadius: 10,
      overflow: "hidden",
    },
    dateHeader: {
      backgroundColor: colours.foreground,
      padding: 15,
    },
    dateText: {
      color: colours.background,
      fontFamily: "ZenDots",
      fontSize: 14,
    },
    setItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colours.foreground + "22",
    },
    setText: {
      color: colours.foreground,
      fontFamily: "ZenDots",
      fontSize: 14,
    },
  });

  const getDayOfWeek = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-GB", { weekday: "long" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PUSHUP HISTORY</Text>
      {pushups.length > 0 ? (
        <FlatList
          data={pushups.sort((a, b) => {
            // Sort by date descending (newest first)
            const [aDay, aMonth, aYear] = a.date.split("/").map(Number);
            const [bDay, bMonth, bYear] = b.date.split("/").map(Number);
            return (
              new Date(bYear, bMonth - 1, bDay).getTime() -
              new Date(aYear, aMonth - 1, aDay).getTime()
            );
          })}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.content}
          renderItem={({ item: day }) => {
            const totalPushups = day.sets.reduce(
              (sum, set) => sum + set.pushups,
              0
            );

            return (
              <View style={styles.dayContainer}>
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
                  <View
                    key={index}
                    style={[
                      styles.setItem,
                      index === day.sets.length - 1
                        ? { borderBottomWidth: 0 }
                        : {},
                    ]}
                  >
                    <Text style={styles.setText}>set {index + 1}</Text>
                    <Text style={styles.setText}>{set.pushups} pushups</Text>
                    <Text style={styles.setText}>{set.time}</Text>
                  </View>
                ))}
              </View>
            );
          }}
        />
      ) : (
        <Text style={[styles.setText, { textAlign: "center" }]}>
          No pushups recorded yet
        </Text>
      )}
    </View>
  );
}
