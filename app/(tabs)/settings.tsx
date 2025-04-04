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
  const colours = useColours(); // Use the useColours hook to get the current color scheme

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
      alignItems: 'center',
      justifyContent: 'center',
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        SETTINGS
      </Text>
      <ScrollView contentContainerStyle={styles.content}>

        <Card>
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>
              Daily Goal
            </Text>
            <TextInput
              style={styles.input}
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
            <Text style={styles.settingLabel}>
              Send Reminder
            </Text>
            <Switch
              value={settings.sendReminder}
              onValueChange={(value) => updateSetting("sendReminder", value)}
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
            <Text style={styles.settingLabel}>
              Reminder Time
            </Text>
            <Pressable
              onPress={() => setShowTimePicker(true)}
              style={styles.timeButton}
              android_ripple={{
                color: colours.alt_background,
              }}
            >
              <Text style={styles.timeText}>
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
