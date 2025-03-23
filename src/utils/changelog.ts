
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

import { compareVersions } from './version';
