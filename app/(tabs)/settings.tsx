import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
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
            <TextInput
              style={[styles.input, { color: colours.alt_foreground }]}
              value={settings.reminderTime}
              onChangeText={(text) => updateSetting("reminderTime", text)}
            />
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
