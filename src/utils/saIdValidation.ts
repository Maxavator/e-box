
// Regular expression for SA ID validation - 13 digits
export const isSaId = (input: string): boolean => {
  const saIdRegex = /^\d{13}$/;
  return saIdRegex.test(input);
};

// Function to create email format from SA ID for authentication
export const formatSaIdToEmail = (saId: string): string => {
  return `${saId}@said.auth`;
};

// Function to format SA ID into password - always returns the standard password
export const formatSaIdPassword = (saId: string): string => {
  // All SA ID logins use this standard password
  return "StaffPass123!";
};

// Basic SA ID validation (could be expanded)
export const validateSaId = (saId: string): { isValid: boolean; message?: string } => {
  if (!saId || saId.trim() === '') {
    return { isValid: false, message: "SA ID number is required" };
  }
  
  if (!isSaId(saId)) {
    return { isValid: false, message: "SA ID must be exactly 13 digits" };
  }
  
  return { isValid: true };
};
