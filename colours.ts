import { useColorScheme } from "react-native";

type ColourScheme = {
  primary: string;
  foreground: string;
  background: string;
  alt_foreground: string;
  alt_background: string;
};

export default function useColours(): ColourScheme {
  const scheme = useColorScheme();

  const colours: ColourScheme = {
    primary: "#007BFF",
    foreground: scheme === "dark" ? "#F5F5F5" : "#111111",
    background: scheme === "dark" ? "#111111" : "#F5F5F5",
    alt_foreground: scheme === "dark" ? "#F9F9F9" : "#222222",
    alt_background: scheme === "dark" ? "#222222" : "#E5E5E5",
  };

  return colours;
}
