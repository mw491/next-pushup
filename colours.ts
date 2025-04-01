import { useColorScheme } from "react-native";
import { useEffect, useState } from "react";
import { Theme, themeEmitter, readAllData } from "@/storageUtils";

type ColourScheme = {
  scheme: string | null | undefined;
  primary: string;
  foreground: string;
  background: string;
  alt_foreground: string;
  alt_background: string;
};

export default function useColours(): ColourScheme {
  const systemScheme = useColorScheme();
  const [userTheme, setUserTheme] = useState<Theme>(Theme.SYSTEM);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const data = await readAllData();
        setUserTheme(data.userSettings.theme);
      } catch (e) {
        console.warn("Error loading theme:", e);
      }
    };

    // Load theme initially
    loadTheme();

    // Listen for theme changes
    const onThemeChange = (newTheme: Theme) => {
      setUserTheme(newTheme);
    };
    themeEmitter.on('themeChanged', onThemeChange);

    return () => {
      themeEmitter.off('themeChanged', onThemeChange);
    };
  }, []);

  const scheme = userTheme === Theme.SYSTEM ? systemScheme : userTheme;

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
