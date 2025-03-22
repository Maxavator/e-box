
// Regular expression for SA ID validation
export const isSaId = (input: string): boolean => {
  const saIdRegex = /^\d{13}$/;
  return saIdRegex.test(input);
};

// Function to create email format from SA ID for authentication
export const formatSaIdToEmail = (saId: string): string => {
  return `${saId}@said.auth`;
};

// Function to format SA ID into password
export const formatSaIdPassword = (saId: string): string => {
  return "StaffPass123!"; // Always use the standard password for SA ID logins
};
