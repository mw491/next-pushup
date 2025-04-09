import React from "react";
import { View, TouchableOpacity } from "react-native";
import useColours from "@/utils/colours";

export default function TabBarComponent({
  state,
  descriptors,
  navigation,
}: any) {
  const colours = useColours();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colours.background,
        borderTopWidth: 1,
        borderTopColor: colours.alt_background,
        paddingVertical: 18,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  options.tabBarStyle?.backgroundColor || colours.background,
              },
            ]}
          >
            {/* Render the icon with bold weight when focused */}
            {options.tabBarIcon &&
              options.tabBarIcon({
                color: colours.foreground,
                size: 26,
                focused: isFocused,
                // Pass weight property to make focused tab icon bold
                weight: isFocused ? "bold" : "regular",
              })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
