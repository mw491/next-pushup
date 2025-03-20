import { useColorScheme } from "react-native";

type ColourScheme = {
  primary: string;
  foreground: string;
  background: string;
};

export default function useColours(): ColourScheme {
  const scheme = useColorScheme();
  console.log(scheme);

  const colours: ColourScheme = {
    primary: "#007BFF",
    foreground: scheme === "dark" ? "#F5F5F5" : "#1C1C1C",
    background: scheme === "dark" ? "#1C1C1C" : "#F5F5F5",
  };

  return colours;
}
