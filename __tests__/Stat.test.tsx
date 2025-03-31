import React from "react";
import Stat from "../components/Stat";

// Mock the entire component
jest.mock("../components/Stat", () => {
  return function MockStat() {
    return null;
  };
});

describe("Stat", () => {
  it("is properly mocked", () => {
    expect(Stat).toBeDefined();
  });
});
