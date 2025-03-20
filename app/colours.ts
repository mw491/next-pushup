import { useColorScheme } from "react-native";

type ColourScheme = {
  primary: string;
  foreground: string;
  background: string;
};

export default function useColours(): ColourScheme {
  const scheme = useColorScheme();

  const colours: ColourScheme = {
    primary: "#007BFF",
    foreground: scheme === "dark" ? "#F5F5F5" : "#111111",
    background: scheme === "dark" ? "#111111" : "#F5F5F5",
  };

  return colours;
}
