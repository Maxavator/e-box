
// Regular expression for SA ID validation
export const isSaId = (input: string): boolean => {
  const saIdRegex = /^\d{13}$/;
  return saIdRegex.test(input);
};

// Function to format SA ID into password
export const formatSaIdPassword = (saId: string): string => {
  return saId; // Use the SA ID itself as the password
};
