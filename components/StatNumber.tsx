import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View, ViewStyle } from "react-native";

type AnimatedCounterProps = {
  targetValue: number;
  duration?: number;
  style?: any;
  variant?: "large" | "small";
};

export default function AnimatedCounter({
  targetValue,
  duration = 1000,
  style,
  variant = "small",
}: AnimatedCounterProps) {
  // Create an Animated.Value starting at 0
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Local state to display the current animated value as an integer.
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Reset the value if targetValue changes (optional)
    animatedValue.setValue(0);

    // Animate from 0 to targetValue
    Animated.timing(animatedValue, {
      toValue: targetValue,
      duration: duration,
      useNativeDriver: false, // false because we are updating text
    }).start();

    // Listen for animated value updates and update state accordingly
    const listenerId = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.floor(value));
    });

    // Cleanup the listener when component unmounts
    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [targetValue]);

  // Different container styles based on variant
  const containerStyle: ViewStyle =
    variant === "large"
      ? { width: "100%", overflow: "hidden" }
      : { minWidth: 50 };

  // Different text styles based on variant
  const textStyle =
    variant === "large"
      ? { width: "100%", textAlign: "center" }
      : { textAlign: "center" };

  return (
    <View style={containerStyle}>
      <Text
        style={[textStyle, style]}
        adjustsFontSizeToFit
        numberOfLines={1}
        minimumFontScale={variant === "large" ? 0.1 : 0.5}
      >
        {displayValue}
      </Text>
    </View>
  );
}
