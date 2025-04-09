import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TouchableOpacity } from "react-native";
import TabBarComponent from "../components/TabBarComponent";

// Mock dependencies
jest.mock("../utils/colours", () => ({
  __esModule: true,
  default: () => ({
    foreground: "#000000",
    background: "#FFFFFF",
    alt_background: "#F5F5F5",
  }),
}));

describe("TabBarComponent", () => {
  const mockNavigation = {
    emit: jest.fn(() => ({ defaultPrevented: false })),
    navigate: jest.fn(),
  };

  const mockTabBarIcon = jest.fn(({ focused }) =>
    focused ? (
      <div data-testid="focused-icon">Focused Icon</div>
    ) : (
      <div data-testid="unfocused-icon">Unfocused Icon</div>
    )
  );

  const mockProps = {
    state: {
      routes: [
        { key: "home", name: "Home" },
        { key: "add", name: "Add" },
        { key: "history", name: "History" },
      ],
      index: 0, // First tab is focused
    },
    descriptors: {
      home: {
        options: {
          tabBarIcon: mockTabBarIcon,
        },
      },
      add: {
        options: {
          tabBarIcon: mockTabBarIcon,
        },
      },
      history: {
        options: {
          tabBarIcon: mockTabBarIcon,
        },
      },
    },
    navigation: mockNavigation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all tabs", () => {
    const { UNSAFE_getAllByType } = render(<TabBarComponent {...mockProps} />);

    // Find all TouchableOpacity components
    const tabs = UNSAFE_getAllByType(TouchableOpacity);
    expect(tabs).toHaveLength(3); // 3 tabs
  });

  it("passes the correct props to the tab bar icon", () => {
    render(<TabBarComponent {...mockProps} />);

    // Check the tabBarIcon function has been called once for each tab
    expect(mockTabBarIcon).toHaveBeenCalledTimes(3);

    // Check that the tabBarIcon function was called with the correct props for the focused tab
    expect(mockTabBarIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        focused: true,
        weight: "bold",
      })
    );

    // Check that the tabBarIcon function was called with the correct props for unfocused tabs
    expect(mockTabBarIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        focused: false,
        weight: "regular",
      })
    );
  });

  it("calls navigation functions when tab is pressed", () => {
    const { UNSAFE_getAllByType } = render(<TabBarComponent {...mockProps} />);

    const tabs = UNSAFE_getAllByType(TouchableOpacity);

    // Press the second tab (index 1)
    fireEvent.press(tabs[1]);

    // Check that navigation.emit was called with the correct parameters
    expect(mockNavigation.emit).toHaveBeenCalledWith({
      type: "tabPress",
      target: "add",
      canPreventDefault: true,
    });

    // Check that navigation.navigate was called with the correct route name
    expect(mockNavigation.navigate).toHaveBeenCalledWith("Add");
  });

  it("does not navigate when pressing the active tab", () => {
    const { UNSAFE_getAllByType } = render(<TabBarComponent {...mockProps} />);

    const tabs = UNSAFE_getAllByType(TouchableOpacity);

    // Press the first tab (index 0), which is already active
    fireEvent.press(tabs[0]);

    // Check that navigation.emit was called
    expect(mockNavigation.emit).toHaveBeenCalled();

    // Check that navigation.navigate was NOT called
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });
});
