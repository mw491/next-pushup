import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import TabBarComponent from "../TabBarComponent";
import useColours from "../../colours";

export default function TabLayout() {
  const colours = useColours();
  return (
    <>
      <StatusBar
        style={colours.scheme == "dark" ? "light" : "dark"}
        backgroundColor={colours.background}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colours.background,
          },
          tabBarActiveTintColor: colours.primary,
          tabBarInactiveTintColor: colours.foreground,
        }}
        tabBar={(props) => <TabBarComponent {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name="home"
                size={24}
                color={color}
                style={{
                  transform: [{ scale: focused ? 1.2 : 1 }],
                  opacity: focused ? 1 : 0.8,
                }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name="add"
                size={24}
                color={color}
                style={{
                  transform: [{ scale: focused ? 1.2 : 1 }],
                  color: colours.background,
                  backgroundColor: colours.foreground,
                  borderRadius: 100,
                  opacity: focused ? 1 : 0.8,
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
              <Ionicons
                name="list"
                size={24}
                color={color}
                style={{
                  transform: [{ scale: focused ? 1.2 : 1 }],
                  opacity: focused ? 1 : 0.8,
                }}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
