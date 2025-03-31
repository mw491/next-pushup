import { useColorScheme } from 'react-native';
import useColours from '../colours';

// Mock the useColorScheme hook
jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
}));

describe('useColours', () => {
  it('returns light scheme colors when color scheme is light', () => {
    // Mock the useColorScheme to return 'light'
    (useColorScheme as jest.Mock).mockReturnValue('light');

    const colours = useColours();

    expect(colours).toEqual({
      scheme: 'light',
      primary: '#007BFF',
      foreground: '#111111',
      background: '#F5F5F5',
      alt_foreground: '#222222',
      alt_background: '#E5E5E5',
    });
  });

  it('returns dark scheme colors when color scheme is dark', () => {
    // Mock the useColorScheme to return 'dark'
    (useColorScheme as jest.Mock).mockReturnValue('dark');

    const colours = useColours();

    expect(colours).toEqual({
      scheme: 'dark',
      primary: '#007BFF',
      foreground: '#F5F5F5',
      background: '#111111',
      alt_foreground: '#F9F9F9',
      alt_background: '#222222',
    });
  });

  it('defaults to light scheme colors when color scheme is null', () => {
    // Mock the useColorScheme to return null
    (useColorScheme as jest.Mock).mockReturnValue(null);

    const colours = useColours();

    expect(colours).toEqual({
      scheme: null,
      primary: '#007BFF',
      foreground: '#111111',
      background: '#F5F5F5',
      alt_foreground: '#222222',
      alt_background: '#E5E5E5',
    });
  });
}); 