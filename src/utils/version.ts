
// App version information and utilities
export const APP_VERSION = 'v2.5.0';

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

/**
 * Increment version number based on semver rules
 * @param version Current version string (e.g., "v2.4.0")
 * @param type Type of increment: "major", "minor", or "patch"
 * @returns New version string
 */
export function incrementVersion(version: string, type: 'major' | 'minor' | 'patch'): string {
  const versionParts = version.replace('v', '').split('.').map(Number);
  
  switch (type) {
    case 'major':
      versionParts[0] += 1;
      versionParts[1] = 0;
      versionParts[2] = 0;
      break;
    case 'minor':
      versionParts[1] += 1;
      versionParts[2] = 0;
      break;
    case 'patch':
      versionParts[2] += 1;
      break;
  }
  
  return `v${versionParts.join('.')}`;
}
