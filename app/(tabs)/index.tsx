import { Text, View, StyleSheet } from "react-native";
import useColours from "@/colours";
import TodayPushups from "@/components/TodayPushups";
import Stat from "@/components/Stat";
import { useAppData } from "../_layout";
import { useEffect } from "react";

export default function Index() {
  const colours = useColours();
  const { data: appData } = useAppData();

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

  // Calculate statistics from appData
  const personalBest = Math.max(
    ...appData.pushupData.flatMap((day) => day.sets.map((set) => set.pushups)),
    0
  );

  const totalSets = appData.pushupData.reduce(
    (acc, day) => acc + day.sets.length,
    0
  );

  const totalPushups = appData.pushupData.reduce(
    (acc, day) =>
      acc + day.sets.reduce((setAcc, set) => setAcc + set.pushups, 0),
    0
  );

  const setAverage = totalSets > 0 ? Math.round(totalPushups / totalSets) : 0;

  // Get today's total
  const now = new Date();
  const today = now.toLocaleDateString("en-GB");
  const todayEntry = appData.pushupData.find((day) => day.date === today);
  const todayTotal = todayEntry
    ? todayEntry.sets.reduce((acc, set) => acc + set.pushups, 0)
    : 0;

  // Get week, month, and year totals
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Set to Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const weekTotal = appData.pushupData
    .filter((day) => {
      const date = new Date(day.date.split("/").reverse().join("-"));
      return date >= startOfWeek;
    })
    .reduce(
      (acc, day) =>
        acc + day.sets.reduce((setAcc, set) => setAcc + set.pushups, 0),
      0
    );

  const monthTotal = appData.pushupData
    .filter((day) => {
      const date = new Date(day.date.split("/").reverse().join("-"));
      return date >= startOfMonth;
    })
    .reduce(
      (acc, day) =>
        acc + day.sets.reduce((setAcc, set) => setAcc + set.pushups, 0),
      0
    );

  const yearTotal = appData.pushupData
    .filter((day) => {
      const date = new Date(day.date.split("/").reverse().join("-"));
      return date >= startOfYear;
    })
    .reduce(
      (acc, day) =>
        acc + day.sets.reduce((setAcc, set) => setAcc + set.pushups, 0),
      0
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEXT PUSHUP</Text>
      <TodayPushups count={todayTotal} />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Stat label="personal best" value={personalBest} />
        </View>
        <View style={{ flex: 1 }}>
          <Stat label="set average" value={setAverage} />
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "stretch" }}>
        <View style={{ flex: 1 }}>
          <Stat label="this week" value={weekTotal} />
        </View>
        <View style={{ flex: 1 }}>
          <Stat label="this month" value={monthTotal} />
        </View>
        <View style={{ flex: 1 }}>
          <Stat label="this year" value={yearTotal} />
        </View>
      </View>
    </View>
  );
}
