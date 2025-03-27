import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Animated, ViewStyle } from "react-native";
import TabBarComponent from "@/components/TabBarComponent";
import useColours from "@/colours";

interface AnimatedTabIconProps {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  focused: boolean;
  style?: ViewStyle;
}

const AnimatedTabIcon = ({
  name,
  color,
  focused,
  style,
}: AnimatedTabIconProps) => {
  const animatedScale = React.useRef(
    new Animated.Value(focused ? 1.1 : 0.9)
  ).current;
  const animatedOpacity = React.useRef(
    new Animated.Value(focused ? 1 : 0.5)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animatedScale, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(animatedOpacity, {
        toValue: focused ? 1 : 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: animatedScale }],
        opacity: animatedOpacity,
        ...style,
      }}
    >
      <Ionicons name={name} size={24} color={color} />
    </Animated.View>
  );
};

export default function TabLayout() {
  const colours = useColours();
  return (
    <>
      <StatusBar style={colours.scheme == "dark" ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colours.background,
          },
        }}
        tabBar={(props) => <TabBarComponent {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon name="home" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            tabBarIcon: ({ focused }) => (
              <AnimatedTabIcon
                name="add"
                color={colours.background}
                focused={focused}
                style={{
                  backgroundColor: colours.foreground,
                  borderRadius: 100,
                  padding: 10,
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon name="list" color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
