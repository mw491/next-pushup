import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import {
  readAllData,
  updateSettings,
  UserSettings,
  Theme,
} from "../../storageUtils"; // Adjust path as necessary
import useColours from "../../colours"; // Import the useColours hook
import Card from "@/components/Card";

const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    theme: Theme.SYSTEM,
    dailyGoal: 30,
    sendReminder: true,
    reminderTime: "12:00",
  });
  const [themeModalVisible, setThemeModalVisible] = useState(false);

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

  const ThemeOption = ({
    theme,
    onPress,
  }: {
    theme: Theme;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.themeOption,
        {
          backgroundColor:
            settings.theme === theme
              ? colours.foreground
              : colours.alt_background,
        },
      ]}
    >
      <Text
        style={[
          styles.themeOptionText,
          {
            color:
              settings.theme === theme
                ? colours.background
                : colours.alt_foreground,
          },
        ]}
      >
        {theme.toUpperCase()}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colours.background }]}>
      <Text style={[styles.title, { color: colours.foreground }]}>
        SETTINGS
      </Text>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => setThemeModalVisible(true)}>
          <Card>
            <View style={styles.settingGroup}>
              <Text
                style={[styles.settingLabel, { color: colours.alt_foreground }]}
              >
                Theme
              </Text>
              <Text
                style={[styles.settingValue, { color: colours.alt_foreground }]}
              >
                {settings.theme.toUpperCase()}
              </Text>
            </View>
          </Card>
        </Pressable>

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

      <Modal
        animationType="fade"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <Pressable
          style={[
            styles.modalOverlay,
            { backgroundColor: colours.background + "CC" },
          ]}
          onPress={() => setThemeModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Card>
              <View style={styles.themeOptions}>
                <Text
                  style={[styles.modalTitle, { color: colours.alt_foreground }]}
                >
                  SELECT THEME
                </Text>
                <ThemeOption
                  theme={Theme.SYSTEM}
                  onPress={() => {
                    updateSetting("theme", Theme.SYSTEM);
                    setThemeModalVisible(false);
                  }}
                />
                <ThemeOption
                  theme={Theme.LIGHT}
                  onPress={() => {
                    updateSetting("theme", Theme.LIGHT);
                    setThemeModalVisible(false);
                  }}
                />
                <ThemeOption
                  theme={Theme.DARK}
                  onPress={() => {
                    updateSetting("theme", Theme.DARK);
                    setThemeModalVisible(false);
                  }}
                />
              </View>
            </Card>
          </View>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
  },
  themeOptions: {
    width: "100%",
    gap: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "ZenDots",
    fontSize: 16,
    marginBottom: 10,
  },
  themeOption: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  themeOptionText: {
    fontFamily: "ZenDots",
    fontSize: 14,
  },
});

export default Settings;
