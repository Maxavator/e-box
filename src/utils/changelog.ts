
import { APP_VERSION, incrementVersion, compareVersions } from './version';

export type ChangeLogEntry = {
  version: string;
  date: string;
  changes: string[];
};

/**
 * Application changelog
 * Newer versions should be added at the top
 */
export const CHANGELOG: ChangeLogEntry[] = [
  {
    version: 'v2.5.0',
    date: '2024-07-15',
    changes: [
      'Added SalesKit documentation with comprehensive product information',
      'Implemented automated version increment system',
      'Integrated changelog with admin documentation portal',
      'Enhanced reporting features in admin portal',
      'Added data sovereignty and compliance documentation'
    ]
  },
  {
    version: 'v2.4.0',
    date: '2024-07-10',
    changes: [
      'Updated copyright information across application',
      'Improved version tracking system',
      'Fixed profile image upload guidelines',
      'General UI improvements and bug fixes'
    ]
  },
  {
    version: 'v2.3.0',
    date: '2024-06-28',
    changes: [
      'Improved UI spacing between sidebar and content areas',
      'Fixed user management to properly display all users within organizations',
      'Enhanced organization admin views for better user management',
      'Optimized data loading for organization users'
    ]
  },
  {
    version: 'v2.2.0',
    date: '2024-06-24',
    changes: [
      'Initial version with changelog tracking',
      'Added version management system',
      'Improved user profile sidebar',
      'Privacy enhancements to hide user email addresses',
      'UI refinements across the application'
    ]
  }
];

/**
 * Get changelog entries for display
 * @param limit Optional limit to the number of entries returned
 * @returns Array of changelog entries, sorted by newest first
 */
export function getChangelog(limit?: number): ChangeLogEntry[] {
  const sortedLog = [...CHANGELOG].sort((a, b) => {
    // Sort by version number (descending)
    return -1 * compareVersions(a.version, b.version);
  });
  
  return limit ? sortedLog.slice(0, limit) : sortedLog;
}

/**
 * Get the most recent changelog entry
 */
export function getLatestChanges(): ChangeLogEntry | undefined {
  return getChangelog(1)[0];
}

/**
 * Add a new changelog entry
 * @param changes Array of change descriptions
 * @param versionType Type of version increment: "major", "minor", or "patch"
 * @returns The new version string
 */
export function addChangelogEntry(changes: string[], versionType: 'major' | 'minor' | 'patch' = 'minor'): string {
  const newVersion = incrementVersion(APP_VERSION, versionType);
  const today = new Date().toISOString().split('T')[0];
  
  const newEntry: ChangeLogEntry = {
    version: newVersion,
    date: today,
    changes
  };
  
  // Add to the beginning of the changelog
  CHANGELOG.unshift(newEntry);
  
  return newVersion;
}
