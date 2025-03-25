import React, { useEffect, useRef, useState } from "react";
import { Animated, Text } from "react-native";

type AnimatedCounterProps = {
  targetValue: number;
  duration?: number;
  style?: any;
};

export default function AnimatedCounter({
  targetValue,
  duration = 1000,
  style,
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

  return (
    <Text style={style} adjustsFontSizeToFit numberOfLines={1}>
      {displayValue}
    </Text>
  );
}
