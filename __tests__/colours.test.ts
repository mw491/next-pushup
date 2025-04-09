import { Appearance } from 'react-native';
import { useState, useEffect } from 'react';
import useColours from '@/utils/colours';

// Mock the Appearance API
jest.mock('react-native', () => ({
  Appearance: {
    getColorScheme: jest.fn(),
    addChangeListener: jest.fn().mockReturnValue({
      remove: jest.fn()
    }),
    setColorScheme: jest.fn()
  }
}));

// Mock React hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn()
}));

describe('useColours', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('returns light scheme colors when scheme is light', () => {
    // Mock useState to return 'light' for scheme
    (useState as jest.Mock).mockReturnValue(['light', jest.fn()]);

    // Mock Appearance.getColorScheme
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('light');

    // Mock useEffect to execute the callback immediately
    (useEffect as jest.Mock).mockImplementation(f => f());

    // Get colors
    const colors = {
      scheme: 'light',
      primary: '#007BFF',
      foreground: '#111111',
      background: '#F5F5F5',
      alt_foreground: '#222222',
      alt_background: '#E5E5E5',
    };

    // Test that the hook returns the expected colors
    expect(useColours()).toEqual(colors);
  });

  it('returns dark scheme colors when scheme is dark', () => {
    // Mock useState to return 'dark' for scheme
    (useState as jest.Mock).mockReturnValue(['dark', jest.fn()]);

    // Mock Appearance.getColorScheme
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');

    // Mock useEffect to execute the callback immediately
    (useEffect as jest.Mock).mockImplementation(f => f());

    // Get colors
    const colors = {
      scheme: 'dark',
      primary: '#007BFF',
      foreground: '#F5F5F5',
      background: '#111111',
      alt_foreground: '#F9F9F9',
      alt_background: '#222222',
    };

    // Test that the hook returns the expected colors
    expect(useColours()).toEqual(colors);
  });

  it('defaults to light scheme colors when scheme is null', () => {
    // Mock useState to return null for scheme
    (useState as jest.Mock).mockReturnValue([null, jest.fn()]);

    // Mock Appearance.getColorScheme
    (Appearance.getColorScheme as jest.Mock).mockReturnValue(null);

    // Mock useEffect to execute the callback immediately
    (useEffect as jest.Mock).mockImplementation(f => f());

    // Get colors
    const colors = {
      scheme: null,
      primary: '#007BFF',
      foreground: '#111111',
      background: '#F5F5F5',
      alt_foreground: '#222222',
      alt_background: '#E5E5E5',
    };

    // Test that the hook returns the expected colors
    expect(useColours()).toEqual(colors);
  });
});