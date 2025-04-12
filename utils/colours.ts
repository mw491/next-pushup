import { Appearance, ColorSchemeName } from "react-native";
import { useEffect, useState } from "react";

/**
 * Color scheme type definition
 * Contains all colors used in the application
 */
type ColourScheme = {
  scheme: ColorSchemeName;
  primary: string;
  foreground: string;
  background: string;
  alt_foreground: string;
  alt_background: string;
};

/**
 * Hook to get the current color scheme based on system theme
 * Automatically updates when system theme changes
 */
export default function useColours(): ColourScheme {
  const [scheme, setScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    // Always use system theme
    Appearance.setColorScheme(null);

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(colorScheme);
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
