import { render, screen, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";
import History from "../app/(tabs)/history";
import { store$ } from "../utils/storage";
import { use$ } from "@legendapp/state/react";

// Mock the store
jest.mock("../utils/storage", () => ({
  store$: {
    pushups: {
      get: jest.fn(),
    },
  },
}));

// Mock use$ hook
jest.mock("@legendapp/state/react", () => ({
  use$: jest.fn(),
}));

describe("History Component", () => {
  const mockPushups = [
    {
      date: "01/05/2023",
      sets: [
        { pushups: 10, time: "10:00" },
        { pushups: 15, time: "14:00" },
      ],
    },
    {
      date: "02/05/2023",
      sets: [
        { pushups: 12, time: "09:00" },
        { pushups: 18, time: "15:00" },
      ],
    },
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    // Mock use$ to return our test data
    (use$ as jest.Mock).mockImplementation((selector) => {
      if (selector === store$.pushups) {
        return mockPushups;
      }
      return selector;
    });
  });

  it("renders correctly with no pushups", () => {
    (use$ as jest.Mock).mockImplementation(() => []);
    render(<History />);
    expect(screen.getByText("No pushups recorded yet")).toBeTruthy();
  });

  it("renders correctly with pushup data", () => {
    render(<History />);

    // Check if dates are rendered
    expect(screen.getByText("Monday (01/05/2023): 25 pushups")).toBeTruthy();
    expect(screen.getByText("Tuesday (02/05/2023): 30 pushups")).toBeTruthy();

    // Check if sets are rendered - use getAllByText for multiple elements
    const set1Elements = screen.getAllByText("set 1");
    const set2Elements = screen.getAllByText("set 2");
    expect(set1Elements).toHaveLength(2); // One for each day
    expect(set2Elements).toHaveLength(2); // One for each day

    // Check pushup counts
    expect(screen.getByText("10 pushups")).toBeTruthy();
    expect(screen.getByText("15 pushups")).toBeTruthy();
    expect(screen.getByText("12 pushups")).toBeTruthy();
    expect(screen.getByText("18 pushups")).toBeTruthy();
  });

  it("sorts pushups by date in descending order", () => {
    const unsortedPushups = [
      {
        date: "02/05/2023",
        sets: [{ pushups: 10, time: "10:00" }],
      },
      {
        date: "01/05/2023",
        sets: [{ pushups: 15, time: "14:00" }],
      },
    ];

    (use$ as jest.Mock).mockImplementation(() => unsortedPushups);

    render(<History />);

    const dateHeaders = screen.getAllByText(/\(.*\)/);
    expect(dateHeaders[0].props.children).toContain("02/05/2023");
    expect(dateHeaders[1].props.children).toContain("01/05/2023");
  });

  it("displays correct total pushups for each day", () => {
    render(<History />);

    // First day total
    expect(screen.getByText("Monday (01/05/2023): 25 pushups")).toBeTruthy();
    // Second day total
    expect(screen.getByText("Tuesday (02/05/2023): 30 pushups")).toBeTruthy();
  });

  it("handles edge cases with empty sets", () => {
    const pushupsWithEmptySet = [
      {
        date: "01/05/2023",
        sets: [],
      },
    ];

    (use$ as jest.Mock).mockImplementation(() => pushupsWithEmptySet);

    render(<History />);
    expect(screen.getByText("Monday (01/05/2023): 0 pushups")).toBeTruthy();
  });

  it("handles malformed dates gracefully", () => {
    const pushupsWithInvalidDate = [
      {
        date: "invalid-date",
        sets: [{ pushups: 10, time: "10:00" }],
      },
    ];

    (use$ as jest.Mock).mockImplementation(() => pushupsWithInvalidDate);

    render(<History />);
    // Should still render without crashing
    const setElements = screen.getAllByText("set 1");
    expect(setElements.length).toBeGreaterThan(0);
  });
});
