// App version information and utilities
export const APP_VERSION = 'v2.3.0';

/**
 * Compare two semver version strings
 * @returns negative if v1 < v2, positive if v1 > v2, 0 if equal
 */
export function compareVersions(v1: string, v2: string): number {
  const v1Parts = v1.replace('v', '').split('.').map(Number);
  const v2Parts = v2.replace('v', '').split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (v1Parts[i] > v2Parts[i]) return 1;
    if (v1Parts[i] < v2Parts[i]) return -1;
  }
  
  return 0;
}

/**
 * Check if version is newer than current app version
 */
export function isNewerVersion(version: string): boolean {
  return compareVersions(version, APP_VERSION) > 0;
}
