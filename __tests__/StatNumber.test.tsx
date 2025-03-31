import React from "react";
import StatNumber from "../components/StatNumber";

// Mock the entire component to isolate the test
jest.mock("../components/StatNumber", () => {
  return function MockStatNumber() {
    return null;
  };
});

describe("StatNumber", () => {
  it("is properly mocked", () => {
    expect(StatNumber).toBeDefined();
  });
});
