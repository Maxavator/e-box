
// Regular expression for SA ID validation
export const isSaId = (input: string): boolean => {
  const saIdRegex = /^\d{13}$/;
  return saIdRegex.test(input);
};

// Function to format SA ID into password
export const formatSaIdPassword = (saId: string): string => {
  return `Test${saId}`;
};

// Function to check if it's a test account
export const isTestAccount = (saId: string): boolean => {
  return ["0000000000000", "1111111111111", "2222222222222"].includes(saId);
};
