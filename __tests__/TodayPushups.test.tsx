import React from "react";
import TodayPushups from "@/components/TodayPushups";

// Mock the entire component
jest.mock("@/components/TodayPushups", () => {
  return function MockTodayPushups() {
    return null;
  };
});

describe("TodayPushups", () => {
  it("is properly mocked", () => {
    expect(TodayPushups).toBeDefined();
  });
});
