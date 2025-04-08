import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import DatePicker from "react-native-date-picker";
import useColours from "../../colours";
import Card from "@/components/Card";
import * as Application from "expo-application";
import { store$ } from "@/storage";
import { use$ } from "@legendapp/state/react";
import {
  scheduleReminderNotification,
  cancelScheduledNotifications,
} from "@/utils/notifications";

const Settings = () => {
  const settings = use$(store$.settings);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const colours = useColours();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 30,
      paddingTop: 40,
      backgroundColor: colours.background,
    },
    content: {
      gap: 20,
      paddingBottom: 40,
    },
    title: {
      fontSize: 24,
      fontFamily: "ZenDots",
      marginBottom: 20,
      marginTop: 20,
      color: colours.foreground,
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
    settingValue: {
      fontFamily: "ZenDots",
      fontSize: 14,
      color: colours.alt_foreground,
    },
    reminderTime: {
      opacity: settings.sendReminder ? 1 : 0.3,
    },
    input: {
      fontFamily: "ZenDots",
      fontSize: 14,
      textAlign: "right",
      minWidth: 80,
      color: colours.alt_foreground,
    },
    timeText: {
      fontFamily: "ZenDots",
      fontSize: 14,
      textAlign: "center",
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
    },
    switchTrackColorFalse: {
      backgroundColor: colours.background,
    },
    switchTrackColorTrue: {
      backgroundColor: colours.foreground,
    },
    switchThumbColor: {
      backgroundColor: colours.alt_background,
    },
    versionContainer: {
      alignItems: "center",
      paddingBottom: 20,
      gap: 4,
    },
    versionText: {
      fontFamily: "ZenDots",
      fontSize: 12,
      opacity: 0.7,
      color: colours.alt_foreground,
    },
  });

  const handleTimeChange = async (selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      store$.updateSettings({ ...settings, reminderTime: timeString });

      // Schedule notification with new time if reminders are enabled
      if (settings.sendReminder) {
        await scheduleReminderNotification(timeString);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SETTINGS</Text>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Daily Goal</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={settings.dailyGoal.toString()}
              onChangeText={(text) =>
                store$.updateSettings({
                  ...settings,
                  dailyGoal: parseInt(text, 10),
                })
              }
            />
          </View>
        </Card>

        <Card>
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Send Reminder</Text>
            <Switch
              value={settings.sendReminder}
              onValueChange={async (value) => {
                store$.updateSettings({ ...settings, sendReminder: value });

                if (value) {
                  // Schedule notification if enabled
                  await scheduleReminderNotification(settings.reminderTime);
                } else {
                  // Cancel notifications if disabled
                  await cancelScheduledNotifications();
                }
              }}
              trackColor={{
                false: colours.background,
                true: colours.foreground,
              }}
              thumbColor={colours.alt_foreground}
            />
          </View>
        </Card>

        <Card>
          <View style={[styles.settingGroup, styles.reminderTime]}>
            <Text style={styles.settingLabel}>Reminder Time</Text>
            <Pressable
              onPress={() => setShowTimePicker(true)}
              style={styles.timeButton}
              disabled={!settings.sendReminder}
              android_ripple={{
                color: colours.alt_background,
              }}
            >
              <Text style={styles.timeText}>{settings.reminderTime}</Text>
            </Pressable>
            <DatePicker
              modal
              mode="time"
              title="Select time to send reminder"
              date={(() => {
                const [hours, minutes] = settings.reminderTime
                  .split(":")
                  .map(Number);
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
      </ScrollView>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          App Version: {Application.nativeApplicationVersion}
        </Text>
        <Text style={styles.versionText}>
          Build Version: {Application.nativeBuildVersion}
        </Text>
      </View>
    </View>
  );
};

export default Settings;
