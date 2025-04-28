# Changelog

All notable changes to the NEXT PUSHUP app will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Types of updates
- 📦 **[APK]** - Requires downloading and installing a new APK
- 🔄 **[OTA]** - Over-the-air update, automatically applied when opening the app

## [1.1.0-patch1](https://github.com/mw491/next-pushup/compare/v1.1.0...v1.1.0-patch1) - 28/04/2025 • 🔄 [OTA]
  ### Added
  - Opacity to distinguish between future days in the week performance component

## [1.1.0](https://github.com/mw491/next-pushup/compare/v1.0.0...v1.1.0) - 24/04/2025 • 📦 [APK](https://github.com/mw491/next-pushup/releases/tag/v1.1.0)

### Added
- Daily goal tracking for each individual day
- Data migration system to ensure backward compatibility

### Technical
- Added schema versioning to support future data structure changes
- Improved daily goal handling in settings to update today's record when changed

## [1.0.0](https://github.com/mw491/next-pushup/releases/tag/v1.0.0) • 12/04/2025 • 📦 [APK](https://github.com/mw491/next-pushup/releases/tag/v1.0.0)

### Added
- Initial release of NEXT PUSHUP
- Track daily pushup sets with time logging
- View pushup history organized by date
- Statistics dashboard showing personal best, set average, and time-based totals
- Daily goal setting with visual progress indicator
- Daily reminder notifications at customizable times
- Onboarding flow for first-time users
- Automatic light/dark theme based on system settings
- Offline-first design with local data storage

### Technical
- Built with Expo SDK 52
- React Native 0.76.9
- Expo Router for navigation
- Legend State for state management
- MMKV for persistent storage
- Expo Notifications for reminders
- PostHog analytics for anonymous usage tracking

## Template for future updates

## [x.y.z] • DD/MM/YYYY • 📦 [APK] or 🔄 [OTA]

### Added
- New features that have been added

### Changed
- Changes in existing functionality

### Fixed
- Bug fixes

### Removed
- Features that have been removed

### Security
- Security related changes or improvements

### Technical
- Technical changes that don't affect user experience but are important for developers
