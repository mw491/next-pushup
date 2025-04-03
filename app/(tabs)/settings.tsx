import React, { useState, useEffect } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  readAllData,
  updateSettings,
  UserSettings,
} from "../../storageUtils"; // Adjust path as necessary
import useColours from "../../colours"; // Import the useColours hook
import Card from "@/components/Card";
import * as Application from "expo-application";

const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    dailyGoal: 30,
    sendReminder: true,
    reminderTime: "12:00",
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await readAllData();
      setSettings(data.userSettings);
    };

    loadSettings();
  }, []);

  const updateSetting = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleTimeChange = (_event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      updateSetting("reminderTime", timeString);
    }
  };

  const colours = useColours(); // Use the useColours hook to get the current color scheme



  return (
    <View style={[styles.container, { backgroundColor: colours.background }]}>
      <Text style={[styles.title, { color: colours.foreground }]}>
        SETTINGS
      </Text>
      <ScrollView contentContainerStyle={styles.content}>

        <Card>
          <View style={styles.settingGroup}>
            <Text
              style={[styles.settingLabel, { color: colours.alt_foreground }]}
            >
              Daily Goal
            </Text>
            <TextInput
              style={[styles.input, { color: colours.alt_foreground }]}
              keyboardType="number-pad"
              value={settings.dailyGoal.toString()}
              onChangeText={(text) =>
                updateSetting("dailyGoal", parseInt(text, 10))
              }
            />
          </View>
        </Card>

        <Card>
          <View style={styles.settingGroup}>
            <Text
              style={[styles.settingLabel, { color: colours.alt_foreground }]}
            >
              Send Reminder
            </Text>
            <Switch
              value={settings.sendReminder}
              onValueChange={(value) => updateSetting("sendReminder", value)}
              trackColor={{
                false: colours.background,
                true: colours.foreground,
              }}
              thumbColor={colours.alt_background}
            />
          </View>
        </Card>

        <Card>
          <View style={styles.settingGroup}>
            <Text
              style={[styles.settingLabel, { color: colours.alt_foreground }]}
            >
              Reminder Time
            </Text>
            <Pressable onPress={() => setShowTimePicker(true)}>
              <Text style={[styles.timeText, { color: colours.alt_foreground }]}>
                {settings.reminderTime}
              </Text>
            </Pressable>
            {showTimePicker && (
              <DateTimePicker
                value={(() => {
                  const [hours, minutes] = settings.reminderTime.split(':').map(Number);
                  const date = new Date();
                  date.setHours(hours);
                  date.setMinutes(minutes);
                  return date;
                })()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
        </Card>
      </ScrollView>

      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: colours.alt_foreground }]}>
          App Version: {Application.nativeApplicationVersion}
        </Text>
        <Text style={[styles.versionText, { color: colours.alt_foreground }]}>
          Build Version: {Application.nativeBuildVersion}
        </Text>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 40,
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
  },
  settingValue: {
    fontFamily: "ZenDots",
    fontSize: 14,
  },
  input: {
    fontFamily: "ZenDots",
    fontSize: 14,
    textAlign: "right",
    minWidth: 80,
  },
  timeText: {
    fontFamily: "ZenDots",
    fontSize: 14,
    textAlign: "right",
    minWidth: 80,
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
  },
});

export default Settings;
