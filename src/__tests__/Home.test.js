// __tests__/Home.test.js

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import Home from "../components/Home";
import { fetchCovidData } from "../actions";

// Mock dependencies to ensure smooth testing
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("../actions", () => ({
  fetchCovidData: jest.fn(),
}));

describe("Home Component", () => {
  // Helper function to mock the useSelector hook
  const mockSelector = (data) => {
    useSelector.mockReturnValue(data);
  };

  // Helper function to mock the useDispatch hook
  const mockDispatch = () => {
    useDispatch.mockReturnValue(jest.fn());
  };

  beforeEach(() => {
    // Reset the mock implementations before each test
    useSelector.mockReset();
    useDispatch.mockReset();
    fetchCovidData.mockReset();
  });

  it("renders loading message when covidData is empty", () => {
    // Mock empty covidData
    mockSelector([]);

    // Mock the useDispatch hook
    mockDispatch();

    // Render the component
    const { getByText } = render(<Home />);

    // Check if the loading message is rendered
    const loadingMessage = getByText("Loading...");
    expect(loadingMessage).toBeInTheDocument();

    // Ensure that fetchCovidData is called
    expect(fetchCovidData).toHaveBeenCalled();
  });

  it("renders geographical distribution of total COVID-19 cases", () => {
    // Mock covidData with some sample data
    mockSelector([
      { location: "Country 1", total_cases: 1000, countryCode: "C1" },
      { location: "Country 2", total_cases: 2000, countryCode: "C2" },
      // Add more mock data as needed...
    ]);

    // Mock the useDispatch hook
    mockDispatch();

    // Render the component
    const { getByText, getByTestId, getByLabelText } = render(<Home />);

    // Check if the component's title is rendered
    const titleElement = getByText(
      "Geographical Distribution of Total COVID-19 Cases"
    );
    expect(titleElement).toBeInTheDocument();

    // Check if legend items are rendered
    const legendItems = getByTestId("legend-item");
    expect(legendItems.children).toHaveLength(5);

    // Simulate zoom-in and zoom-out button clicks
    const zoomInButton = getByLabelText("Zoom In");
    const zoomOutButton = getByLabelText("Zoom Out");
    fireEvent.click(zoomInButton);
    fireEvent.click(zoomOutButton);

    // Add more relevant assertions as needed...
  });
});
