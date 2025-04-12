# NEXT PUSHUP

A minimalist pushup tracking app to help you transform your game to the next level.

![NEXT PUSHUP App](https://github.com/mw491/next-pushup/assets/images/app-screenshot.jpg)

## Features

- 📊 Track your daily pushup sets
- 🎯 Set and monitor daily goals
- 📈 View your pushup history and statistics
- 🔔 Daily reminders to keep you consistent
- 🌙 Automatic light/dark theme based on system settings
- 📱 Works offline - all data stored locally on your device

## Installation

### Android

1. Download the latest APK from the [Releases](https://github.com/mw491/next-pushup/releases) page
2. Install the APK on your Android device
3. Allow installation from unknown sources if prompted

## Usage

1. **First Launch**: Complete the onboarding process to set your daily goal and reminder preferences
2. **Log Pushups**: Tap the "+" tab to record your pushup sets
3. **Track Progress**: View your statistics on the home screen
4. **History**: Check your past performance in the history tab
5. **Settings**: Adjust your daily goal and reminder settings

## Updates

This app uses two types of updates:

1. **APK Updates** (Require reinstallation)
   - Major version changes
   - Updates that require new native code or permissions
   - Available on the [Releases](https://github.com/mw491/next-pushup/releases) page

2. **OTA Updates** (Over-the-Air, automatic)
   - Minor improvements and bug fixes
   - UI enhancements
   - These are delivered automatically when you open the app with an internet connection

## Development

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI

### Setup

```bash
# Clone the repository
git clone https://github.com/mw491/next-pushup.git
cd next-pushup

# Install dependencies
pnpm install

# Start the development server
pnpm expo start
```

## Technologies

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Legend State](https://legendapp.com/open-source/state/) for state management
- [Expo Router](https://docs.expo.dev/router/introduction/) for navigation
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) for reminders
- [PostHog](https://posthog.com/) for analytics

## License

MIT License - See [LICENSE](LICENSE) for details.

## Privacy

NEXT PUSHUP uses PostHog analytics to collect anonymous usage data that helps us improve the app. This includes:

- App opens
- Pushup logs (count only)
- Device type and operating system version
- App performance metrics
- Crash reports

We do NOT collect:
- Personal identifiers
- Your workout history or patterns
- Your reminder settings

All your pushup data is stored locally on your device and is never transmitted to our servers except for anonymous analytics as described above.