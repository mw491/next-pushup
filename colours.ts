import { Appearance, ColorSchemeName } from "react-native";
import { useEffect, useState } from "react";
import { Theme, themeEmitter, readAllData } from "@/storageUtils";

type ColourScheme = {
  scheme: ColorSchemeName;
  primary: string;
  foreground: string;
  background: string;
  alt_foreground: string;
  alt_background: string;
};

export default function useColours(): ColourScheme {
  const [scheme, setScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [userTheme, setUserTheme] = useState<Theme>(Theme.SYSTEM);

  useEffect(() => {
    // Load user theme preference
    const loadTheme = async () => {
      try {
        const data = await readAllData();
        setUserTheme(data.userSettings.theme);
        if (data.userSettings.theme !== Theme.SYSTEM) {
          Appearance.setColorScheme(data.userSettings.theme === Theme.DARK ? 'dark' : 'light');
        } else {
          Appearance.setColorScheme(null); // Reset to system default
        }
      } catch (e) {
        console.warn("Error loading theme:", e);
      }
    };

    loadTheme();

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (userTheme === Theme.SYSTEM) {
        setScheme(colorScheme);
      }
    });

    // Listen for user theme preference changes
    const onThemeChange = (newTheme: Theme) => {
      setUserTheme(newTheme);
      if (newTheme === Theme.SYSTEM) {
        Appearance.setColorScheme(null);
        setScheme(Appearance.getColorScheme());
      } else {
        const newScheme = newTheme === Theme.DARK ? 'dark' : 'light';
        Appearance.setColorScheme(newScheme);
        setScheme(newScheme);
      }
    };
    themeEmitter.on('themeChanged', onThemeChange);

    return () => {
      subscription.remove();
      themeEmitter.off('themeChanged', onThemeChange);
    };
  }, [userTheme]);

  const colours: ColourScheme = {
    scheme,
    primary: "#007BFF",
    foreground: scheme === "dark" ? "#F5F5F5" : "#111111",
    background: scheme === "dark" ? "#111111" : "#F5F5F5",
    alt_foreground: scheme === "dark" ? "#F9F9F9" : "#222222",
    alt_background: scheme === "dark" ? "#222222" : "#E5E5E5",
  };

  return colours;
}
