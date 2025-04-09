import React from "react";
import { render } from "@testing-library/react-native";
import { Text, View } from "react-native";
import Card from "@/components/Card";

// Mock dependencies
jest.mock("@/utils/colours", () => ({
  __esModule: true,
  default: () => ({
    alt_background: "#F5F5F5",
    foreground: "#000000",
    background: "#FFFFFF",
  }),
}));

describe("Card", () => {
  it("renders its children correctly", () => {
    const testId = "test-child";
    const testText = "Test Content";

    const { getByTestId, getByText } = render(
      <Card>
        <View testID={testId}>
          <Text>{testText}</Text>
        </View>
      </Card>
    );

    expect(getByTestId(testId)).toBeTruthy();
    expect(getByText(testText)).toBeTruthy();
  });

  it("applies the correct styling", () => {
    const { UNSAFE_getByType } = render(
      <Card>
        <Text>Content</Text>
      </Card>
    );

    const viewElement = UNSAFE_getByType(View);

    // Check that the styling matches what we expect
    expect(viewElement.props.style).toMatchObject({
      backgroundColor: "#F5F5F5", // From our mocked colours
      borderRadius: 10,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
    });
  });
});
