import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { observer } from "@legendapp/state/react";
import { store$ } from "../utils/storage";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  getDay,
  subDays,
} from "date-fns";
import { FontAwesome5 } from "@expo/vector-icons";
import useColours from "@/utils/colours";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const WeekPerformance = observer(() => {
  const colours = useColours();
  const pushupsData = store$.pushups.get();
  const settings = store$.settings.get();
  const today = new Date();

  // Calculate current streak
  const calculateStreak = () => {
    let streak = 0;
    let currentDate = today;
    let keepCounting = true;

    while (keepCounting) {
      const formattedDate = format(currentDate, "dd/MM/yyyy");
      const dayEntry = pushupsData.find(
        (entry) => entry.date === formattedDate
      );
      const dailyGoal = dayEntry?.dailyGoal ?? settings.dailyGoal;
      const totalPushups =
        dayEntry?.sets.reduce((sum, set) => sum + set.pushups, 0) ?? 0;
      const goalMet = totalPushups >= dailyGoal && totalPushups > 0;

      // If it's today and goal not met, don't count today but continue checking previous days
      if (isSameDay(currentDate, today) && !goalMet) {
        currentDate = subDays(currentDate, 1);
        continue;
      }

      // If goal was met, increment streak and check previous day
      if (goalMet) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        // If goal was not met, stop counting
        keepCounting = false;
      }
    }

    return streak;
  };

  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sunday as start of week
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyPerformance = daysInWeek.map((date) => {
    const formattedDate = format(date, "dd/MM/yyyy");
    const dayEntry = pushupsData.find((entry) => entry.date === formattedDate);
    const dailyGoal = dayEntry?.dailyGoal ?? settings.dailyGoal;
    const totalPushups =
      dayEntry?.sets.reduce((sum, set) => sum + set.pushups, 0) ?? 0;
    const goalMet = totalPushups >= dailyGoal && totalPushups > 0;
    const isToday = isSameDay(date, today);
    const dayIndex = getDay(date); // 0 for Sunday, 1 for Monday, ...

    return {
      date,
      formattedDate,
      goalMet,
      isToday,
      dayLetter: daysOfWeek[dayIndex],
    };
  });

  const currentStreak = calculateStreak();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colours.alt_background,
      padding: 20,
      borderRadius: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    headerText: {
      color: colours.foreground,
      fontSize: 18,
      fontFamily: "ZenDots",
    },
    streakContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    streakText: {
      color: colours.foreground,
      fontSize: 18,
      fontFamily: "ZenDots",
      marginLeft: 5,
    },
    daysContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    dayBase: {
      width: 30,
      height: 30,
      borderRadius: 15, // Circle
      justifyContent: "center",
      alignItems: "center",
    },
    dayToday: {
      borderWidth: 2,
      borderColor: "#FFFFFF",
    },
    dayGoalMet: {
      backgroundColor: colours.foreground,
    },
    dayNotMet: {
      backgroundColor: colours.background,
    },
    dayTextBase: {
      fontSize: 14,
      fontFamily: "ZenDots",
    },
    dayTextMet: {
      color: colours.background,
    },
    dayTextNotMet: {
      color: colours.alt_foreground,
      opacity: 0.5,
    },
    dayTextToday: {
      color: colours.foreground,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>this week</Text>
        <View style={styles.streakContainer}>
          <FontAwesome5 name="fire-alt" size={18} color={colours.foreground} />
          <Text style={styles.streakText}>{currentStreak}</Text>
        </View>
      </View>
      <View style={styles.daysContainer}>
        {weeklyPerformance.map((day, index) => {
          const dayStyle = [
            styles.dayBase,
            day.isToday ? styles.dayToday : null,
            day.goalMet
              ? styles.dayGoalMet
              : day.isToday
              ? null
              : styles.dayNotMet,
          ];
          const textStyle = [
            styles.dayTextBase,
            day.goalMet
              ? styles.dayTextMet
              : day.isToday
              ? styles.dayTextToday
              : styles.dayTextNotMet,
          ];

          return (
            <View key={index} style={dayStyle}>
              <Text style={textStyle}>{day.dayLetter}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});

export default WeekPerformance;
