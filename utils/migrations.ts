import { store$ } from './storage';
import { trackError } from './posthog';
import { Alert } from 'react-native';

interface Migration {
  version: number;
  migrate: () => void;
}

const migrations: Migration[] = [
  {
    version: 1,
    migrate: () => {
      // Add dailyGoal field to existing pushup records
      const currentPushups = store$.pushups.get();
      const currentGoal = store$.settings.get().dailyGoal;

      if (currentPushups.length > 0) {
        const updatedPushups = currentPushups.map(entry => ({
          ...entry,
          dailyGoal: entry.dailyGoal || currentGoal, // Use existing goal or current setting as fallback
        }));
        store$.pushups.set(updatedPushups);
      }
    }
  }
];

/**
 * Run all pending migrations
 * @param currentVersion - The current version of the data schema
 * @returns The new version number after migrations
 */
export const runMigrations = (currentVersion: number): number => {
  let version = currentVersion;

  migrations
    .filter(migration => migration.version > currentVersion)
    .sort((a, b) => a.version - b.version)
    .forEach(migration => {
      try {
        migration.migrate();
        version = migration.version;
      } catch (error) {
        const migrationError = error instanceof Error ? error : new Error('Unknown migration error');

        // Show user-friendly error message
        Alert.alert(
          'Data Update Error',
          'There was a problem updating your pushup data. Your data is safe, but some features might not work correctly. Please contact support if this persists.'
        );

        // Track the error in PostHog with additional context
        trackError(migrationError, {
          migrationVersion: migration.version,
          currentVersion,
          errorType: 'MigrationError',
        });
      }
    });

  return version;
}; 