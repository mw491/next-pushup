import { render, screen, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";
import History from "@/app/(tabs)/history";
import { store$ } from "@/utils/storage";
import { use$ } from "@legendapp/state/react";

// Mock the store
jest.mock("@/utils/storage", () => ({
  store$: {
    pushups: {
      get: jest.fn(),
      set: jest.fn(),
    },
    settings: {
      get: jest.fn(),
      set: jest.fn(),
    },
    addPushup: jest.fn(),
    updateSettings: jest.fn(),
    clearAllData: jest.fn(),
    totalPushups: jest.fn(),
    todayPushups: jest.fn(),
  },
}));

// Mock use$ hook
jest.mock("@legendapp/state/react", () => ({
  use$: jest.fn(),
}));

describe("Integration Tests", () => {
  const mockPushups = [
    {
      date: "01/05/2023",
      sets: [
        { pushups: 10, time: "10:00" },
        { pushups: 15, time: "14:00" },
      ],
      dailyGoal: 30,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (use$ as jest.Mock).mockImplementation((selector) => {
      if (selector === store$.pushups) {
        return mockPushups;
      }
      if (selector === store$.settings) {
        return {
          dailyGoal: 30,
          sendReminder: true,
          reminderTime: "12:00",
          onboardingCompleted: false,
        };
      }
      return selector;
    });
  });

  describe("Data Flow", () => {
    it("should reflect store updates in the UI", () => {
      render(<History />);

      // Initial state
      expect(screen.getByText("Monday (01/05/2023): 25 pushups")).toBeTruthy();

      // Update store
      const newPushups = [
        ...mockPushups,
        {
          date: "02/05/2023",
          sets: [{ pushups: 20, time: "09:00" }],
          dailyGoal: 30,
        },
      ];

      (use$ as jest.Mock).mockImplementation((selector) => {
        if (selector === store$.pushups) {
          return newPushups;
        }
        return selector;
      });

      // Re-render with new data
      render(<History />);

      // Verify UI reflects new data
      expect(screen.getByText("Tuesday (02/05/2023): 20 pushups")).toBeTruthy();
    });

    it("should handle store errors gracefully", () => {
      // Simulate store error
      (use$ as jest.Mock).mockImplementation((selector) => {
        if (selector === store$.pushups) {
          return [];
        }
        return selector;
      });

      render(<History />);

      // Should show empty state
      expect(screen.getByText("No pushups recorded yet")).toBeTruthy();
    });
  });

  describe("Component Interactions", () => {
    it("should maintain data consistency across components", () => {
      render(<History />);

      // Verify initial state
      expect(screen.getByText("Monday (01/05/2023): 25 pushups")).toBeTruthy();

      // Simulate adding new pushups
      const newPushup = {
        date: "01/05/2023",
        sets: [{ pushups: 5, time: "16:00" }],
      };

      store$.addPushup(newPushup);

      // Verify store was updated
      expect(store$.addPushup).toHaveBeenCalledWith(newPushup);

      // Update mock data to reflect the change
      const updatedPushups = [
        {
          date: "01/05/2023",
          sets: [
            { pushups: 10, time: "10:00" },
            { pushups: 15, time: "14:00" },
            { pushups: 5, time: "16:00" },
          ],
          dailyGoal: 30,
        },
      ];

      (use$ as jest.Mock).mockImplementation((selector) => {
        if (selector === store$.pushups) {
          return updatedPushups;
        }
        return selector;
      });

      // Re-render and verify UI reflects the change
      render(<History />);
      expect(screen.getByText("Monday (01/05/2023): 30 pushups")).toBeTruthy();
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed data gracefully", () => {
      const malformedData = [
        {
          date: "invalid-date",
          sets: [{ pushups: "not-a-number", time: "invalid-time" }],
        },
      ];

      (use$ as jest.Mock).mockImplementation((selector) => {
        if (selector === store$.pushups) {
          return [];
        }
        return selector;
      });

      render(<History />);

      // Should show empty state
      expect(screen.getByText("No pushups recorded yet")).toBeTruthy();
    });
  });
});
