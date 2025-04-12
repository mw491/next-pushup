import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { router } from "expo-router";
import useColours from "@/utils/colours";
import { store$ } from "@/utils/storage";
import { scheduleReminderNotification } from "@/utils/notifications";
import Card from "@/components/Card";

/**
 * Onboarding screen shown to first-time users
 * Allows setting up initial preferences like daily goal and reminders
 */
export default function Onboarding() {
  const colours = useColours();
  const [dailyGoal, setDailyGoal] = useState("30");
  const [sendReminder, setSendReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("12:00");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colours.background,
      padding: 30,
      paddingTop: 60,
    },
    content: {
      flex: 1,
      gap: 20,
    },
    title: {
      fontSize: 32,
      fontFamily: "ZenDots",
      color: colours.foreground,
      marginBottom: 30,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      fontFamily: "ZenDots",
      color: colours.foreground,
      marginBottom: 20,
      textAlign: "center",
      opacity: 0.7,
    },
    settingGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    settingLabel: {
      fontFamily: "ZenDots",
      fontSize: 14,
      color: colours.alt_foreground,
    },
    input: {
      fontFamily: "ZenDots",
      fontSize: 14,
      textAlign: "right",
      minWidth: 80,
      color: colours.alt_foreground,
    },
    timeButton: {
      borderWidth: 1,
      borderColor: colours.foreground,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
      minWidth: 100,
      alignItems: "center",
      justifyContent: "center",
      opacity: sendReminder ? 1 : 0.3,
    },
    timeText: {
      fontFamily: "ZenDots",
      fontSize: 14,
      color: colours.alt_foreground,
    },
    startButton: {
      backgroundColor: colours.foreground,
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginTop: "auto",
      marginBottom: 20,
    },
    startButtonText: {
      fontFamily: "ZenDots",
      fontSize: 16,
      color: colours.background,
    },
  });

  /**
   * Handle time selection from the time picker
   * Updates the reminder time state with the selected time
   *
   * @param selectedDate - The date object containing the selected time
   */
  const handleTimeChange = (selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      setReminderTime(timeString);
    }
  };

  /**
   * Handle the start button press
   * Saves user settings, schedules notifications if enabled, and navigates to the main app
   */
  const handleStart = async () => {
    const settings = {
      dailyGoal: parseInt(dailyGoal, 10) || 30,
      sendReminder,
      reminderTime,
      onboardingCompleted: true,
    };

    store$.updateSettings(settings);

    if (sendReminder) {
      await scheduleReminderNotification(reminderTime);
    }

    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WELCOME TO{"\n"}NEXT PUSHUP</Text>
      <Text style={styles.subtitle}>
        Let's set up your daily goals and reminders
      </Text>

      <View style={styles.content}>
        <Card>
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>daily goal</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={dailyGoal}
              onChangeText={setDailyGoal}
            />
          </View>
        </Card>

        <Card>
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>send reminder</Text>
            <Switch
              value={sendReminder}
              onValueChange={setSendReminder}
              trackColor={{
                false: colours.background,
                true: colours.foreground,
              }}
              thumbColor={colours.alt_foreground}
            />
          </View>
        </Card>

        <Card>
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>reminder time</Text>
            <Pressable
              onPress={() => setShowTimePicker(true)}
              style={styles.timeButton}
              disabled={!sendReminder}
              android_ripple={{
                color: colours.alt_background,
              }}
            >
              <Text style={styles.timeText}>{reminderTime}</Text>
            </Pressable>
            <DatePicker
              modal
              mode="time"
              title="Select time to send reminder"
              date={(() => {
                const [hours, minutes] = reminderTime.split(":").map(Number);
                const date = new Date();
                date.setHours(hours);
                date.setMinutes(minutes);
                return date;
              })()}
              open={showTimePicker}
              onCancel={() => setShowTimePicker(false)}
              onConfirm={handleTimeChange}
            />
          </View>
        </Card>

        <Pressable
          style={styles.startButton}
          onPress={handleStart}
          android_ripple={{
            color: colours.alt_background,
          }}
        >
          <Text style={styles.startButtonText}>GET STARTED</Text>
        </Pressable>
      </View>
    </View>
  );
}
